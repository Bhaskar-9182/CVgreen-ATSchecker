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

To enable the H2 console locally, set `H2_CONSOLE_ENABLED=true` before starting the backend. It is disabled by default.

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

---

## Temporary zero-cost demo deployment on Render

This setup is intended for a short demo, not production. Render's free web services can sleep when idle, and its free PostgreSQL database expires 30 days after creation. Confirm Render's current limits before proceeding; do not rely on the free database for data you cannot lose. See [Render's free instance documentation](https://render.com/docs/free).

### Deploy the backend

1. Push this repository to GitHub and create a Render account.
2. In Render, create a **PostgreSQL** database using the Free plan. Create it only when ready to start the 30-day period.
   Choose the same Render region for the database and backend service.
3. Copy the database's internal host, port, database name, username, and password from its connection details.
4. Create a **Web Service** from this repository using the Docker runtime. Set the Dockerfile path to `backend/Dockerfile` and the Docker build context to `backend`.
5. Add these backend environment variables in Render. Use the internal database host and credentials; never commit secret values:

   ```text
   SPRING_DATASOURCE_URL=jdbc:postgresql://<internal-host>:<port>/<database-name>
   SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver
   SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.PostgreSQLDialect
   APP_JWT_SECRET=<a newly generated random secret of at least 32 characters>
   APP_JWT_EXPIRATION_MS=86400000
   ```

6. Deploy and verify `https://<backend-service>.onrender.com/api/health` returns `"status":"UP"`.

### Deploy the frontend

1. Create a **Static Site** in Render from the same GitHub repository, with the root directory `frontend`.
2. Set the build command to `npm ci && npm run build` and the publish directory to `dist`.
3. Add the environment variable `VITE_API_BASE_URL=https://<backend-service>.onrender.com` (omit the `/api` suffix), then deploy.
4. After Render assigns the frontend URL, set the backend's `CORS_ALLOWED_ORIGINS` to that exact URL, redeploy the backend, and test registration, login, resume upload, analysis, and History.

All resume APIs require authentication and only allow the owning account to read or analyze a resume. Sign in before uploading.

### Resume file storage on Render

Render does not receive the EC2 IAM role created in AWS. Without AWS credentials, the application falls back to the Render service's local filesystem, which is ephemeral and may not retain original files across restarts. For reliable resume downloads, configure S3 using a dedicated AWS IAM identity restricted to the bucket's `resumes/*` objects, and store its access key and secret as Render environment secrets (`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`). Also set `AWS_S3_BUCKET_NAME` and `AWS_REGION`. Never put those credentials in Git. S3 usage may incur AWS charges, so check billing and pricing before enabling it.
