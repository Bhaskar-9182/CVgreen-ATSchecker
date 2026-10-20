package com.ats.resumeanalyzer.service;

import com.ats.resumeanalyzer.dto.AnalysisResultDto;
import com.ats.resumeanalyzer.dto.AnalyzeResumeRequest;
import com.ats.resumeanalyzer.dto.ContactInfoDto;
import com.ats.resumeanalyzer.model.AnalysisReport;
import com.ats.resumeanalyzer.model.Resume;
import com.ats.resumeanalyzer.model.User;
import com.ats.resumeanalyzer.repository.AnalysisReportRepository;
import com.ats.resumeanalyzer.repository.ResumeRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class ResumeService {

    private static final Logger logger = LoggerFactory.getLogger(ResumeService.class);

    private final ResumeRepository resumeRepository;
    private final AnalysisReportRepository analysisReportRepository;
    private final DocumentParserService documentParserService;
    private final AtsScoringEngineService atsScoringEngineService;
    private final FileStorageService fileStorageService;
    private final ObjectMapper objectMapper;

    public ResumeService(ResumeRepository resumeRepository,
                         AnalysisReportRepository analysisReportRepository,
                         DocumentParserService documentParserService,
                         AtsScoringEngineService atsScoringEngineService,
                         FileStorageService fileStorageService,
                         ObjectMapper objectMapper) {
        this.resumeRepository = resumeRepository;
        this.analysisReportRepository = analysisReportRepository;
        this.documentParserService = documentParserService;
        this.atsScoringEngineService = atsScoringEngineService;
        this.fileStorageService = fileStorageService;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public Resume uploadResume(MultipartFile file, User user) throws IOException {
        String filename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume");
        String extension = "";
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = filename.substring(dotIndex + 1).toLowerCase();
        }

        if (!"pdf".equals(extension) && !"docx".equals(extension)) {
            throw new IllegalArgumentException("Only PDF and DOCX formats are supported. Received: " + extension);
        }

        // Parse first so invalid or text-free documents are not stored as successful uploads.
        byte[] fileBytes = file.getBytes();
        String extractedText = documentParserService.extractText(fileBytes, extension);

        FileStorageService.StorageResult storageResult = fileStorageService.storeFile(file, user != null ? user.getUsername() : "guest");

        Resume resume = new Resume();
        resume.setFileName(filename);
        resume.setFileFormat(extension);
        resume.setFileSize(file.getSize());
        resume.setStorageType(storageResult.getStorageType());
        resume.setStoragePathOrKey(storageResult.getStoragePathOrKey());
        resume.setRawExtractedText(extractedText);
        resume.setUser(user);

        return resumeRepository.save(resume);
    }

    @Transactional
    public AnalysisResultDto analyzeResume(Long resumeId, AnalyzeResumeRequest request) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new IllegalArgumentException("Resume not found with ID: " + resumeId));

        // Deterministic analysis without LLMs
        AnalysisResultDto result = atsScoringEngineService.analyze(
                resume.getRawExtractedText(),
                request.getJobTitle(),
                request.getJobDescription(),
                request.getTargetSkills()
        );

        result.setResumeId(resume.getId());
        result.setFileName(resume.getFileName());

        // Save report entity
        AnalysisReport report = new AnalysisReport();
        report.setResume(resume);
        report.setJobTitle(result.getJobTitle());
        report.setJobDescription(request.getJobDescription());
        report.setOverallScore(result.getOverallScore());
        report.setSkillMatchScore(result.getSkillMatchScore());
        report.setSectionScore(result.getSectionScore());
        report.setKeywordFrequencyScore(result.getKeywordFrequencyScore());
        report.setFormattingScore(result.getFormattingScore());
        report.setWordCount(result.getWordCount());

        try {
            report.setMatchedSkills(objectMapper.writeValueAsString(result.getMatchedSkills()));
            report.setMissingSkills(objectMapper.writeValueAsString(result.getMissingSkills()));
            report.setPresentSections(objectMapper.writeValueAsString(result.getPresentSections()));
            report.setMissingSections(objectMapper.writeValueAsString(result.getMissingSections()));
            report.setContactInfoJson(objectMapper.writeValueAsString(result.getContactInfo()));
            report.setRecommendationsJson(objectMapper.writeValueAsString(result.getRecommendations()));
        } catch (JsonProcessingException e) {
            logger.error("Failed to serialize analysis report data to JSON", e);
        }

        AnalysisReport saved = analysisReportRepository.save(report);
        result.setReportId(saved.getId());
        result.setAnalyzedAt(saved.getAnalyzedAt());

        return result;
    }

    public List<Resume> getUserResumes(User user) {
        if (user == null) {
            return resumeRepository.findAllByOrderByUploadedAtDesc();
        }
        return resumeRepository.findByUserOrderByUploadedAtDesc(user);
    }

    public Resume getResumeById(Long id) {
        return resumeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Resume not found with ID: " + id));
    }

    public AnalysisResultDto getLatestAnalysisForResume(Long resumeId) {
        Resume resume = getResumeById(resumeId);
        AnalysisReport report = analysisReportRepository.findTopByResumeOrderByAnalyzedAtDesc(resume)
                .orElse(null);

        if (report == null) {
            return null;
        }

        return mapToDto(report);
    }

    public AnalysisResultDto getAnalysisReport(Long reportId) {
        AnalysisReport report = analysisReportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("Analysis report not found with ID: " + reportId));
        return mapToDto(report);
    }

    public byte[] downloadResumeFile(Long resumeId) throws IOException {
        Resume resume = getResumeById(resumeId);
        return fileStorageService.loadFileBytes(resume.getStorageType(), resume.getStoragePathOrKey());
    }

    private AnalysisResultDto mapToDto(AnalysisReport report) {
        AnalysisResultDto dto = new AnalysisResultDto();
        dto.setReportId(report.getId());
        dto.setResumeId(report.getResume().getId());
        dto.setFileName(report.getResume().getFileName());
        dto.setJobTitle(report.getJobTitle());
        dto.setOverallScore(report.getOverallScore());
        dto.setSkillMatchScore(report.getSkillMatchScore());
        dto.setSectionScore(report.getSectionScore());
        dto.setKeywordFrequencyScore(report.getKeywordFrequencyScore());
        dto.setFormattingScore(report.getFormattingScore());
        dto.setWordCount(report.getWordCount());
        dto.setAnalyzedAt(report.getAnalyzedAt());

        try {
            if (report.getMatchedSkills() != null) {
                dto.setMatchedSkills(objectMapper.readValue(report.getMatchedSkills(), new TypeReference<List<String>>() {}));
            }
            if (report.getMissingSkills() != null) {
                dto.setMissingSkills(objectMapper.readValue(report.getMissingSkills(), new TypeReference<List<String>>() {}));
            }
            if (report.getPresentSections() != null) {
                dto.setPresentSections(objectMapper.readValue(report.getPresentSections(), new TypeReference<List<String>>() {}));
            }
            if (report.getMissingSections() != null) {
                dto.setMissingSections(objectMapper.readValue(report.getMissingSections(), new TypeReference<List<String>>() {}));
            }
            if (report.getContactInfoJson() != null) {
                dto.setContactInfo(objectMapper.readValue(report.getContactInfoJson(), ContactInfoDto.class));
            }
            if (report.getRecommendationsJson() != null) {
                dto.setRecommendations(objectMapper.readValue(report.getRecommendationsJson(), new TypeReference<List<String>>() {}));
            }
        } catch (JsonProcessingException e) {
            logger.error("Error reading JSON fields from report {}", report.getId(), e);
        }

        if (dto.getMatchedSkills() == null) dto.setMatchedSkills(new ArrayList<>());
        if (dto.getMissingSkills() == null) dto.setMissingSkills(new ArrayList<>());
        if (dto.getPresentSections() == null) dto.setPresentSections(new ArrayList<>());
        if (dto.getMissingSections() == null) dto.setMissingSections(new ArrayList<>());
        if (dto.getRecommendations() == null) dto.setRecommendations(new ArrayList<>());

        return dto;
    }
}
