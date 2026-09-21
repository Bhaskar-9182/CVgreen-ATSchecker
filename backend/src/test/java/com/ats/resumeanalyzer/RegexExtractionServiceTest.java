package com.ats.resumeanalyzer;

import com.ats.resumeanalyzer.dto.ContactInfoDto;
import com.ats.resumeanalyzer.service.RegexExtractionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class RegexExtractionServiceTest {

    private RegexExtractionService regexExtractionService;

    @BeforeEach
    void setUp() {
        regexExtractionService = new RegexExtractionService();
    }

    @Test
    void testExtractContactInfo() {
        String sampleResume = """
                Alex Johnson
                alex.johnson@example.com | (555) 123-4567 | San Francisco, CA
                linkedin.com/in/alex-johnson-dev | github.com/alexjohnson-code
                https://alexjohnson.portfolio.dev
                
                SUMMARY
                Experienced Software Engineer with 5+ years building distributed cloud applications.
                
                TECHNICAL SKILLS
                Languages: Java, Python, TypeScript
                Frameworks: Spring Boot, React, Node.js
                Cloud & DevOps: AWS, Docker, Kubernetes
                
                WORK EXPERIENCE
                Senior Cloud Developer - Tech Corp (2021 - Present)
                - Architected microservices with Spring Boot and AWS S3.
                
                EDUCATION
                B.S. in Computer Science - University of California
                """;

        ContactInfoDto contact = regexExtractionService.extractContactInfo(sampleResume);

        assertEquals("alex.johnson@example.com", contact.getEmail());
        assertEquals("(555) 123-4567", contact.getPhone());
        assertTrue(contact.getLinkedInUrl().contains("alex-johnson-dev"));
        assertTrue(contact.getGitHubUrl().contains("alexjohnson-code"));
        assertEquals("Alex Johnson", contact.getCandidateName());
    }

    @Test
    void testDetectSections() {
        String sampleResume = """
                Jane Doe
                jane@example.com
                
                PROFESSIONAL SUMMARY
                Passionate developer.
                
                TECHNICAL SKILLS
                Java, Docker, MySQL
                
                WORK EXPERIENCE
                Software Engineer at Acme.
                
                EDUCATION
                B.Tech in Computer Science
                
                KEY PROJECTS
                Cloud Resume Analyzer ATS System
                
                CERTIFICATIONS
                AWS Certified Solutions Architect
                """;

        Map<String, Boolean> sections = regexExtractionService.detectSections(sampleResume);

        assertTrue(sections.get("Contact Information"));
        assertTrue(sections.get("Summary"));
        assertTrue(sections.get("Skills"));
        assertTrue(sections.get("Work Experience"));
        assertTrue(sections.get("Education"));
        assertTrue(sections.get("Projects"));
        assertTrue(sections.get("Certifications"));
    }
}
