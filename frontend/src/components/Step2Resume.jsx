import React, { useState, useRef } from 'react';
import { 
  FileText, UploadCloud, CheckCircle2, ArrowRight, 
  User, Wrench, Briefcase, GraduationCap, Loader2, AlertTriangle
} from 'lucide-react';
import { resumeApi } from '../services/api';

export default function Step2Resume({ 
  currentResume, 
  onResumeUploaded, 
  onNext, 
  analysisError,
  analyzing
}) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const [extractedData, setExtractedData] = useState(null);

  const handleSelectedFile = async (file) => {
    if (!file || uploading) return;

    setSelectedFile(file);
    setExtractedData(null);
    setError(null);
    onResumeUploaded(null);

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx'].includes(extension)) {
      setError('Unsupported file type. Please upload a PDF (.pdf) or Word document (.docx).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit.');
      return;
    }

    setUploading(true);

    try {
      const response = await resumeApi.uploadResume(file);
      setExtractedData(response);
      onResumeUploaded(response);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'Upload failed. Please check the document and ensure the backend is running.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    handleSelectedFile(file);
  };

  const handleDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === 'dragenter' || event.type === 'dragover') {
      setDragActive(true);
    } else if (event.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    handleSelectedFile(event.dataTransfer.files?.[0]);
  };

  const activeFileName = currentResume?.fileName || (selectedFile ? selectedFile.name : 'No resume uploaded');
  const activeFileSize = currentResume?.fileSize ? (currentResume.fileSize / 1024).toFixed(0) + ' KB' : '';

  const resumeData = extractedData || currentResume;
  const candidateName = resumeData?.contactInfo?.candidateName || 'Not detected';
  const email = resumeData?.contactInfo?.email || 'Not detected';
  const phone = resumeData?.contactInfo?.phone || 'Not detected';
  const skillsList = resumeData?.extractedSkills || [];
  const presentSections = Object.entries(resumeData?.sections || {})
    .filter(([, present]) => present)
    .map(([section]) => section);

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
                {activeFileSize && <><span>{activeFileSize}</span><span>•</span></>}
                <span>•</span>
                <span style={{ color: currentResume ? '#047857' : '#64748b', fontWeight: '600' }}>
                  {currentResume ? 'Text extracted successfully' : 'Upload a document to extract its contents'}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              color: currentResume ? '#065f46' : '#64748b',
              background: currentResume ? '#ecfdf5' : '#f1f5f9',
              padding: '4px 12px',
              borderRadius: '9999px',
              border: `1px solid ${currentResume ? '#a7f3d0' : '#cbd5e1'}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              {currentResume ? <><CheckCircle2 size={14} color="#10b981" /> Text extracted</> : 'Awaiting upload'}
            </span>

            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="btn-cv-secondary"
              style={{ padding: '6px 14px', fontSize: '0.8rem', opacity: uploading ? 0.6 : 1 }}
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
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragActive ? '#0877ff' : '#cbd5e1'}`,
          borderRadius: '14px',
          padding: '36px 20px',
          textAlign: 'center',
          background: dragActive ? 'rgba(8, 119, 255, 0.08)' : '#f8fafc',
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

      {error && (
        <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '18px', fontSize: '0.85rem' }}>
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      {currentResume?.previewSnippet && (
        <div className="cv-card" style={{ padding: '16px 20px', marginBottom: '18px' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            Extracted text preview
          </div>
          <pre style={{ margin: 0, color: '#334155', fontSize: '0.8rem', lineHeight: 1.5, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
            {currentResume.previewSnippet}
          </pre>
        </div>
      )}

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
                {resumeData?.contactInfo ? 'Document results' : 'No document'}
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

          {/* Text Extraction Details */}
          <div style={{
            padding: '16px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>
                <Briefcase size={16} color="#0052cc" /> Text Extraction
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0052cc' }}>Document text</span>
            </div>
            <p style={{ fontSize: '0.775rem', color: '#64748b', marginBottom: '10px' }}>
              A short preview of the text extracted from this document.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="pill pill-slate">{resumeData ? `${resumeData.previewSnippet?.length || 0} preview characters` : 'Not analyzed'}</span>
            </div>
          </div>

          {/* Detected Sections */}
          <div style={{
            padding: '16px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>
                <GraduationCap size={16} color="#0052cc" /> Resume Sections
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#047857' }}>
                {presentSections.length} sections detected
              </span>
            </div>
            <p style={{ fontSize: '0.775rem', color: '#64748b', marginBottom: '10px' }}>
              Recognized section headings found in the extracted text.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {presentSections.length > 0
                ? presentSections.map((section) => <span key={section} className="pill pill-slate">{section}</span>)
                : <span className="pill pill-slate">No sections detected</span>}
            </div>
          </div>

        </div>
      </div>

      {/* Continue CTA Button */}
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        {analysisError && (
          <p role="alert" style={{ color: '#b91c1c', marginBottom: '12px', fontSize: '0.875rem' }}>
            {analysisError}
          </p>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={!currentResume || uploading || analyzing}
          className="btn-cv-primary"
          style={{ width: '100%', padding: '14px', fontSize: '1rem', opacity: !currentResume || uploading || analyzing ? 0.6 : 1 }}
        >
          {analyzing ? <><Loader2 size={18} className="animate-spin" /> Analyzing document...</> : <>Run Algorithmic Diagnostics <ArrowRight size={18} /></>}
        </button>
      </div>

    </div>
  );
}
