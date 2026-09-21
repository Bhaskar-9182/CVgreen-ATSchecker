import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { resumeApi } from '../services/api';

export default function ResumeUploader({ onResumeUploaded, currentResume }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const validateAndSetFile = (file) => {
    setError(null);
    if (!file) return;

    const extension = file.name.split('.').pop().toLowerCase();
    if (extension !== 'pdf' && extension !== 'docx') {
      setError('Unsupported file type. Please upload a PDF (.pdf) or Word document (.docx).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit.');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError(null);

    try {
      const response = await resumeApi.uploadResume(selectedFile);
      onResumeUploaded(response);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload and parse resume. Please ensure you are signed in.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{
          background: 'rgba(99, 102, 241, 0.15)',
          padding: '8px',
          borderRadius: '8px',
          color: '#818cf8'
        }}>
          <FileText size={20} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Step 1: Upload Resume</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Parsed deterministically via Apache PDFBox & Apache POI
          </p>
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
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Drag and Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragActive ? '#6366f1' : 'var(--border)'}`,
          borderRadius: '12px',
          padding: '36px 20px',
          textAlign: 'center',
          background: dragActive ? 'rgba(99, 102, 241, 0.08)' : 'rgba(15, 23, 42, 0.4)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept=".pdf,.docx" 
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#818cf8'
          }}>
            <UploadCloud size={28} />
          </div>

          <div>
            <p style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-main)' }}>
              {selectedFile ? selectedFile.name : 'Click to upload or drag & drop'}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              Supported formats: PDF (.pdf) and Microsoft Word (.docx) • Max 10MB
            </p>
          </div>

          {selectedFile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              <span className="badge badge-info">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </span>
              <span className="badge badge-success">
                Ready for extraction
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          {currentResume ? (
            <span style={{ color: '#34d399', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={15} /> Active: <strong>{currentResume.fileName}</strong>
            </span>
          ) : 'No file currently loaded'}
        </div>

        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="btn-primary"
          style={{ padding: '9px 20px', fontSize: '0.875rem' }}
        >
          {uploading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Extracting Text...
            </>
          ) : (
            <>
              <UploadCloud size={16} /> Upload & Extract
            </>
          )}
        </button>
      </div>

      {/* Extracted snippet preview if uploaded */}
      {currentResume?.previewSnippet && (
        <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-dim)', marginBottom: '4px', textTransform: 'uppercase' }}>
            Extracted Text Preview ({currentResume.fileFormat.toUpperCase()})
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', whiteSpace: 'pre-wrap', maxHeight: '70px', overflowY: 'auto' }}>
            {currentResume.previewSnippet}
          </p>
        </div>
      )}
    </div>
  );
}

