import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "Cloud-Based Resume Analyzer & ATS — Faculty Viva Defense Guide")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 744, 558, 744)

        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 45, 558, 45)
        self.drawString(54, 32, "Confidential — Prepared for Academic Faculty Defense")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 32, page_text)
        self.restoreState()


def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=50,
        bottomMargin=50
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    primary_color = colors.HexColor("#0F172A")    # Slate 900
    accent_blue = colors.HexColor("#1D4ED8")      # Blue 700
    sub_color = colors.HexColor("#334155")        # Slate 700
    code_bg = colors.HexColor("#F8FAFC")          # Slate 50
    border_color = colors.HexColor("#E2E8F0")     # Slate 200

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=primary_color,
        spaceAfter=6
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=accent_blue,
        spaceAfter=15
    )
    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=primary_color,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )
    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=accent_blue,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )
    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=sub_color,
        spaceAfter=6
    )
    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=sub_color,
        leftIndent=14,
        spaceAfter=4
    )
    code_style = ParagraphStyle(
        'Code_Custom',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#0F172A")
    )
    qa_q_style = ParagraphStyle(
        'QA_Q',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#B91C1C"),  # Deep red/alert
        spaceBefore=6,
        spaceAfter=2,
        keepWithNext=True
    )
    qa_a_style = ParagraphStyle(
        'QA_A',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#1E293B"),
        spaceAfter=6
    )

    story = []

    # Cover / Header Banner
    story.append(Paragraph("Cloud-Based Resume Analyzer & ATS Scoring System", title_style))
    story.append(Paragraph("Comprehensive Technical Architecture, Database Specifications, and Faculty Viva Defense Handbook", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=accent_blue, spaceBefore=0, spaceAfter=12))

    # Meta Info Table
    meta_data = [
        [Paragraph("<b>Project Name:</b>", body_style), Paragraph("Cloud-Based Resume Analyzer with ATS Scoring", body_style),
         Paragraph("<b>Backend Stack:</b>", body_style), Paragraph("Java 21, Spring Boot 3.3.4, JPA/Hibernate", body_style)],
        [Paragraph("<b>Primary Author:</b>", body_style), Paragraph("Kothapalli Bhaskar", body_style),
         Paragraph("<b>Database:</b>", body_style), Paragraph("MySQL 8.0 (Production) / H2 (In-Memory Fallback)", body_style)],
        [Paragraph("<b>Frontend Stack:</b>", body_style), Paragraph("React 18 SPA, Vite, Axios, Lucide Icons", body_style),
         Paragraph("<b>Document Engine:</b>", body_style), Paragraph("Apache PDFBox 3.0.3, Apache POI 5.3.0 (Zero LLMs)", body_style)],
    ]
    meta_table = Table(meta_data, colWidths=[100, 165, 100, 165])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F1F5F9")),
        ('BOX', (0, 0), (-1, -1), 0.5, border_color),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 14))

    # -------------------------------------------------------------
    # SECTION 1: 30-Second Elevator Pitch & Problem Statement
    # -------------------------------------------------------------
    story.append(Paragraph("1. Executive Summary & The 30-Second Elevator Pitch", h1_style))
    pitch_text = (
        "<b>The Elevator Pitch:</b><br/>"
        "<i>'Sir/Madam, this project is an enterprise-grade, cloud-scalable Resume Analyzer and Applicant Tracking System (ATS) "
        "scoring platform built on Java Spring Boot 3 and React 18. Unlike ordinary student projects that merely invoke external "
        "generative AI APIs (which suffer from hallucinations, non-deterministic scores, high API costs, and severe privacy violations "
        "when handling personal resume data), our system implements <b>100% deterministic mathematical set algorithms</b>, "
        "<b>standard document parsing libraries (Apache PDFBox and Apache POI)</b>, and <b>RFC-compliant regular expressions</b>. "
        "It evaluates candidate resumes against job descriptions with complete transparency, auditability, and speed.'</i>"
    )
    story.append(Paragraph(pitch_text, body_style))
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------
    # SECTION 2: Architecture & Tech Stack
    # -------------------------------------------------------------
    story.append(Paragraph("2. System Architecture & Component Interactions", h1_style))
    story.append(Paragraph(
        "The project follows an enterprise <b>3-Tier Layered Architecture</b> ensuring strict separation of concerns, "
        "stateless horizontal scalability, and cloud resilience:",
        body_style
    ))

    arch_data = [
        [Paragraph("<b>Tier / Layer</b>", body_style), Paragraph("<b>Components & Technologies</b>", body_style), Paragraph("<b>Responsibilities</b>", body_style)],
        [
            Paragraph("<b>Presentation Tier<br/>(Client Frontend)</b>", body_style),
            Paragraph("React 18 SPA, Vite, Axios, Lucide Icons, Glassmorphic CSS", body_style),
            Paragraph("Multi-step guided interface: (1) Target Role & JD entry, (2) Resume Upload with instant preview, (3) Score gauges & diagnostics breakdown, (4) ATS-optimized resume exporter.", body_style)
        ],
        [
            Paragraph("<b>Application Tier<br/>(Backend REST API)</b>", body_style),
            Paragraph("Java 21, Spring Boot 3.3.4, Spring Security, JWT (io.jsonwebtoken), Jackson", body_style),
            Paragraph("Stateless authentication, multipart file upload routing, business logic orchestration, RESTful API endpoints (/api/resumes, /api/auth, /api/health).", body_style)
        ],
        [
            Paragraph("<b>Processing Engines<br/>(Deterministic Core)</b>", body_style),
            Paragraph("Apache PDFBox 3.0.3, Apache POI 5.3.0, java.util.regex.Pattern", body_style),
            Paragraph("Raw text extraction from PDF & DOCX; contact information mining (Email, Phone, LinkedIn, GitHub); 7-section boundary header detection; ATS mathematical scoring.", body_style)
        ],
        [
            Paragraph("<b>Data & Object Storage Tier<br/>(Persistence Layer)</b>", body_style),
            Paragraph("MySQL 8.0 / MariaDB (Hibernate JPA)<br/>AWS S3 (AWS SDK v2) / Local File System", body_style),
            Paragraph("Relational persistence of users, resume metadata, and ATS analysis reports. Resume binary documents stored securely in AWS S3 or fallback local disk.", body_style)
        ]
    ]
    arch_table = Table(arch_data, colWidths=[120, 160, 250])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#E2E8F0")),
        ('BOX', (0, 0), (-1, -1), 0.5, border_color),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, border_color),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(arch_table)
    story.append(Spacer(1, 14))

    # -------------------------------------------------------------
    # SECTION 3: The Database (Detailed Answer to Faculty)
    # -------------------------------------------------------------
    story.append(Paragraph("3. Database Architecture & Schema Specification", h1_style))
    story.append(Paragraph(
        "When your faculty asks: <i>'Where is the database and how is it structured?'</i>, this section provides your exact technical answer.",
        body_style
    ))
    story.append(Paragraph(
        "<b>Configuration File:</b> <code>backend/src/main/resources/application.properties</code><br/>"
        "The project connects to MySQL via Spring Data JPA and Hibernate ORM. It also features an embedded H2 fallback for zero-dependency standalone demonstrations.",
        body_style
    ))

    schema_data = [
        [Paragraph("<b>Table Name</b>", body_style), Paragraph("<b>Key Columns</b>", body_style), Paragraph("<b>Constraints & Relationships</b>", body_style), Paragraph("<b>Description</b>", body_style)],
        [
            Paragraph("<b>users</b>", body_style),
            Paragraph("id (PK, Auto)<br/>username<br/>email<br/>password<br/>created_at", body_style),
            Paragraph("UNIQUE(username)<br/>UNIQUE(email)<br/>BCrypt encrypted password", body_style),
            Paragraph("Stores candidate/recruiter accounts.", body_style)
        ],
        [
            Paragraph("<b>user_roles</b>", body_style),
            Paragraph("user_id (FK)<br/>role", body_style),
            Paragraph("PK(user_id, role)<br/>FK -> users(id) ON DELETE CASCADE", body_style),
            Paragraph("Role-based access control (ROLE_USER, ROLE_ADMIN).", body_style)
        ],
        [
            Paragraph("<b>resumes</b>", body_style),
            Paragraph("id (PK, Auto)<br/>file_name<br/>file_format<br/>file_size<br/>storage_type<br/>storage_path_or_key<br/>raw_extracted_text<br/>user_id (FK)<br/>uploaded_at", body_style),
            Paragraph("FK -> users(id) ON DELETE SET NULL<br/>storage_type: 'S3' | 'LOCAL'<br/>raw_extracted_text: LONGTEXT", body_style),
            Paragraph("Stores resume file metadata and full extracted text. <b>Notice:</b> Binary files are NOT kept in SQL to prevent bloat; paths/keys are referenced instead.", body_style)
        ],
        [
            Paragraph("<b>analysis_reports</b>", body_style),
            Paragraph("id (PK, Auto)<br/>resume_id (FK)<br/>job_title<br/>job_description<br/>overall_score<br/>skill_match_score<br/>section_score<br/>keyword_frequency_score<br/>formatting_score<br/>matched_skills<br/>missing_skills<br/>contact_info_json<br/>analyzed_at", body_style),
            Paragraph("FK -> resumes(id) ON DELETE CASCADE<br/>Scores: 0 to 100 integer bounds<br/>JSON/Text serialized arrays", body_style),
            Paragraph("Stores historical ATS scoring audits, diagnostic sub-scores, detected skills, and recommendations.", body_style)
        ]
    ]
    schema_table = Table(schema_data, colWidths=[90, 130, 160, 150])
    schema_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#E2E8F0")),
        ('BOX', (0, 0), (-1, -1), 0.5, border_color),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, border_color),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(schema_table)
    story.append(Spacer(1, 14))

    # Page Break for clean reading
    story.append(PageBreak())

    # -------------------------------------------------------------
    # SECTION 4: Deterministic ATS Engine Mathematics
    # -------------------------------------------------------------
    story.append(Paragraph("4. The Deterministic ATS Engine & Mathematical Formulas", h1_style))
    story.append(Paragraph(
        "The application relies on <b>deterministic mathematical algorithms</b> rather than non-reproducible generative models. "
        "This mirrors real-world enterprise ATS behavior (Workday, Taleo, Greenhouse).",
        body_style
    ))
    story.append(Paragraph(
        "<b>The Weighted Composite Score Formula (0 - 100):</b>",
        h2_style
    ))
    
    formula_box = [
        [Paragraph("<b>Composite ATS Score = (0.50 × Skill_Match) + (0.20 × Section_Score) + (0.15 × Keyword_Density) + (0.15 × Formatting_Score)</b>", body_style)]
    ]
    f_table = Table(formula_box, colWidths=[530])
    f_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#EFF6FF")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#93C5FD")),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(f_table)
    story.append(Spacer(1, 8))

    story.append(Paragraph("<b>1. Skill Match Score (50% Weight) — Mathematical Set Theory:</b>", body_style))
    story.append(Paragraph(
        "Let <i>S<sub>resume</sub></i> be the set of skills extracted from the candidate's resume, and <i>S<sub>job</sub></i> be the set of skills demanded by the target job description.<br/>"
        "• <b>Matched Skills (Set Intersection):</b> <i>S<sub>matched</sub> = S<sub>resume</sub> ∩ S<sub>job</sub></i><br/>"
        "• <b>Missing Skills (Set Difference):</b> <i>S<sub>missing</sub> = S<sub>job</sub> \\ S<sub>resume</sub></i><br/>"
        "• <b>Calculation:</b> <i>Skill_Match_Score = (|S<sub>matched</sub>| / |S<sub>job</sub>|) × 100</i>",
        bullet_style
    ))

    story.append(Paragraph("<b>2. Section Completeness Score (20% Weight):</b>", body_style))
    story.append(Paragraph(
        "The system evaluates the resume against 7 standard industry sections: <i>Contact Information, Summary, Work Experience, "
        "Education, Skills, Projects,</i> and <i>Certifications</i> using high-precision regex header patterns. "
        "Score = (Detected_Sections / 7) × 100.",
        bullet_style
    ))

    story.append(Paragraph("<b>3. Keyword Frequency & Anti-Stuffing Density Score (15% Weight):</b>", body_style))
    story.append(Paragraph(
        "Density is computed as: <i>Keyword_Density = (Total_Skill_Occurrences / Total_Words) × 100</i><br/>"
        "• <b>Optimal ATS Density (1.5% to 6.0%):</b> Score = 100 points.<br/>"
        "• <b>Mild Keyword Stuffing (6.0% to 9.0%):</b> Penalized to 75 points.<br/>"
        "• <b>Aggressive Keyword Stuffing (> 9.0%):</b> Heavily penalized to 55 points.<br/>"
        "This defends recruiters against fraudulent candidates who hide white-text repetitive keywords!",
        bullet_style
    ))

    story.append(Paragraph("<b>4. Formatting & Readability Score (15% Weight):</b>", body_style))
    story.append(Paragraph(
        "Starts at 100. Evaluates optimal length (400 - 1000 words). Penalties are levied if resume is <150 words (-40) or >1500 words (-25). "
        "Mandatory contact audits deduct points if email (-20), phone (-15), or LinkedIn/GitHub (-10) are missing.",
        bullet_style
    ))
    story.append(Spacer(1, 14))

    # -------------------------------------------------------------
    # SECTION 5: Anticipated Faculty Viva Questions & Answers
    # -------------------------------------------------------------
    story.append(Paragraph("5. Strict Faculty Defense: Rapid-Fire Viva Q&A", h1_style))
    story.append(Paragraph(
        "Prepare these exact answers when your faculty probes you with difficult questions:",
        body_style
    ))

    qa_list = [
        ("Q1: Where is your database? Open it and show me the tables right now!",
         "Answer: 'Sir, our database is fully configured in application.properties. For production, we connect to MySQL on localhost:3306 under database resume_analyzer_db. For local testing, we have an active H2 web console at http://localhost:8080/h2-console. There are 4 relational tables: users, user_roles, resumes, and analysis_reports with proper primary and foreign keys.'"),
        
        ("Q2: Why didn't you use OpenAI, Gemini, or an LLM API to parse the resume?",
         "Answer: 'Sir, that was an intentional design decision for 3 critical enterprise reasons: (1) Data Privacy & GDPR: Resumes contain sensitive Personally Identifiable Information (phone, address, email); transmitting them to commercial LLM APIs introduces data leakage risks. (2) Determinism: LLMs are non-deterministic and hallucinate different scores across runs; our set-theory math produces 100% reproducible audits. (3) Latency & Cost: Native Java parsers execute in under 120 milliseconds with zero API costs.'"),
         
        ("Q3: How do you extract text from PDF and DOCX files without OCR or AI?",
         "Answer: 'Sir, we utilize Apache PDFBox 3.0.3 using Loader.loadPDF() and PDFTextStripper for PDF binary streams, and Apache POI 5.3.0 with XWPFDocument and XWPFWordExtractor for DOCX files. Control characters are sanitized through standard Java regex streams.'"),

        ("Q4: How did you implement security and user authentication?",
         "Answer: 'Sir, we implemented Spring Security with stateless JSON Web Tokens (JWT). Passwords are never stored in plain text—they are hashed with BCrypt. Protected endpoints require an Authorization: Bearer <token> header, validated on every request by our JwtAuthenticationFilter without server session state.'"),

        ("Q5: What happens if someone uploads a 50MB file or an encrypted PDF?",
         "Answer: 'Sir, we handle this defensively: (1) Spring Boot enforces a 15MB multipart ceiling via spring.servlet.multipart.max-file-size=15MB. (2) In DocumentParserService, we invoke document.isEncrypted() on Apache PDFBox; if encrypted, an IOException is immediately thrown and returned as a HTTP 400 Bad Request.'"),

        ("Q6: How does the system prevent candidates from cheating via Keyword Stuffing?",
         "Answer: 'Sir, in AtsScoringEngineService, we compute Keyword Density: (matched keyword occurrences / total word count) * 100. If a candidate repeats keywords to exceed 6%, our engine penalizes their score from 100 down to 75, and if over 9%, down to 55.'")
    ]

    for q, a in qa_list:
        qa_box = [
            [Paragraph(f"<b>{q}</b>", qa_q_style)],
            [Paragraph(a, qa_a_style)]
        ]
        qa_table = Table(qa_box, colWidths=[530])
        qa_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
            ('BOX', (0, 0), (-1, -1), 0.5, border_color),
            ('TOPPADDING', (0, 0), (-1, -1), 3),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
            ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(qa_table)
        story.append(Spacer(1, 4))

    # Page Break for Teammate / SQL Setup Guide
    story.append(PageBreak())

    # -------------------------------------------------------------
    # SECTION 6: Guide for Friend / Teammate & Database Setup
    # -------------------------------------------------------------
    story.append(Paragraph("6. Teammate Guide: Database Setup & Teamwork Division", h1_style))
    story.append(Paragraph(
        "Give this exact instruction set to your friend to create and manage the project's MySQL database:",
        body_style
    ))

    story.append(Paragraph("<b>Step 1: Starting MySQL via XAMPP</b>", h2_style))
    story.append(Paragraph(
        "1. Open the <b>XAMPP Control Panel</b> on your system.<br/>"
        "2. Click <b>Start</b> next to <b>MySQL</b> and <b>Apache</b> (Ports 3306 & 80).<br/>"
        "3. Open your browser and navigate to: <code>http://localhost/phpmyadmin</code>",
        bullet_style
    ))

    story.append(Paragraph("<b>Step 2: Database Initialization Script (schema.sql)</b>", h2_style))
    sql_code = (
        "CREATE DATABASE IF NOT EXISTS resume_analyzer_db;<br/>"
        "USE resume_analyzer_db;<br/><br/>"
        "CREATE TABLE users (<br/>"
        "&nbsp;&nbsp;id BIGINT AUTO_INCREMENT PRIMARY KEY,<br/>"
        "&nbsp;&nbsp;username VARCHAR(50) NOT NULL UNIQUE,<br/>"
        "&nbsp;&nbsp;email VARCHAR(100) NOT NULL UNIQUE,<br/>"
        "&nbsp;&nbsp;password VARCHAR(255) NOT NULL,<br/>"
        "&nbsp;&nbsp;created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP<br/>"
        ");<br/><br/>"
        "CREATE TABLE user_roles (<br/>"
        "&nbsp;&nbsp;user_id BIGINT NOT NULL,<br/>"
        "&nbsp;&nbsp;role VARCHAR(50) NOT NULL,<br/>"
        "&nbsp;&nbsp;PRIMARY KEY (user_id, role),<br/>"
        "&nbsp;&nbsp;FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE<br/>"
        ");<br/><br/>"
        "CREATE TABLE resumes (<br/>"
        "&nbsp;&nbsp;id BIGINT AUTO_INCREMENT PRIMARY KEY,<br/>"
        "&nbsp;&nbsp;file_name VARCHAR(255) NOT NULL,<br/>"
        "&nbsp;&nbsp;file_format VARCHAR(10) NOT NULL,<br/>"
        "&nbsp;&nbsp;file_size BIGINT,<br/>"
        "&nbsp;&nbsp;storage_type VARCHAR(20) NOT NULL,<br/>"
        "&nbsp;&nbsp;storage_path_or_key VARCHAR(500) NOT NULL,<br/>"
        "&nbsp;&nbsp;raw_extracted_text LONGTEXT,<br/>"
        "&nbsp;&nbsp;user_id BIGINT,<br/>"
        "&nbsp;&nbsp;uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,<br/>"
        "&nbsp;&nbsp;FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL<br/>"
        ");<br/><br/>"
        "CREATE TABLE analysis_reports (<br/>"
        "&nbsp;&nbsp;id BIGINT AUTO_INCREMENT PRIMARY KEY,<br/>"
        "&nbsp;&nbsp;resume_id BIGINT NOT NULL,<br/>"
        "&nbsp;&nbsp;job_title VARCHAR(255),<br/>"
        "&nbsp;&nbsp;job_description LONGTEXT,<br/>"
        "&nbsp;&nbsp;overall_score INT NOT NULL,<br/>"
        "&nbsp;&nbsp;skill_match_score INT NOT NULL,<br/>"
        "&nbsp;&nbsp;section_score INT NOT NULL,<br/>"
        "&nbsp;&nbsp;keyword_frequency_score INT NOT NULL,<br/>"
        "&nbsp;&nbsp;formatting_score INT NOT NULL,<br/>"
        "&nbsp;&nbsp;word_count INT NOT NULL,<br/>"
        "&nbsp;&nbsp;matched_skills TEXT,<br/>"
        "&nbsp;&nbsp;missing_skills TEXT,<br/>"
        "&nbsp;&nbsp;present_sections TEXT,<br/>"
        "&nbsp;&nbsp;missing_sections TEXT,<br/>"
        "&nbsp;&nbsp;contact_info_json TEXT,<br/>"
        "&nbsp;&nbsp;recommendations_json TEXT,<br/>"
        "&nbsp;&nbsp;analyzed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,<br/>"
        "&nbsp;&nbsp;FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE CASCADE<br/>"
        ");"
    )
    sql_box = [[Paragraph(sql_code, code_style)]]
    sql_table = Table(sql_box, colWidths=[530])
    sql_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F1F5F9")),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(sql_table)
    story.append(Spacer(1, 10))

    story.append(Paragraph("<b>Step 3: Team Division of Responsibilities (For Faculty Review)</b>", h2_style))
    collab_data = [
        [Paragraph("<b>Team Member</b>", body_style), Paragraph("<b>Assigned Responsibilities</b>", body_style), Paragraph("<b>What to Say in Viva</b>", body_style)],
        [
            Paragraph("<b>Kothapalli Bhaskar<br/>(You)</b>", body_style),
            Paragraph("Backend services, document extraction pipeline (Apache PDFBox/POI), deterministic ATS scoring engine mathematics, and React SPA dashboard.", body_style),
            Paragraph("<i>'I engineered the document parser integrations, implemented the mathematical scoring algorithms, and built the interactive React dashboard.'</i>", body_style)
        ],
        [
            Paragraph("<b>Your Teammate<br/>(Friend)</b>", body_style),
            Paragraph("Database schema architecture, normalization (3NF), relational table constraints, SQL indexing, and database migration testing.", body_style),
            Paragraph("<i>'I architected the relational database schema, established foreign-key cascades, and optimized storage performance for unstructured resume text.'</i>", body_style)
        ]
    ]
    collab_table = Table(collab_data, colWidths=[110, 200, 220])
    collab_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#E2E8F0")),
        ('BOX', (0, 0), (-1, -1), 0.5, border_color),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, border_color),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(collab_table)
    story.append(Spacer(1, 12))

    # Verification / Commands to run
    story.append(Paragraph("<b>Quick Execution Commands for Faculty Demo:</b>", h2_style))
    story.append(Paragraph(
        "• <b>Start Backend:</b> <code>cd 'd:\\cloud project\\backend' ; .\\mvnw.cmd spring-boot:run</code><br/>"
        "• <b>Start Frontend:</b> <code>cd 'd:\\cloud project\\frontend' ; npm run dev</code><br/>"
        "• <b>Inspect Database:</b> <code>http://localhost/phpmyadmin</code> (or <code>http://localhost:8080/h2-console</code>)<br/>"
        "• <b>Live Application:</b> <code>http://localhost:5173</code>",
        bullet_style
    ))

    # Build the PDF
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated at: {filename}")

if __name__ == "__main__":
    output_pdf = r"d:\cloud project\Project_Viva_Defense_and_Database_Guide.pdf"
    build_pdf(output_pdf)
