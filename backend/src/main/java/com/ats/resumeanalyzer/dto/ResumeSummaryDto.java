package com.ats.resumeanalyzer.dto;

import java.time.LocalDateTime;

public record ResumeSummaryDto(
        Long id,
        String fileName,
        String fileFormat,
        Long fileSize,
        String storageType,
        LocalDateTime uploadedAt
) {}
