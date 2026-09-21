import React from 'react';
import { History, FileText, Calendar, HardDrive, ArrowRight } from 'lucide-react';

export default function ResumeHistory({ resumes, onSelectResume, activeResumeId }) {
  if (!resumes || resumes.length === 0) {
    return null;
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          padding: '8px',
          borderRadius: '8px',
          color: '#34d399'
        }}>
          <History size={20} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Your Saved Resumes</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Stored in cloud storage • Click any document to inspect or re-analyze
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
        {resumes.map((resume) => {
          const isActive = activeResumeId === resume.id;
          return (
            <div
              key={resume.id}
              onClick={() => onSelectResume(resume)}
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                border: `1px solid ${isActive ? '#6366f1' : 'var(--border)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'rgba(51, 65, 85, 0.4)',
                  color: '#818cf8',
                  flexShrink: 0
                }}>
                  <FileText size={20} />
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <h4 style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: 'var(--text-main)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {resume.fileName}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <span className="badge badge-info" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                      {resume.fileFormat?.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <HardDrive size={11} /> {resume.storageType || 'S3'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '10px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                fontSize: '0.75rem',
                color: 'var(--text-dim)'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={12} /> {formatDate(resume.uploadedAt)}
                </span>
                <span style={{
                  color: isActive ? '#818cf8' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: '600'
                }}>
                  {isActive ? 'Active' : 'Select'} <ArrowRight size={12} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

