package com.ats.resumeanalyzer;

import com.ats.resumeanalyzer.dto.AnalysisResultDto;
import com.ats.resumeanalyzer.service.AtsScoringEngineService;
import com.ats.resumeanalyzer.service.RegexExtractionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class AtsScoringEngineServiceTest {

    private AtsScoringEngineService atsScoringEngineService;

    @BeforeEach
    void setUp() {
        RegexExtractionService regexService = new RegexExtractionService();
        atsScoringEngineService = new AtsScoringEngineService(regexService);
    }

    @Test
    void testAtsScoringMatchingAndSetOperations() {
        String resume = """
                John Smith
                john.smith@gmail.com | (212) 555-0199 | linkedin.com/in/johnsmith
                
                SUMMARY
                Senior Backend Engineer specializing in Java microservices and cloud deployment.
                
                SKILLS
                Java, Spring Boot, MySQL, Docker, REST API, Git
                
                WORK EXPERIENCE
                Lead Developer at Enterprise Inc (2020 - Present)
                - Built high throughput REST APIs using Spring Boot and Java.
                - Containerized services with Docker and deployed them to production.
                - Optimized MySQL relational database queries for high volume transactions.
                
                EDUCATION
                Bachelor of Science in Computer Information Systems
                """;

        String jobDescription = """
                We are looking for a Senior Java Developer with strong expertise in:
                Java, Spring Boot, MySQL, Docker, Kubernetes, AWS, and REST API.
                Must have solid understanding of Git and Microservices architecture.
                """;

        AnalysisResultDto result = atsScoringEngineService.analyze(
                resume,
                "Senior Java Developer",
                jobDescription,
                null
        );

        assertNotNull(result);
        assertTrue(result.getOverallScore() > 50, "Expected composite score > 50 for good match");

        // Verify Set Intersection (Matched Skills)
        List<String> matched = result.getMatchedSkills().stream().map(String::toLowerCase).toList();
        assertTrue(matched.contains("java"));
        assertTrue(matched.contains("spring boot"));
        assertTrue(matched.contains("mysql"));
        assertTrue(matched.contains("docker"));

        // Verify Set Difference (Missing Skills)
        List<String> missing = result.getMissingSkills().stream().map(String::toLowerCase).toList();
        assertTrue(missing.contains("aws") || missing.contains("kubernetes"));

        // Verify deterministic recommendations
        assertFalse(result.getRecommendations().isEmpty());
    }
}
