package com.ats.resumeanalyzer.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class S3Config {

    private static final Logger logger = LoggerFactory.getLogger(S3Config.class);

    @Value("${aws.s3.region:us-east-1}")
    private String region;

    @Value("${aws.s3.access-key:}")
    private String accessKey;

    @Value("${aws.s3.secret-key:}")
    private String secretKey;

    @Bean
    public S3Client s3Client() {
        if (StringUtils.hasText(accessKey) && StringUtils.hasText(secretKey)) {
            logger.info("Initializing AWS S3 Client with provided credentials for region: {}", region);
            return S3Client.builder()
                    .region(Region.of(region))
                    .credentialsProvider(StaticCredentialsProvider.create(
                            AwsBasicCredentials.create(accessKey, secretKey)))
                    .build();
        } else {
            logger.info("AWS S3 credentials not provided. Using default credentials provider or local fallback.");
            try {
                return S3Client.builder()
                        .region(Region.of(region))
                        .build();
            } catch (Exception e) {
                logger.warn("Could not create standard S3 client ({}), local storage provider will be active.", e.getMessage());
                return null;
            }
        }
    }
}
