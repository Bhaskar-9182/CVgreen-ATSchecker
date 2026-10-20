package com.ats.resumeanalyzer.controller;

import com.ats.resumeanalyzer.dto.AnalysisResultDto;
import com.ats.resumeanalyzer.dto.AnalyzeResumeRequest;
import com.ats.resumeanalyzer.dto.ResumeSummaryDto;
import com.ats.resumeanalyzer.model.Resume;
import com.ats.resumeanalyzer.model.User;
import com.ats.resumeanalyzer.service.ResumeService;
import com.ats.resumeanalyzer.service.UserService;
import com.ats.resumeanalyzer.service.RegexExtractionService;
import com.ats.resumeanalyzer.service.AtsScoringEngineService;
import jakarta.validation.Valid;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resumes")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ResumeController {

    private final ResumeService resumeService;
    private final UserService userService;
    private final RegexExtractionService regexExtractionService;
    private final AtsScoringEngineService atsScoringEngineService;

    public ResumeController(ResumeService resumeService,
                            UserService userService,
                            RegexExtractionService regexExtractionService,
                            AtsScoringEngineService atsScoringEngineService) {
        this.resumeService = resumeService;
        this.userService = userService;
        this.regexExtractionService = regexExtractionService;
        this.atsScoringEngineService = atsScoringEngineService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadResume(@RequestParam("file") MultipartFile file,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User user = userDetails != null ? userService.getByUsername(userDetails.getUsername()) : null;
            Resume resume = resumeService.uploadResume(file, user);
            String rawText = resume.getRawExtractedText();

            // Extract contact info & skills for instant pre-check in UI
            var contactInfo = regexExtractionService.extractContactInfo(rawText);
            var extractedSkills = atsScoringEngineService.extractSkillsFromText(rawText);
            var sections = regexExtractionService.detectSections(rawText);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Resume uploaded and parsed successfully");
            response.put("resumeId", resume.getId());
            response.put("fileName", resume.getFileName());
            response.put("fileFormat", resume.getFileFormat());
            response.put("fileSize", resume.getFileSize());
            response.put("storageType", resume.getStorageType());
            response.put("uploadedAt", resume.getUploadedAt());
            response.put("previewSnippet", rawText != null && rawText.length() > 300 ?
                    rawText.substring(0, 300) + "..." : rawText);
            response.put("contactInfo", contactInfo);
            response.put("extractedSkills", extractedSkills);
            response.put("sections", sections);

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Upload failed: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/analyze")
    public ResponseEntity<?> analyzeResume(@PathVariable("id") Long resumeId,
                                           @Valid @RequestBody AnalyzeResumeRequest request) {
        try {
            AnalysisResultDto result = resumeService.analyzeResume(resumeId, request);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Analysis failed: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<ResumeSummaryDto>> getResumes(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getByUsername(userDetails.getUsername());
        List<ResumeSummaryDto> resumes = resumeService.getUserResumes(user).stream()
                .map(resume -> new ResumeSummaryDto(
                        resume.getId(),
                        resume.getFileName(),
                        resume.getFileFormat(),
                        resume.getFileSize(),
                        resume.getStorageType(),
                        resume.getUploadedAt()))
                .toList();
        return ResponseEntity.ok(resumes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getResume(@PathVariable("id") Long resumeId) {
        try {
            Resume resume = resumeService.getResumeById(resumeId);
            return ResponseEntity.ok(resume);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/latest-report")
    public ResponseEntity<?> getLatestReport(@PathVariable("id") Long resumeId) {
        AnalysisResultDto report = resumeService.getLatestAnalysisForResume(resumeId);
        if (report == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(report);
    }

    @GetMapping("/reports/{reportId}")
    public ResponseEntity<?> getReportById(@PathVariable("reportId") Long reportId) {
        try {
            AnalysisResultDto report = resumeService.getAnalysisReport(reportId);
            return ResponseEntity.ok(report);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<?> downloadResume(@PathVariable("id") Long resumeId) {
        try {
            Resume resume = resumeService.getResumeById(resumeId);
            byte[] data = resumeService.downloadResumeFile(resumeId);

            String mediaType = "application/pdf";
            if ("docx".equalsIgnoreCase(resume.getFileFormat())) {
                mediaType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resume.getFileName() + "\"")
                    .contentType(MediaType.parseMediaType(mediaType))
                    .contentLength(data.length)
                    .body(new ByteArrayResource(data));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to retrieve file: " + e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
