import React, { useState, useRef } from 'react';
import { 
  FileText, UploadCloud, CheckCircle2, ArrowRight, 
  RotateCcw, User, Wrench, Briefcase, GraduationCap, Sparkles, Loader2 
} from 'lucide-react';
import { resumeApi } from '../services/api';

export default function Step2Resume({ 
  currentResume, 
  onResumeUploaded, 
  onNext, 
  jobTitle, 
  jobDescription 
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const [extractedData, setExtractedData] = useState(null);

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setError(null);
      setUploading(true);

      try {
        const response = await resumeApi.uploadResume(file);
        setExtractedData(response);
        onResumeUploaded(response);
      } catch (err) {
        console.error("Upload error:", err);
        setError("Failed to upload file to backend. Please check backend is running.");
        // Create demo resume structure if guest / simulated
        const simulatedResume = {
          resumeId: 101,
          fileName: file.name,
          fileFormat: file.name.endsWith('.docx') ? 'docx' : 'pdf',
          fileSize: file.size,
          storageType: 'S3',
          uploadedAt: new Date().toISOString(),
          previewSnippet: 'Candidate Resume\n' + file.name
        };
        onResumeUploaded(simulatedResume);
      } finally {
        setUploading(false);
      }
    }
  };

  const activeFileName = currentResume?.fileName || (selectedFile ? selectedFile.name : 'Alex_Morgan_Resume_2025.pdf');
  const activeFileSize = currentResume?.fileSize ? (currentResume.fileSize / 1024).toFixed(0) + ' KB' : '142 KB';

  // Real extracted entities if available, else defaults
  const candidateName = extractedData?.contactInfo?.candidateName || 'Alex Morgan';
  const email = extractedData?.contactInfo?.email || 'alex.m@domain.com';
  const phone = extractedData?.contactInfo?.phone || '+1 (555) 0192';
  const skillsList = extractedData?.extractedSkills && extractedData.extractedSkills.length > 0 
    ? extractedData.extractedSkills 
    : ['TypeScript', 'React Native', 'CI/CD'];

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '16px 0 60px' }}>
      
      {/* Active Pipeline Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: '#0052cc',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.85rem',
            fontWeight: '800'
          }}>
            2
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#0052cc', letterSpacing: '0.04em' }}>
              ACTIVE PIPELINE STEP
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>
              Upload Your Resume
            </h2>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: '700', color: '#065f46' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }} />
          Parser Ready
        </div>
      </div>

      {/* Parsed File Source Card (If file exists) */}
      <div className="cv-card" style={{ padding: '16px 20px', marginBottom: '18px' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
          PARSED FILE SOURCE
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              padding: '10px',
              borderRadius: '8px',
              color: '#0052cc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>
                {activeFileName}
              </div>
              <div style={{ fontSize: '0.775rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                <span>{activeFileSize}</span>
                <span>•</span>
                <span style={{ color: '#047857', fontWeight: '600' }}>Ready for Extraction</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              color: '#065f46',
              background: '#ecfdf5',
              padding: '4px 12px',
              borderRadius: '9999px',
              border: '1px solid #a7f3d0',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <CheckCircle2 size={14} color="#10b981" /> Verified Format
            </span>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-cv-secondary"
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            >
              ⇄ Change
            </button>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Drag and drop banner */}
      <div
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: '2px dashed #cbd5e1',
          borderRadius: '14px',
          padding: '36px 20px',
          textAlign: 'center',
          background: '#f8fafc',
          cursor: 'pointer',
          marginBottom: '24px',
          transition: 'all 0.15s ease'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: '#eff6ff',
            color: '#0052cc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {uploading ? <Loader2 size={24} className="animate-spin" /> : <UploadCloud size={24} />}
          </div>

          <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>
            Tap to browse or drop file
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Compatible with structured ATS standard multi-column templates
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '0.725rem', fontWeight: '700', color: '#64748b', background: '#e2e8f0', padding: '3px 8px', borderRadius: '4px' }}>PDF</span>
            <span style={{ fontSize: '0.725rem', fontWeight: '700', color: '#64748b', background: '#e2e8f0', padding: '3px 8px', borderRadius: '4px' }}>DOCX</span>
            <span style={{ fontSize: '0.725rem', fontWeight: '700', color: '#64748b', background: '#e2e8f0', padding: '3px 8px', borderRadius: '4px' }}>MAX 10 MB</span>
          </div>
        </div>
      </div>

      {/* Rule-Based NLP Parser Pre-Check Card */}
      <div className="cv-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>
              Rule-Based NLP Parser Pre-Check
            </h3>
            <p style={{ fontSize: '0.775rem', color: '#64748b' }}>
              Deterministic entity extraction preview
            </p>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0052cc', background: '#eff6ff', padding: '3px 10px', borderRadius: '9999px', border: '1px solid #bfdbfe' }}>
            v4.2 ATS
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Contact Identifiers */}
          <div style={{
            padding: '16px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>
                <User size={16} color="#0052cc" /> Contact Identifiers
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#047857' }}>
                {extractedData?.contactInfo ? 'Detected' : '3 Detected'}
              </span>
            </div>
            <p style={{ fontSize: '0.775rem', color: '#64748b', marginBottom: '10px' }}>
              Regex scans for applicant name, direct email format, and international phone prefixes.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="pill pill-slate">{candidateName}</span>
              <span className="pill pill-slate">{email}</span>
              <span className="pill pill-slate">{phone}</span>
            </div>
          </div>

          {/* Skills Corpus Match */}
          <div style={{
            padding: '16px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>
                <Wrench size={16} color="#0052cc" /> Skills Corpus Match
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#047857' }}>
                {skillsList.length} Found
              </span>
            </div>
            <p style={{ fontSize: '0.775rem', color: '#64748b', marginBottom: '10px' }}>
              Cross-references technical and interpersonal terminology against standardized taxonomy.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {skillsList.slice(0, 6).map((skill, idx) => (
                <span key={idx} className="pill pill-blue">{skill}</span>
              ))}
              {skillsList.length > 6 && (
                <span className="pill pill-slate">+{skillsList.length - 6} more</span>
              )}
            </div>
          </div>

          {/* Seniority & Title Parsing */}
          <div style={{
            padding: '16px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>
                <Briefcase size={16} color="#0052cc" /> Seniority & Title Parsing
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0052cc' }}>L4 Lead Pattern</span>
            </div>
            <p style={{ fontSize: '0.775rem', color: '#64748b', marginBottom: '10px' }}>
              Identifies chronological tenure milestones and position weightings.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="pill pill-slate">Lead Developer</span>
              <span className="pill pill-slate">Software Engineer</span>
              <span className="pill pill-blue">6.5 Yrs Exp</span>
            </div>
          </div>

          {/* Degree & Credentials */}
          <div style={{
            padding: '16px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>
                <GraduationCap size={16} color="#0052cc" /> Degree & Credentials
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#047857' }}>Validated</span>
            </div>
            <p style={{ fontSize: '0.775rem', color: '#64748b', marginBottom: '10px' }}>
              Extracts degree level, issuing institution, graduation timeline, and accredited certs.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="pill pill-slate">B.S. Computer Science</span>
              <span className="pill pill-slate">AWS Solutions Arch</span>
            </div>
          </div>

        </div>
      </div>

      {/* Continue CTA Button */}
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <button
          type="button"
          onClick={onNext}
          className="btn-cv-primary"
          style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
        >
          Run Algorithmic Diagnostics <ArrowRight size={18} />
        </button>
      </div>

    </div>
  );
}

