package com.ats.resumeanalyzer.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Logger logger = LoggerFactory.getLogger(FileStorageService.class);

    @Value("${aws.s3.bucket-name:resume-analyzer-storage}")
    private String bucketName;

    @Value("${app.storage.local-directory:uploads/resumes}")
    private String localDirectory;

    private final S3Client s3Client;

    public static class StorageResult {
        private final String storageType;
        private final String storagePathOrKey;

        public StorageResult(String storageType, String storagePathOrKey) {
            this.storageType = storageType;
            this.storagePathOrKey = storagePathOrKey;
        }

        public String getStorageType() {
            return storageType;
        }

        public String getStoragePathOrKey() {
            return storagePathOrKey;
        }
    }

    public FileStorageService(@Autowired(required = false) S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public StorageResult storeFile(MultipartFile file, String username) throws IOException {
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume");
        String uniqueFileName = UUID.randomUUID() + "_" + originalFilename;

        // Try AWS S3 first if client is initialized
        if (s3Client != null) {
            try {
                String s3Key = "resumes/" + (username != null ? username : "guest") + "/" + uniqueFileName;
                logger.info("Uploading file {} to AWS S3 bucket {} with key {}", originalFilename, bucketName, s3Key);

                PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(s3Key)
                        .contentType(file.getContentType())
                        .build();

                s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
                return new StorageResult("S3", s3Key);
            } catch (Exception e) {
                logger.warn("AWS S3 upload failed ({}). Falling back to local storage.", e.getMessage());
            }
        }

        // Local Storage Fallback
        Path targetDir = Paths.get(localDirectory);
        if (!Files.exists(targetDir)) {
            Files.createDirectories(targetDir);
        }

        Path targetPath = targetDir.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        logger.info("Stored file locally at {}", targetPath.toAbsolutePath());

        return new StorageResult("LOCAL", targetPath.toString());
    }

    public byte[] loadFileBytes(String storageType, String storagePathOrKey) throws IOException {
        if ("S3".equalsIgnoreCase(storageType) && s3Client != null) {
            try {
                GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                        .bucket(bucketName)
                        .key(storagePathOrKey)
                        .build();
                return s3Client.getObject(getObjectRequest).readAllBytes();
            } catch (Exception e) {
                logger.error("Failed to load file from AWS S3 key: {}", storagePathOrKey, e);
                throw new IOException("Could not load file from S3: " + e.getMessage());
            }
        } else {
            Path path = Paths.get(storagePathOrKey);
            if (!Files.exists(path)) {
                throw new IOException("File not found at: " + storagePathOrKey);
            }
            return Files.readAllBytes(path);
        }
    }
}
