import React, { useState } from 'react';
import { Briefcase, Sparkles, Play, Loader2, Bookmark } from 'lucide-react';
import { resumeApi } from '../services/api';

const PRESETS = [
  {
    title: 'Senior Java Backend Engineer',
    description: `We are seeking a Senior Java Backend Engineer to design and implement highly scalable microservices.
Required Skills & Experience:
- Strong proficiency in Java 17/21 and Spring Boot ecosystem (Spring Data JPA, Spring Security).
- Hands-on experience with MySQL or PostgreSQL database optimization and schema design.
- Practical experience with AWS cloud services (S3, EC2, ECS, RDS).
- Familiarity with containerization using Docker and Kubernetes.
- Clean Code principles, Unit Testing with JUnit/Mockito, and Git version control.
- Experience with REST API design, Swagger/OpenAPI documentation, and CI/CD pipelines.`
  },
  {
    title: 'Full Stack Web Developer (React + Node)',
    description: `Looking for a Full Stack Developer to build modern interactive single-page web applications.
Qualifications:
- Solid experience with JavaScript (ES6+), TypeScript, React, HTML5, and CSS3/Tailwind CSS.
- Backend proficiency in Node.js, Express, and REST APIs.
- Experience with databases like MongoDB or MySQL.
- Proficiency with Git, GitHub, Agile/Scrum workflows, and automated testing.`
  },
  {
    title: 'Cloud DevOps & Platform Engineer',
    description: `Seeking a Cloud DevOps Engineer to maintain and automate cloud infrastructure.
Requirements:
- Strong expertise in AWS or GCP cloud environments.
- Deep knowledge of Docker, Kubernetes, Helm, and container orchestration.
- Infrastructure as Code (IaC) using Terraform or Ansible.
- Experience building CI/CD pipelines in Jenkins or GitHub Actions.
- Linux administration, Bash scripting, and Python automation.`
  }
];

export default function JobDescriptionForm({ resumeId, onAnalysisComplete }) {
  const [jobTitle, setJobTitle] = useState('Senior Java Backend Engineer');
  const [jobDescription, setJobDescription] = useState(PRESETS[0].description);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const applyPreset = (preset) => {
    setJobTitle(preset.title);
    setJobDescription(preset.description);
  };

  const handleAnalyze = async () => {
    if (!resumeId) {
      setError('Please upload a resume in Step 1 first.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please provide a job description for ATS comparison.');
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const result = await resumeApi.analyzeResume(resumeId, jobTitle, jobDescription);
      onAnalysisComplete(result);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Please verify the backend is running.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'rgba(124, 58, 237, 0.15)',
            padding: '8px',
            borderRadius: '8px',
            color: '#a78bfa'
          }}>
            <Briefcase size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Step 2: Target Job Description</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Deterministic token matching and set intersection against job requirements
            </p>
          </div>
        </div>

        {/* Quick Sample Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Bookmark size={13} /> Quick Presets:
          </span>
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(p)}
              style={{
                fontSize: '0.75rem',
                padding: '4px 10px',
                borderRadius: '6px',
                background: jobTitle === p.title ? 'rgba(99, 102, 241, 0.25)' : 'rgba(51, 65, 85, 0.4)',
                color: jobTitle === p.title ? '#a5b4fc' : 'var(--text-muted)',
                border: `1px solid ${jobTitle === p.title ? '#6366f1' : 'var(--border)'}`,
              }}
            >
              {p.title.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          padding: '10px 14px',
          marginBottom: '16px',
          color: '#f87171',
          fontSize: '0.85rem'
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
            Target Job Title / Role
          </label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Lead Software Engineer"
            style={{
              width: '100%',
              padding: '10px 14px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text-main)',
              fontSize: '0.9rem'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
            Job Description & Requirements
          </label>
          <textarea
            rows={7}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste target job requirements, qualifications, and core technical competencies..."
            style={{
              width: '100%',
              padding: '12px 14px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              lineHeight: '1.6',
              resize: 'vertical'
            }}
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={analyzing || !resumeId}
          className="btn-primary"
          style={{
            alignSelf: 'flex-end',
            padding: '11px 24px',
            fontSize: '0.925rem',
            background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
          }}
        >
          {analyzing ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Calculating ATS Metrics...
            </>
          ) : (
            <>
              <Play size={18} fill="currentColor" /> Run Deterministic ATS Analysis
            </>
          )}
        </button>
      </div>
    </div>
  );
}

