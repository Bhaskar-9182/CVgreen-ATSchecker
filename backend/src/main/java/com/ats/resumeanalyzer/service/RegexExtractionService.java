package com.ats.resumeanalyzer.service;

import com.ats.resumeanalyzer.dto.ContactInfoDto;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class RegexExtractionService {

    // Regex Patterns for Contact Extraction
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}",
            Pattern.CASE_INSENSITIVE
    );

    private static final Pattern PHONE_PATTERN = Pattern.compile(
            "(?:\\+?\\d{1,3}[-.\\s]?)?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}"
    );

    private static final Pattern LINKEDIN_PATTERN = Pattern.compile(
            "(?:https?:\\/\\/)?(?:www\\.)?linkedin\\.com\\/(?:in|profile)\\/([A-Za-z0-9_-]+)",
            Pattern.CASE_INSENSITIVE
    );

    private static final Pattern GITHUB_PATTERN = Pattern.compile(
            "(?:https?:\\/\\/)?(?:www\\.)?github\\.com\\/([A-Za-z0-9_-]+)",
            Pattern.CASE_INSENSITIVE
    );

    private static final Pattern URL_PATTERN = Pattern.compile(
            "https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&//=]*)",
            Pattern.CASE_INSENSITIVE
    );

    // Section Header Regex Patterns
    private static final Map<String, Pattern> SECTION_PATTERNS = new LinkedHashMap<>();

    static {
        SECTION_PATTERNS.put("Contact Information",
                Pattern.compile("(?i)^[\\s*#-]*(?:contact(?:s|\\s+information)?|personal\\s+details)\\b"));
        SECTION_PATTERNS.put("Summary",
                Pattern.compile("(?i)^[\\s*#-]*(?:summary|professional\\s+summary|profile|about\\s+me|career\\s+objective|objective)\\b"));
        SECTION_PATTERNS.put("Work Experience",
                Pattern.compile("(?i)^[\\s*#-]*(?:work\\s+experience|experience|professional\\s+experience|employment\\s+history|career\\s+history)\\b"));
        SECTION_PATTERNS.put("Education",
                Pattern.compile("(?i)^[\\s*#-]*(?:education|academic\\s+background|qualifications|academic\\s+history)\\b"));
        SECTION_PATTERNS.put("Skills",
                Pattern.compile("(?i)^[\\s*#-]*(?:technical\\s+skills|skills|core\\s+competencies|technologies|skill\\s+set|tools\\s*&\\s*technologies)\\b"));
        SECTION_PATTERNS.put("Projects",
                Pattern.compile("(?i)^[\\s*#-]*(?:projects|personal\\s+projects|academic\\s+projects|key\\s+projects)\\b"));
        SECTION_PATTERNS.put("Certifications",
                Pattern.compile("(?i)^[\\s*#-]*(?:certifications|certificates|licenses|accreditations)\\b"));
    }

    /**
     * Deterministically extracts candidate contact information using standard Java regular expressions.
     */
    public ContactInfoDto extractContactInfo(String rawText) {
        if (rawText == null || rawText.isBlank()) {
            return new ContactInfoDto("Unknown", null, null, null, null, null);
        }

        String email = findFirstMatch(EMAIL_PATTERN, rawText);
        String phone = findFirstMatch(PHONE_PATTERN, rawText);
        String linkedIn = findFirstMatch(LINKEDIN_PATTERN, rawText);
        String gitHub = findFirstMatch(GITHUB_PATTERN, rawText);
        String candidateName = extractCandidateName(rawText);

        String portfolio = null;
        Matcher urlMatcher = URL_PATTERN.matcher(rawText);
        while (urlMatcher.find()) {
            String found = urlMatcher.group();
            if (!found.contains("linkedin.com") && !found.contains("github.com")) {
                portfolio = found;
                break;
            }
        }

        return new ContactInfoDto(candidateName, email, phone, linkedIn, gitHub, portfolio);
    }

    /**
     * Identifies detected and missing sections using regex patterns on line headers.
     */
    public Map<String, Boolean> detectSections(String rawText) {
        Map<String, Boolean> presenceMap = new LinkedHashMap<>();
        if (rawText == null || rawText.isBlank()) {
            SECTION_PATTERNS.keySet().forEach(s -> presenceMap.put(s, false));
            return presenceMap;
        }

        String[] lines = rawText.split("\\R");
        for (Map.Entry<String, Pattern> entry : SECTION_PATTERNS.entrySet()) {
            boolean found = false;
            for (String line : lines) {
                String trimmed = line.trim();
                if (trimmed.length() <= 50 && entry.getValue().matcher(trimmed).find()) {
                    found = true;
                    break;
                }
            }
            presenceMap.put(entry.getKey(), found);
        }

        // Check if Contact Info is present via email/phone even if explicit section header is missing
        if (!presenceMap.get("Contact Information")) {
            if (EMAIL_PATTERN.matcher(rawText).find() || PHONE_PATTERN.matcher(rawText).find()) {
                presenceMap.put("Contact Information", true);
            }
        }

        return presenceMap;
    }

    private String extractCandidateName(String text) {
        String[] lines = text.split("\\R");
        for (String line : lines) {
            String trimmed = line.trim();
            // Candidate names typically appear in the first few non-blank lines and are 2-4 alphabetical words
            if (!trimmed.isEmpty() && trimmed.length() < 40) {
                if (trimmed.matches("^[A-Z][a-zA-Z'.-]+(\\s+[A-Z][a-zA-Z'.-]+){1,3}$")) {
                    return trimmed;
                }
            }
        }
        return "Candidate";
    }

    private String findFirstMatch(Pattern pattern, String text) {
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            return matcher.group().trim();
        }
        return null;
    }
}
