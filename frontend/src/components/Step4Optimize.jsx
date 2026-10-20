import React, { useState } from 'react';
import { Download, RotateCcw, AlertTriangle } from 'lucide-react';
import { resumeApi } from '../services/api';

export default function Step4Optimize({ result, onRestart }) {
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  if (!result) {
    return (
      <div style={{ maxWidth: '1080px', margin: '40px auto', textAlign: 'center' }}>
        <p>No analysis result available. Run diagnostics before viewing this page.</p>
      </div>
    );
  }

  const matchedSkills = result.matchedSkills || [];
  const missingSkills = result.missingSkills || [];
  const recommendations = result.recommendations || [];

  const downloadOriginalResume = async () => {
    if (!result.resumeId || !result.fileName) {
      setDownloadError('The original resume is unavailable for download.');
      return;
    }

    setDownloading(true);
    setDownloadError(null);
    try {
      await resumeApi.downloadResume(result.resumeId, result.fileName);
    } catch (err) {
      setDownloadError(err.response?.data?.error || 'Could not download the original resume.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '16px 0 80px' }}>
      <div className="cv-card" style={{ padding: '24px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
          Resume Analysis Summary
        </h2>
        <p style={{ color: '#475569', marginBottom: '18px' }}>
          Showing results from {result.fileName || 'the uploaded resume'} against {result.jobTitle || 'the target role'}.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <span className="pill pill-blue">ATS score: {result.overallScore ?? 0}/100</span>
          <span className="pill pill-green">{matchedSkills.length} matched skills</span>
          <span className="pill pill-slate">{missingSkills.length} unmatched skills</span>
          <span className="pill pill-slate">{result.wordCount ?? 0} words</span>
        </div>
      </div>

      {result.optimizedResumeText ? (
        <div className="cv-card" style={{ padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
            Optimized resume text
          </h3>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', color: '#334155', fontSize: '0.875rem' }}>
            {result.optimizedResumeText}
          </pre>
        </div>
      ) : (
        <div className="cv-card" style={{ padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
            Optimization draft unavailable
          </h3>
          <p style={{ color: '#475569', lineHeight: 1.5 }}>
            The current analysis engine reports match gaps and recommendations but does not generate a rewritten resume. Your original document is unchanged.
          </p>
        </div>
      )}

      {missingSkills.length > 0 && (
        <div className="cv-card" style={{ padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
            Skills not found in the resume
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {missingSkills.map((skill) => <span key={skill} className="pill pill-orange">{skill}</span>)}
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="cv-card" style={{ padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>
            Recommendations
          </h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#475569', lineHeight: 1.7 }}>
            {recommendations.map((recommendation, index) => <li key={index}>{recommendation}</li>)}
          </ul>
        </div>
      )}

      {downloadError && (
        <p role="alert" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b91c1c', marginBottom: '16px' }}>
          <AlertTriangle size={16} /> {downloadError}
        </p>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={downloadOriginalResume}
          disabled={downloading}
          className="btn-cv-primary"
          style={{ padding: '10px 20px', fontSize: '0.875rem' }}
        >
          <Download size={16} /> {downloading ? 'Downloading...' : 'Download original resume'}
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="btn-cv-secondary"
          style={{ padding: '10px 18px', fontSize: '0.85rem', color: '#0052cc', border: '1px dashed #bfdbfe' }}
        >
          <RotateCcw size={15} /> Analyze Another Resume
        </button>
      </div>
    </div>
  );
}
