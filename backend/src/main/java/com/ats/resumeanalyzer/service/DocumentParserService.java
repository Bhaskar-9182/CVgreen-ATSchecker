package com.ats.resumeanalyzer.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.io.RandomAccessReadBuffer;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

@Service
public class DocumentParserService {

    private static final Logger logger = LoggerFactory.getLogger(DocumentParserService.class);

    /**
     * Deterministic text extraction from PDF or DOCX file bytes.
     * Uses Apache PDFBox for PDF and Apache POI for DOCX.
     * No LLMs or AI APIs are used.
     */
    public String extractText(byte[] fileBytes, String fileFormat) throws IOException {
        if (fileBytes == null || fileBytes.length == 0) {
            throw new IllegalArgumentException("File content is empty");
        }

        String normalizedFormat = fileFormat.toLowerCase().replace(".", "").trim();

        if ("pdf".equals(normalizedFormat)) {
            return extractTextFromPdf(fileBytes);
        } else if ("docx".equals(normalizedFormat) || "doc".equals(normalizedFormat)) {
            return extractTextFromDocx(fileBytes);
        } else {
            // If plain text
            return new String(fileBytes);
        }
    }

    private String extractTextFromPdf(byte[] pdfBytes) throws IOException {
        try (PDDocument document = Loader.loadPDF(new RandomAccessReadBuffer(pdfBytes))) {
            if (document.isEncrypted()) {
                throw new IOException("Cannot parse encrypted PDF document.");
            }
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            String text = stripper.getText(document);
            logger.info("Successfully extracted {} characters from PDF", text != null ? text.length() : 0);
            return cleanExtractedText(text);
        }
    }

    private String extractTextFromDocx(byte[] docxBytes) throws IOException {
        try (InputStream is = new ByteArrayInputStream(docxBytes);
             XWPFDocument docx = new XWPFDocument(is);
             XWPFWordExtractor extractor = new XWPFWordExtractor(docx)) {
            String text = extractor.getText();
            logger.info("Successfully extracted {} characters from DOCX", text != null ? text.length() : 0);
            return cleanExtractedText(text);
        }
    }

    private String cleanExtractedText(String text) {
        if (text == null) {
            return "";
        }
        // Normalize CRLF to LF, remove unusual control characters while preserving formatting & structure
        return text.replace("\r\n", "\n")
                .replace("\r", "\n")
                .replaceAll("[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F]", "")
                .trim();
    }
}
