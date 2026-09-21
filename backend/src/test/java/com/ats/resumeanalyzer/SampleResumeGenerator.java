package com.ats.resumeanalyzer;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

public class SampleResumeGenerator {

    @Test
    void generateSampleDocuments() throws IOException {
        File samplesDir = new File("../samples");
        if (!samplesDir.exists()) {
            samplesDir.mkdirs();
        }

        generateSamplePdf(new File(samplesDir, "Sample_Resume_Senior_Java_Engineer.pdf"));
        generateSampleDocx(new File(samplesDir, "Sample_Resume_Senior_Java_Engineer.docx"));
    }

    private void generateSamplePdf(File targetFile) throws IOException {
        try (PDDocument doc = new PDDocument()) {
            PDPage page = new PDPage();
            doc.addPage(page);

            try (PDPageContentStream cs = new PDPageContentStream(doc, page)) {
                cs.beginText();
                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 16);
                cs.newLineAtOffset(50, 750);
                cs.showText("Alex Johnson - Senior Java Cloud Engineer");

                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 10);
                cs.newLineAtOffset(0, -20);
                cs.showText("alex.johnson@example.com | (555) 123-4567 | San Francisco, CA");

                cs.newLineAtOffset(0, -15);
                cs.showText("linkedin.com/in/alex-johnson-cloud | github.com/alexjohnson-dev");

                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12);
                cs.newLineAtOffset(0, -25);
                cs.showText("PROFESSIONAL SUMMARY");

                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 10);
                cs.newLineAtOffset(0, -15);
                cs.showText("Accomplished Software Engineer with 6+ years specializing in Java, Spring Boot, MySQL, and AWS.");
                cs.newLineAtOffset(0, -15);
                cs.showText("Extensive experience building resilient microservices, Docker containerization, and RESTful APIs.");

                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12);
                cs.newLineAtOffset(0, -25);
                cs.showText("TECHNICAL SKILLS");

                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 10);
                cs.newLineAtOffset(0, -15);
                cs.showText("Languages & Frameworks: Java 17/21, Spring Boot, Hibernate, JPA, REST API, JUnit, Mockito");
                cs.newLineAtOffset(0, -15);
                cs.showText("Cloud & Infrastructure: AWS S3, EC2, RDS, Docker, Kubernetes, CI/CD, Git, Linux");
                cs.newLineAtOffset(0, -15);
                cs.showText("Databases & Tools: MySQL, PostgreSQL, Redis, Maven, Swagger, Jira, Agile/Scrum");

                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12);
                cs.newLineAtOffset(0, -25);
                cs.showText("WORK EXPERIENCE");

                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 10);
                cs.newLineAtOffset(0, -15);
                cs.showText("Senior Software Engineer - CloudScale Technologies (2021 - Present)");

                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 10);
                cs.newLineAtOffset(0, -15);
                cs.showText("- Architected scalable microservices using Spring Boot and Java with 99.99% uptime.");
                cs.newLineAtOffset(0, -15);
                cs.showText("- Integrated AWS S3 for document storage and automated data ingestion pipelines.");
                cs.newLineAtOffset(0, -15);
                cs.showText("- Engineered MySQL relational database queries and indexing, cutting latency by 35%.");
                cs.newLineAtOffset(0, -15);
                cs.showText("- Deployed Docker containers via CI/CD pipelines to Amazon ECS / Kubernetes clusters.");

                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12);
                cs.newLineAtOffset(0, -25);
                cs.showText("EDUCATION");

                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 10);
                cs.newLineAtOffset(0, -15);
                cs.showText("B.S. in Computer Science - University of California, Berkeley");

                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12);
                cs.newLineAtOffset(0, -25);
                cs.showText("CERTIFICATIONS");

                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 10);
                cs.newLineAtOffset(0, -15);
                cs.showText("- AWS Certified Solutions Architect - Associate");
                cs.newLineAtOffset(0, -15);
                cs.showText("- Oracle Certified Professional: Java SE Developer");

                cs.endText();
            }

            doc.save(targetFile);
        }
    }

    private void generateSampleDocx(File targetFile) throws IOException {
        try (XWPFDocument doc = new XWPFDocument();
             FileOutputStream fos = new FileOutputStream(targetFile)) {

            XWPFParagraph title = doc.createParagraph();
            XWPFRun r0 = title.createRun();
            r0.setBold(true);
            r0.setFontSize(16);
            r0.setText("Alex Johnson - Senior Java Cloud Engineer");

            XWPFParagraph contact = doc.createParagraph();
            XWPFRun r1 = contact.createRun();
            r1.setText("alex.johnson@example.com | (555) 123-4567 | San Francisco, CA");
            r1.addBreak();
            r1.setText("linkedin.com/in/alex-johnson-cloud | github.com/alexjohnson-dev");

            XWPFParagraph summaryHeader = doc.createParagraph();
            XWPFRun r2 = summaryHeader.createRun();
            r2.setBold(true);
            r2.setText("PROFESSIONAL SUMMARY");

            XWPFParagraph summaryText = doc.createParagraph();
            XWPFRun r3 = summaryText.createRun();
            r3.setText("Experienced Java Developer with strong expertise in Spring Boot, MySQL, AWS cloud architecture, and microservices.");

            XWPFParagraph skillsHeader = doc.createParagraph();
            XWPFRun r4 = skillsHeader.createRun();
            r4.setBold(true);
            r4.setText("TECHNICAL SKILLS");

            XWPFParagraph skillsText = doc.createParagraph();
            XWPFRun r5 = skillsText.createRun();
            r5.setText("Java, Spring Boot, MySQL, AWS, Docker, Kubernetes, REST API, Git, Hibernate, JUnit");

            XWPFParagraph expHeader = doc.createParagraph();
            XWPFRun r6 = expHeader.createRun();
            r6.setBold(true);
            r6.setText("WORK EXPERIENCE");

            XWPFParagraph expText = doc.createParagraph();
            XWPFRun r7 = expText.createRun();
            r7.setText("Senior Software Engineer at CloudScale. Developed high throughput Spring Boot microservices and automated deployments with Docker.");

            XWPFParagraph eduHeader = doc.createParagraph();
            XWPFRun r8 = eduHeader.createRun();
            r8.setBold(true);
            r8.setText("EDUCATION");

            XWPFParagraph eduText = doc.createParagraph();
            XWPFRun r9 = eduText.createRun();
            r9.setText("B.S. in Computer Science - UC Berkeley");

            doc.write(fos);
        }
    }
}
