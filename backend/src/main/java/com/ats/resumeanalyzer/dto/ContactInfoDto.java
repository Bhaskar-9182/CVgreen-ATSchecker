package com.ats.resumeanalyzer.dto;

public class ContactInfoDto {
    private String candidateName;
    private String email;
    private String phone;
    private String linkedInUrl;
    private String gitHubUrl;
    private String portfolioUrl;

    public ContactInfoDto() {}

    public ContactInfoDto(String candidateName, String email, String phone, String linkedInUrl, String gitHubUrl, String portfolioUrl) {
        this.candidateName = candidateName;
        this.email = email;
        this.phone = phone;
        this.linkedInUrl = linkedInUrl;
        this.gitHubUrl = gitHubUrl;
        this.portfolioUrl = portfolioUrl;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLinkedInUrl() {
        return linkedInUrl;
    }

    public void setLinkedInUrl(String linkedInUrl) {
        this.linkedInUrl = linkedInUrl;
    }

    public String getGitHubUrl() {
        return gitHubUrl;
    }

    public void setGitHubUrl(String gitHubUrl) {
        this.gitHubUrl = gitHubUrl;
    }

    public String getPortfolioUrl() {
        return portfolioUrl;
    }

    public void setPortfolioUrl(String portfolioUrl) {
        this.portfolioUrl = portfolioUrl;
    }
}
