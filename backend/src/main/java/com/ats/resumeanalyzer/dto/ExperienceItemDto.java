package com.ats.resumeanalyzer.dto;

public class ExperienceItemDto {
    private String title;
    private String description;
    private String duration;

    public ExperienceItemDto() {}

    public ExperienceItemDto(String title, String description, String duration) {
        this.title = title;
        this.description = description;
        this.duration = duration;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }
}
