# Cloud-Based Resume Analyzer with ATS Scoring System

A full-stack, enterprise-grade resume analysis and Applicant Tracking System (ATS) scoring application designed for high accuracy and cloud scalability.

---

## 🚫 Strict Architectural Rule: ZERO RUNTIME LLMs
This application **does not use any external LLM APIs** (OpenAI, Gemini, Anthropic, LangChain, Ollama, HuggingFace, etc.) or machine learning black boxes.

All operations are executed through **deterministic standard Java algorithms**:
1. **Resume Text Extraction**:
   - **PDF Parsing**: Apache PDFBox 3.0 (`org.apache.pdfbox.Loader`, `PDFTextStripper`)
   - **Word DOCX Parsing**: Apache POI 5.3 (`XWPFDocument`, `XWPFWordExtractor`)
2. **Contact & Section Extraction**:
   - High-precision Java Regular Expressions (`java.util.regex.Pattern`) for RFC-compliant emails, international phone numbers, LinkedIn URLs, GitHub handles, and section boundary headers.
3. **Deterministic ATS Scoring Engine**:
   - Tokenization & English stop-word filtering
   - Skill taxonomy dictionary matching
   - **Mathematical Set Operations**:
     - **Matched Skills**: Set intersection ($S_{resume} \cap S_{job}$)
     - **Missing Skills**: Set difference ($S_{job} \setminus S_{resume}$)
   - **Composite Weighted Score (0 - 100)**:
     - **Skill Match (50% weight)**: Ratio of target job skills present
     - **Section Completeness (20% weight)**: Detection of core sections (Contact, Experience, Education, Skills, Summary, Projects, Certifications)
     - **Keyword Frequency & Density (15% weight)**: Optimal density evaluation avoiding keyword stuffing
     - **Formatting & Length (15% weight)**: Word count sanity checking (400 - 1000 words optimal) and contact completeness

---

## Tech Stack Overview

- **Backend**:
  - Java 21 / 24 LTS
  - Spring Boot 3.3.4 (REST API, Spring Security, Spring Data JPA)
  - Spring Security with Stateless JWT Authentication (`io.jsonwebtoken:jjwt:0.11.5`)
  - Apache PDFBox 3.0.3 & Apache POI 5.3.0
  - AWS SDK for Java v2 (`software.amazon.awssdk:s3:2.25.60`) with local filesystem fallback
  - Database: MySQL (with embedded H2 fallback for zero-configuration local development)
- **Frontend**:
  - React 18 SPA (Vite + React)
  - Responsive Dashboard with score gauges, skill badges, and presets
  - Lucide React icon suite
  - Axios with JWT request interceptors

---

## Project Structure

```
d:\cloud project\
├── backend/
│   ├── .mvn/wrapper/              # Portable Maven Wrapper
│   ├── mvnw / mvnw.cmd            # Maven execution scripts
│   ├── pom.xml                    # Spring Boot 3 & library dependencies
│   └── src/
│       ├── main/java/com/ats/resumeanalyzer/
│       │   ├── config/            # SecurityConfig, S3Config, CorsConfig
│       │   ├── controller/        # AuthController, ResumeController, HealthController
│       │   ├── dto/               # Auth DTOs, AnalysisResultDto, ContactInfoDto
│       │   ├── model/             # User, Role, Resume, AnalysisReport JPA Entities
│       │   ├── repository/        # UserRepository, ResumeRepository, AnalysisReportRepository
│       │   ├── security/          # JwtTokenProvider, JwtAuthenticationFilter, UserDetailsService
│       │   └── service/           # AtsScoringEngineService, DocumentParserService, RegexExtractionService, FileStorageService, ResumeService, UserService
│       ├── main/resources/
│       │   └── application.properties # Server port, database & S3 settings
│       └── test/java/com/ats/resumeanalyzer/
│           ├── AtsScoringEngineServiceTest.java
│           ├── RegexExtractionServiceTest.java
│           └── SampleResumeGenerator.java
├── frontend/
│   ├── package.json               # React 18, Vite, Axios, Lucide
│   ├── vite.config.js             # Dev server & reverse proxy to port 8080
│   ├── index.html
│   └── src/
│       ├── components/            # Navbar, AuthModal, ResumeUploader, JobDescriptionForm, AtsScoreDashboard, ResumeHistory
│       ├── services/              # Axios API client with JWT authorization
│       ├── App.jsx                # Core application dashboard
│       └── index.css              # Glassmorphic dark theme styles
└── samples/                       # Sample test resumes (.pdf & .docx)
```

---

## Quick Start Guide

### 1. Start the Backend API (Spring Boot)
Open a terminal in `d:\cloud project\backend`:
```powershell
.\mvnw.cmd spring-boot:run
```
The REST API will start at **http://localhost:8080**.
- Health Check: `http://localhost:8080/api/health`
- H2 Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:resumedb`, user: `sa`, password: empty)

To point to your MySQL instance in production, set:
```powershell
$env:SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/resume_analyzer_db?createDatabaseIfNotExist=true"
$env:SPRING_DATASOURCE_USERNAME="root"
$env:SPRING_DATASOURCE_PASSWORD="your_password"
```

### 2. Start the Frontend (React SPA)
Open a second terminal in `d:\cloud project\frontend`:
```powershell
npm run dev
```
Open **http://localhost:5173** in your browser.

---

## REST API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | System status, non-LLM engine confirmation, storage target |
| `POST` | `/api/auth/register` | Public | Register new user account (`username`, `email`, `password`) |
| `POST` | `/api/auth/login` | Public | Authenticate and obtain JWT Bearer token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current user profile |
| `POST` | `/api/resumes/upload` | Authenticated | Upload PDF/DOCX resume and extract text |
| `POST` | `/api/resumes/{id}/analyze` | Authenticated | Run deterministic ATS score matching against job description |
| `GET` | `/api/resumes` | Authenticated | List all uploaded resumes for user |
| `GET` | `/api/resumes/{id}/latest-report` | Authenticated | Get latest ATS report for resume |
| `GET` | `/api/resumes/{id}/download` | Authenticated | Download original resume file |

