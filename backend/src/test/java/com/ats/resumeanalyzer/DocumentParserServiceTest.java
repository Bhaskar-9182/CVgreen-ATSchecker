package com.ats.resumeanalyzer;

import com.ats.resumeanalyzer.service.DocumentParserService;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFTable;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;

class DocumentParserServiceTest {

    private final DocumentParserService documentParserService = new DocumentParserService();

    @Test
    void extractsParagraphsAndTablesFromDocx() throws IOException {
        byte[] docxBytes;
        try (XWPFDocument document = new XWPFDocument();
             ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            document.createParagraph().createRun().setText("Alex Morgan");
            document.createParagraph().createRun().setText("alex.morgan@example.com");
            XWPFTable table = document.createTable(1, 2);
            table.getRow(0).getCell(0).setText("Java");
            table.getRow(0).getCell(1).setText("Spring Boot");

            document.write(output);
            docxBytes = output.toByteArray();
        }

        String extracted = documentParserService.extractText(docxBytes, ".DOCX");

        assertAll(
                () -> assertTrue(extracted.contains("Alex Morgan")),
                () -> assertTrue(extracted.contains("alex.morgan@example.com")),
                () -> assertTrue(extracted.contains("Java")),
                () -> assertTrue(extracted.contains("Spring Boot"))
        );
    }

    @Test
    void rejectsDocxWithoutReadableText() throws IOException {
        byte[] docxBytes;
        try (XWPFDocument document = new XWPFDocument();
             ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            document.write(output);
            docxBytes = output.toByteArray();
        }

        IOException error = assertThrows(IOException.class,
                () -> documentParserService.extractText(docxBytes, "docx"));
        assertTrue(error.getMessage().contains("No readable text"));
    }

    @Test
    void rejectsPdfWithoutReadableText() throws IOException {
        byte[] pdfBytes;
        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            document.addPage(new PDPage());
            document.save(output);
            pdfBytes = output.toByteArray();
        }

        IOException error = assertThrows(IOException.class,
                () -> documentParserService.extractText(pdfBytes, "pdf"));
        assertTrue(error.getMessage().contains("No readable text"));
    }
}
