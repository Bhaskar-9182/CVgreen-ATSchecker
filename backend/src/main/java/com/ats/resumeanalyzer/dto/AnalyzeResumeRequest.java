package com.ats.resumeanalyzer.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class AnalyzeResumeRequest {

    private String jobTitle;

    @NotBlank(message = "Job description cannot be empty")
    private String jobDescription;

    private List<String> targetSkills;

    public AnalyzeResumeRequest() {}

    public AnalyzeResumeRequest(String jobTitle, String jobDescription, List<String> targetSkills) {
        this.jobTitle = jobTitle;
        this.jobDescription = jobDescription;
        this.targetSkills = targetSkills;
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

    public List<String> getTargetSkills() {
        return targetSkills;
    }

    public void setTargetSkills(List<String> targetSkills) {
        this.targetSkills = targetSkills;
    }
}
