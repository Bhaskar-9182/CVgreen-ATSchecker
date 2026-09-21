package com.ats.resumeanalyzer.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class AnalysisResultDto {
    private Long reportId;
    private Long resumeId;
    private String fileName;
    private String jobTitle;

    private int overallScore;
    private int skillMatchScore;
    private int sectionScore;
    private int keywordFrequencyScore;
    private int formattingScore;

    private int wordCount;

    private List<String> matchedSkills = new ArrayList<>();
    private List<String> missingSkills = new ArrayList<>();
    private List<String> presentSections = new ArrayList<>();
    private List<String> missingSections = new ArrayList<>();

    private ContactInfoDto contactInfo;
    private List<String> recommendations = new ArrayList<>();

    // Enhanced NLP & Algorithmic ATS metrics
    private List<ExperienceItemDto> careerProgression = new ArrayList<>();
    private List<String> credentials = new ArrayList<>();
    private String seniorityLevel;
    private double totalExperienceYears;
    private int optimizedScore;
    private int optimizedMatchCount;
    private int targetKeywordTotal;
    private String readabilityIndex;
    private String optimizedResumeText;

    private LocalDateTime analyzedAt;

    public AnalysisResultDto() {}

    // Getters and Setters
    public Long getReportId() {
        return reportId;
    }

    public void setReportId(Long reportId) {
        this.reportId = reportId;
    }

    public Long getResumeId() {
        return resumeId;
    }

    public void setResumeId(Long resumeId) {
        this.resumeId = resumeId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public int getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(int overallScore) {
        this.overallScore = overallScore;
    }

    public int getSkillMatchScore() {
        return skillMatchScore;
    }

    public void setSkillMatchScore(int skillMatchScore) {
        this.skillMatchScore = skillMatchScore;
    }

    public int getSectionScore() {
        return sectionScore;
    }

    public void setSectionScore(int sectionScore) {
        this.sectionScore = sectionScore;
    }

    public int getKeywordFrequencyScore() {
        return keywordFrequencyScore;
    }

    public void setKeywordFrequencyScore(int keywordFrequencyScore) {
        this.keywordFrequencyScore = keywordFrequencyScore;
    }

    public int getFormattingScore() {
        return formattingScore;
    }

    public void setFormattingScore(int formattingScore) {
        this.formattingScore = formattingScore;
    }

    public int getWordCount() {
        return wordCount;
    }

    public void setWordCount(int wordCount) {
        this.wordCount = wordCount;
    }

    public List<String> getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(List<String> matchedSkills) {
        this.matchedSkills = matchedSkills;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }

    public List<String> getPresentSections() {
        return presentSections;
    }

    public void setPresentSections(List<String> presentSections) {
        this.presentSections = presentSections;
    }

    public List<String> getMissingSections() {
        return missingSections;
    }

    public void setMissingSections(List<String> missingSections) {
        this.missingSections = missingSections;
    }

    public ContactInfoDto getContactInfo() {
        return contactInfo;
    }

    public void setContactInfo(ContactInfoDto contactInfo) {
        this.contactInfo = contactInfo;
    }

    public List<String> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<String> recommendations) {
        this.recommendations = recommendations;
    }

    public List<ExperienceItemDto> getCareerProgression() {
        return careerProgression;
    }

    public void setCareerProgression(List<ExperienceItemDto> careerProgression) {
        this.careerProgression = careerProgression;
    }

    public List<String> getCredentials() {
        return credentials;
    }

    public void setCredentials(List<String> credentials) {
        this.credentials = credentials;
    }

    public String getSeniorityLevel() {
        return seniorityLevel;
    }

    public void setSeniorityLevel(String seniorityLevel) {
        this.seniorityLevel = seniorityLevel;
    }

    public double getTotalExperienceYears() {
        return totalExperienceYears;
    }

    public void setTotalExperienceYears(double totalExperienceYears) {
        this.totalExperienceYears = totalExperienceYears;
    }

    public int getOptimizedScore() {
        return optimizedScore;
    }

    public void setOptimizedScore(int optimizedScore) {
        this.optimizedScore = optimizedScore;
    }

    public int getOptimizedMatchCount() {
        return optimizedMatchCount;
    }

    public void setOptimizedMatchCount(int optimizedMatchCount) {
        this.optimizedMatchCount = optimizedMatchCount;
    }

    public int getTargetKeywordTotal() {
        return targetKeywordTotal;
    }

    public void setTargetKeywordTotal(int targetKeywordTotal) {
        this.targetKeywordTotal = targetKeywordTotal;
    }

    public String getReadabilityIndex() {
        return readabilityIndex;
    }

    public void setReadabilityIndex(String readabilityIndex) {
        this.readabilityIndex = readabilityIndex;
    }

    public String getOptimizedResumeText() {
        return optimizedResumeText;
    }

    public void setOptimizedResumeText(String optimizedResumeText) {
        this.optimizedResumeText = optimizedResumeText;
    }

    public LocalDateTime getAnalyzedAt() {
        return analyzedAt;
    }

    public void setAnalyzedAt(LocalDateTime analyzedAt) {
        this.analyzedAt = analyzedAt;
    }
}
