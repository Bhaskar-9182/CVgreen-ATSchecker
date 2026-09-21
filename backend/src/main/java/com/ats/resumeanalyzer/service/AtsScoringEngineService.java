package com.ats.resumeanalyzer.service;

import com.ats.resumeanalyzer.dto.AnalysisResultDto;
import com.ats.resumeanalyzer.dto.ContactInfoDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class AtsScoringEngineService {

    private static final Logger logger = LoggerFactory.getLogger(AtsScoringEngineService.class);

    // Standard English Stop Words (Standard Lucene/NLTK stop-words list)
    private static final Set<String> STOP_WORDS = new HashSet<>(Arrays.asList(
            "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
            "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
            "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't",
            "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have",
            "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself",
            "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into",
            "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my",
            "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our",
            "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's",
            "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs",
            "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're",
            "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't",
            "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's",
            "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't",
            "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself",
            "yourselves", "will", "shall", "can", "may", "might", "must", "also", "using", "work", "role"
    ));

    // Curated Industry Skill Dictionary / Taxonomy (Canonical representation)
    private static final List<String> SKILL_TAXONOMY = Arrays.asList(
            // Languages & Frameworks
            "Java", "Spring", "Spring Boot", "Hibernate", "JPA", "Microservices", "REST API", "GraphQL",
            "Python", "Django", "Flask", "FastAPI", "Pandas", "NumPy",
            "JavaScript", "TypeScript", "React", "React.js", "Angular", "Vue", "Vue.js", "Next.js", "Node.js", "Express",
            "HTML", "HTML5", "CSS", "CSS3", "Sass", "Tailwind CSS", "Bootstrap",
            "C", "C++", "C#", ".NET", ".NET Core", "ASP.NET", "PHP", "Laravel", "Go", "Golang", "Rust", "Kotlin", "Swift",
            // Cloud & DevOps
            "AWS", "Amazon Web Services", "EC2", "S3", "Lambda", "ECS", "EKS", "RDS", "DynamoDB", "CloudFront",
            "Azure", "Google Cloud", "GCP", "Docker", "Kubernetes", "Terraform", "Ansible", "CI/CD",
            "Jenkins", "GitHub Actions", "GitLab CI", "Linux", "Bash", "Shell Scripting",
            // Databases & Messaging
            "MySQL", "PostgreSQL", "Oracle", "SQL Server", "MongoDB", "Cassandra", "Redis", "Elasticsearch",
            "Kafka", "RabbitMQ", "ActiveMQ", "SQL", "NoSQL",
            // Architecture & Practices
            "OOP", "Object-Oriented Programming", "Design Patterns", "SOLID", "TDD", "Clean Code",
            "Agile", "Scrum", "Jira", "Git", "GitHub", "GitLab", "Bitbucket",
            "Unit Testing", "JUnit", "Mockito", "Selenium", "Cypress", "Postman", "Swagger", "OpenAPI",
            // Data & AI / Analytics Concepts (Rule-based detection)
            "Machine Learning", "Deep Learning", "Data Analysis", "Data Science", "ETL", "Spark", "Hadoop", "Tableau", "Power BI"
    );

    private final RegexExtractionService regexExtractionService;

    public AtsScoringEngineService(RegexExtractionService regexExtractionService) {
        this.regexExtractionService = regexExtractionService;
    }

    /**
     * Executes deterministic ATS scoring matching resume against job description.
     */
    public AnalysisResultDto analyze(String resumeText, String jobTitle, String jobDescription, List<String> explicitTargetSkills) {
        if (resumeText == null) {
            resumeText = "";
        }
        if (jobDescription == null) {
            jobDescription = "";
        }

        // 1. Tokenize & clean texts
        int wordCount = countWords(resumeText);

        // 2. Extract skills from Job Description + any explicit target skills
        Set<String> targetSkills = extractTargetSkills(jobDescription, explicitTargetSkills);

        // 3. Extract skills present in Resume
        Set<String> resumeSkills = extractSkillsFromText(resumeText);

        // 4. Set operations (Intersection & Difference)
        Set<String> matchedSkills = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
        for (String skill : targetSkills) {
            if (isSkillPresent(resumeText, resumeSkills, skill)) {
                matchedSkills.add(skill);
            }
        }

        Set<String> missingSkills = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
        for (String skill : targetSkills) {
            if (!matchedSkills.contains(skill)) {
                missingSkills.add(skill);
            }
        }

        // 5. Section detection
        Map<String, Boolean> sectionPresence = regexExtractionService.detectSections(resumeText);
        List<String> presentSections = sectionPresence.entrySet().stream()
                .filter(Map.Entry::getValue)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
        List<String> missingSections = sectionPresence.entrySet().stream()
                .filter(e -> !e.getValue())
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        // 6. Contact info extraction
        ContactInfoDto contactInfo = regexExtractionService.extractContactInfo(resumeText);

        // 7. Calculate individual component scores (0 - 100)
        int skillMatchScore = calculateSkillScore(matchedSkills.size(), targetSkills.size());
        int sectionScore = calculateSectionScore(sectionPresence);
        int keywordFrequencyScore = calculateKeywordFrequencyScore(resumeText, matchedSkills);
        int formattingScore = calculateFormattingScore(wordCount, contactInfo);

        // 8. Calculate Composite Weighted ATS Score
        // Weights: Skill Match 50%, Section Completeness 20%, Keyword Frequency 15%, Formatting/Readability 15%
        int overallScore = Math.round(
                (skillMatchScore * 0.50f) +
                (sectionScore * 0.20f) +
                (keywordFrequencyScore * 0.15f) +
                (formattingScore * 0.15f)
        );
        overallScore = Math.min(100, Math.max(0, overallScore));

        // 9. Generate Deterministic Rule-Based Recommendations
        List<String> recommendations = generateRecommendations(
                missingSkills, missingSections, wordCount, contactInfo, skillMatchScore, overallScore
        );

        // 10. Assemble DTO
        AnalysisResultDto result = new AnalysisResultDto();
        result.setJobTitle(jobTitle != null && !jobTitle.isBlank() ? jobTitle : "Target Role");
        result.setOverallScore(overallScore);
        result.setSkillMatchScore(skillMatchScore);
        result.setSectionScore(sectionScore);
        result.setKeywordFrequencyScore(keywordFrequencyScore);
        result.setFormattingScore(formattingScore);
        result.setWordCount(wordCount);
        result.setMatchedSkills(new ArrayList<>(matchedSkills));
        result.setMissingSkills(new ArrayList<>(missingSkills));
        result.setPresentSections(presentSections);
        result.setMissingSections(missingSections);
        result.setContactInfo(contactInfo);
        result.setRecommendations(recommendations);

        return result;
    }

    private int countWords(String text) {
        if (text == null || text.isBlank()) return 0;
        String[] tokens = text.trim().split("\\s+");
        return tokens.length;
    }

    private Set<String> extractTargetSkills(String jobDescription, List<String> explicitSkills) {
        Set<String> skills = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);

        if (explicitSkills != null) {
            for (String s : explicitSkills) {
                if (s != null && !s.trim().isEmpty()) {
                    skills.add(s.trim());
                }
            }
        }

        if (jobDescription != null && !jobDescription.isBlank()) {
            skills.addAll(extractSkillsFromText(jobDescription));
        }

        // If job description is minimal and no skills were found, seed with common core software skills
        if (skills.isEmpty()) {
            skills.addAll(Arrays.asList("Java", "Spring Boot", "SQL", "REST API", "Git"));
        }

        return skills;
    }

    public Set<String> extractSkillsFromText(String text) {
        Set<String> found = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
        if (text == null || text.isBlank()) {
            return found;
        }

        String lowerText = " " + text.toLowerCase() + " ";

        for (String skill : SKILL_TAXONOMY) {
            String regex = "(?i)(?<![a-zA-Z0-9_])" + Pattern.quote(skill.toLowerCase()) + "(?![a-zA-Z0-9_])";
            if (Pattern.compile(regex).matcher(lowerText).find()) {
                found.add(skill);
            }
        }
        return found;
    }

    private boolean isSkillPresent(String text, Set<String> extractedSkills, String skill) {
        if (extractedSkills.contains(skill)) {
            return true;
        }
        String regex = "(?i)(?<![a-zA-Z0-9_])" + Pattern.quote(skill.toLowerCase()) + "(?![a-zA-Z0-9_])";
        return Pattern.compile(regex).matcher(" " + text.toLowerCase() + " ").find();
    }

    private int calculateSkillScore(int matchedCount, int targetCount) {
        if (targetCount == 0) return 100;
        float ratio = (float) matchedCount / targetCount;
        return Math.min(100, Math.round(ratio * 100));
    }

    private int calculateSectionScore(Map<String, Boolean> sections) {
        if (sections == null || sections.isEmpty()) return 0;
        int total = sections.size();
        long present = sections.values().stream().filter(Boolean::booleanValue).count();
        return Math.round(((float) present / total) * 100);
    }

    private int calculateKeywordFrequencyScore(String text, Set<String> matchedSkills) {
        if (text == null || text.isBlank() || matchedSkills.isEmpty()) return 50;

        int totalOccurrences = 0;
        String lower = text.toLowerCase();
        for (String skill : matchedSkills) {
            Matcher m = Pattern.compile("(?i)\\b" + Pattern.quote(skill.toLowerCase()) + "\\b").matcher(lower);
            while (m.find()) {
                totalOccurrences++;
            }
        }

        int wordCount = countWords(text);
        if (wordCount == 0) return 0;

        // Keyword density = total occurrences of matched skills / total words
        float density = ((float) totalOccurrences / wordCount) * 100.0f;

        // Ideal ATS density for key skills is typically 2% - 6%
        if (density >= 1.5f && density <= 6.0f) {
            return 100;
        } else if (density > 0.5f && density < 1.5f) {
            return 80;
        } else if (density > 6.0f && density <= 9.0f) {
            return 75; // mild keyword stuffing
        } else if (density > 9.0f) {
            return 55; // high keyword stuffing penalty
        } else {
            return 40; // very sparse
        }
    }

    private int calculateFormattingScore(int wordCount, ContactInfoDto contact) {
        int score = 100;

        // Word Count Check (Ideal 400 - 1000 words for a standard 1-2 page resume)
        if (wordCount < 150) {
            score -= 40;
        } else if (wordCount < 300) {
            score -= 20;
        } else if (wordCount > 1500) {
            score -= 25; // overly verbose
        }

        // Contact info checks
        if (contact.getEmail() == null || contact.getEmail().isBlank()) {
            score -= 20;
        }
        if (contact.getPhone() == null || contact.getPhone().isBlank()) {
            score -= 15;
        }
        if (contact.getLinkedInUrl() == null && contact.getGitHubUrl() == null) {
            score -= 10;
        }

        return Math.max(20, score);
    }

    private List<String> generateRecommendations(Set<String> missingSkills,
                                                List<String> missingSections,
                                                int wordCount,
                                                ContactInfoDto contact,
                                                int skillMatchScore,
                                                int overallScore) {
        List<String> tips = new ArrayList<>();

        // Missing Skills Recommendations
        if (!missingSkills.isEmpty()) {
            List<String> topMissing = missingSkills.stream().limit(6).collect(Collectors.toList());
            tips.add("Add missing key skills requested by the job description: " + String.join(", ", topMissing) + ".");
        }

        // Missing Sections Recommendations
        if (!missingSections.isEmpty()) {
            tips.add("Include explicit standard section headers for: " + String.join(", ", missingSections) + ".");
        }

        // Word Count Recommendations
        if (wordCount < 350) {
            tips.add("Your resume length is currently " + wordCount + " words. Expand on your project impact, responsibilities, and quantified metrics to reach standard length (450-900 words).");
        } else if (wordCount > 1400) {
            tips.add("Your resume length is " + wordCount + " words, which may exceed optimal ATS readability. Aim to condense bullet points to keep it focused.");
        }

        // Contact Info Recommendations
        if (contact.getEmail() == null) {
            tips.add("Ensure your email address is clearly visible at the top of your resume.");
        }
        if (contact.getPhone() == null) {
            tips.add("Add a valid phone number for recruiter contact.");
        }
        if (contact.getLinkedInUrl() == null) {
            tips.add("Include your LinkedIn profile URL to boost recruiter engagement.");
        }
        if (contact.getGitHubUrl() == null) {
            tips.add("For technical roles, adding your GitHub profile helps recruiters verify your codebase experience.");
        }

        // General Score Feedback
        if (overallScore >= 80) {
            tips.add("Excellent ATS alignment! Your profile demonstrates strong keyword relevance and structured formatting.");
        } else if (overallScore >= 60) {
            tips.add("Good overall profile. Incorporate the missing technical keywords into your Work Experience bullet points to pass automated ATS filters.");
        } else {
            tips.add("Significant optimization needed. Align your technical skills and project descriptions directly with the target job posting.");
        }

        return tips;
    }
}
