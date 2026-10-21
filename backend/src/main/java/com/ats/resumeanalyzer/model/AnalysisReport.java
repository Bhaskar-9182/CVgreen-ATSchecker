package com.ats.resumeanalyzer.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "analysis_reports")
public class AnalysisReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    private String jobTitle;

    @Column(columnDefinition = "TEXT")
    private String jobDescription;

    // ATS Composite and Component Scores (0 to 100)
    private int overallScore;
    private int skillMatchScore;
    private int sectionScore;
    private int keywordFrequencyScore;
    private int formattingScore;

    private int wordCount;

    // Stored as JSON strings or comma-separated lists
    @Column(columnDefinition = "TEXT")
    private String matchedSkills;

    @Column(columnDefinition = "TEXT")
    private String missingSkills;

    @Column(columnDefinition = "TEXT")
    private String presentSections;

    @Column(columnDefinition = "TEXT")
    private String missingSections;

    @Column(columnDefinition = "TEXT")
    private String contactInfoJson;

    @Column(columnDefinition = "TEXT")
    private String recommendationsJson;

    @Column(nullable = false, updatable = false)
    private LocalDateTime analyzedAt;

    public AnalysisReport() {}

    @PrePersist
    protected void onAnalyze() {
        this.analyzedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Resume getResume() {
        return resume;
    }

    public void setResume(Resume resume) {
        this.resume = resume;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
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

    public String getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(String matchedSkills) {
        this.matchedSkills = matchedSkills;
    }

    public String getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(String missingSkills) {
        this.missingSkills = missingSkills;
    }

    public String getPresentSections() {
        return presentSections;
    }

    public void setPresentSections(String presentSections) {
        this.presentSections = presentSections;
    }

    public String getMissingSections() {
        return missingSections;
    }

    public void setMissingSections(String missingSections) {
        this.missingSections = missingSections;
    }

    public String getContactInfoJson() {
        return contactInfoJson;
    }

    public void setContactInfoJson(String contactInfoJson) {
        this.contactInfoJson = contactInfoJson;
    }

    public String getRecommendationsJson() {
        return recommendationsJson;
    }

    public void setRecommendationsJson(String recommendationsJson) {
        this.recommendationsJson = recommendationsJson;
    }

    public LocalDateTime getAnalyzedAt() {
        return analyzedAt;
    }

    public void setAnalyzedAt(LocalDateTime analyzedAt) {
        this.analyzedAt = analyzedAt;
    }
}
