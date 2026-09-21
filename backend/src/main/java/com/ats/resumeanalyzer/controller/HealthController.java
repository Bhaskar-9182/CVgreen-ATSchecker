package com.ats.resumeanalyzer.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Value("${aws.s3.bucket-name:resume-analyzer-storage}")
    private String s3Bucket;

    @Value("${aws.s3.region:us-east-1}")
    private String s3Region;

    @GetMapping
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "Cloud-Based Resume Analyzer with ATS Scoring System");
        health.put("engine", "Deterministic Java Algorithm (Non-LLM)");
        health.put("pdfParser", "Apache PDFBox 3.0");
        health.put("docxParser", "Apache POI 5.3");
        health.put("cloudStorageTarget", s3Bucket + " (" + s3Region + ")");
        health.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(health);
    }
}
