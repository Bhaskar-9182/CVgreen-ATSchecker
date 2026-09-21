import React from 'react';
import { 
  Award, CheckCircle2, XCircle, FileCheck, Layers, Hash, 
  Mail, Phone, Globe, Github, Linkedin, Lightbulb, Download, UserCheck
} from 'lucide-react';
import { resumeApi } from '../services/api';

export default function AtsScoreDashboard({ result }) {
  if (!result) return null;

  const getScoreColor = (score) => {
    if (score >= 75) return '#10b981'; // Green
    if (score >= 50) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  const getScoreBg = (score) => {
    if (score >= 75) return 'rgba(16, 185, 129, 0.12)';
    if (score >= 50) return 'rgba(245, 158, 11, 0.12)';
    return 'rgba(239, 68, 68, 0.12)';
  };

  const scoreColor = getScoreColor(result.overallScore);

  const handleDownload = () => {
    if (result.resumeId) {
      resumeApi.downloadResume(result.resumeId, result.fileName || 'resume');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner: Score Gauge and Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        
        {/* Overall ATS Score Card */}
        <div className="glass-panel" style={{
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${scoreColor} 0%, #6366f1 100%)`
          }} />

          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
            Deterministic ATS Match Score
          </div>

          {/* Circular Score Display */}
          <div style={{
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: getScoreBg(result.overallScore),
            border: `4px solid ${scoreColor}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 30px ${scoreColor}33`,
            marginBottom: '16px'
          }}>
            <span style={{ fontSize: '2.8rem', fontWeight: '800', color: scoreColor, lineHeight: 1 }}>
              {result.overallScore}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: '600' }}>/ 100</span>
          </div>

          <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-main)' }}>
            {result.overallScore >= 75 ? 'High Interview Probability' : (result.overallScore >= 50 ? 'Moderate ATS Compatibility' : 'Low Keyword Alignment')}
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Target Role: <strong>{result.jobTitle}</strong>
          </p>
        </div>

        {/* Component Scores Breakdown */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="#818cf8" /> ATS Component Breakdown
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Skill Match */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Skill Match (50% weight)</span>
                <span style={{ fontWeight: '700', color: getScoreColor(result.skillMatchScore) }}>{result.skillMatchScore}%</span>
              </div>
              <div style={{ height: '6px', background: '#334155', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${result.skillMatchScore}%`, height: '100%', background: getScoreColor(result.skillMatchScore) }} />
              </div>
            </div>

            {/* Section Completeness */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Section Completeness (20% weight)</span>
                <span style={{ fontWeight: '700', color: getScoreColor(result.sectionScore) }}>{result.sectionScore}%</span>
              </div>
              <div style={{ height: '6px', background: '#334155', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${result.sectionScore}%`, height: '100%', background: getScoreColor(result.sectionScore) }} />
              </div>
            </div>

            {/* Keyword Frequency */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Keyword Frequency & Density (15% weight)</span>
                <span style={{ fontWeight: '700', color: getScoreColor(result.keywordFrequencyScore) }}>{result.keywordFrequencyScore}%</span>
              </div>
              <div style={{ height: '6px', background: '#334155', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${result.keywordFrequencyScore}%`, height: '100%', background: getScoreColor(result.keywordFrequencyScore) }} />
              </div>
            </div>

            {/* Formatting & Word Count */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Formatting & Readability (15% weight)</span>
                <span style={{ fontWeight: '700', color: getScoreColor(result.formattingScore) }}>{result.formattingScore}%</span>
              </div>
              <div style={{ height: '6px', background: '#334155', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${result.formattingScore}%`, height: '100%', background: getScoreColor(result.formattingScore) }} />
              </div>
            </div>

          </div>

          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            <span>Word Count: <strong>{result.wordCount} words</strong></span>
            <span>Matched Keywords: <strong>{result.matchedSkills?.length || 0}</strong></span>
          </div>
        </div>

        {/* Extracted Candidate Information */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={18} color="#34d399" /> Extracted Candidate Profile
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.825rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--text-dim)', width: '80px' }}>Name:</span>
                <strong style={{ color: 'var(--text-main)' }}>{result.contactInfo?.candidateName || 'Candidate'}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={14} color="#818cf8" />
                <span style={{ color: result.contactInfo?.email ? 'var(--text-main)' : 'var(--text-dim)' }}>
                  {result.contactInfo?.email || 'Not detected'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={14} color="#818cf8" />
                <span style={{ color: result.contactInfo?.phone ? 'var(--text-main)' : 'var(--text-dim)' }}>
                  {result.contactInfo?.phone || 'Not detected'}
                </span>
              </div>
              {result.contactInfo?.linkedInUrl && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Linkedin size={14} color="#0284c7" />
                  <a href={`https://${result.contactInfo.linkedInUrl.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'none' }}>
                    {result.contactInfo.linkedInUrl}
                  </a>
                </div>
              )}
              {result.contactInfo?.gitHubUrl && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Github size={14} color="#e2e8f0" />
                  <a href={`https://${result.contactInfo.gitHubUrl.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" style={{ color: '#a5b4fc', textDecoration: 'none' }}>
                    {result.contactInfo.gitHubUrl}
                  </a>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="btn-secondary"
            style={{ marginTop: '16px', width: '100%', justifyContent: 'center', padding: '8px', fontSize: '0.825rem' }}
          >
            <Download size={15} /> Download Original Document
          </button>
        </div>

      </div>

      {/* Keywords Comparison: Matched (Set Intersection) vs Missing (Set Difference) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        
        {/* Matched Skills */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} color="#10b981" /> Matched Job Keywords ({result.matchedSkills?.length || 0})
            </h4>
            <span className="badge badge-success">Set Intersection</span>
          </div>

          {result.matchedSkills && result.matchedSkills.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {result.matchedSkills.map((skill, i) => (
                <span key={i} className="badge badge-success" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                  ✓ {skill}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
              No target skills from the job description were matched in this document.
            </p>
          )}
        </div>

        {/* Missing Skills */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <XCircle size={18} color="#ef4444" /> Missing Target Keywords ({result.missingSkills?.length || 0})
            </h4>
            <span className="badge badge-danger">Set Difference</span>
          </div>

          {result.missingSkills && result.missingSkills.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {result.missingSkills.map((skill, i) => (
                <span key={i} className="badge badge-danger" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                  + {skill}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: '600' }}>
              Fantastic! All identified keywords from the job description are present.
            </p>
          )}
        </div>

      </div>

      {/* Sections and Deterministic Recommendations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        
        {/* Sections Audit */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCheck size={18} color="#818cf8" /> Resume Section Structure
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['Contact Information', 'Summary', 'Work Experience', 'Education', 'Skills', 'Projects', 'Certifications'].map((sec, idx) => {
              const isPresent = result.presentSections?.includes(sec);
              return (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: 'rgba(15, 23, 42, 0.4)',
                  borderRadius: '8px',
                  border: '1px solid var(--border)'
                }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{sec}</span>
                  {isPresent ? (
                    <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                      <CheckCircle2 size={12} /> Detected
                    </span>
                  ) : (
                    <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>
                      <XCircle size={12} /> Missing Header
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Rule-Based Recommendations */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lightbulb size={18} color="#fbbf24" /> Deterministic ATS Recommendations
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {result.recommendations && result.recommendations.map((tip, idx) => (
              <div key={idx} style={{
                display: 'flex',
                gap: '12px',
                padding: '12px 14px',
                background: 'rgba(15, 23, 42, 0.5)',
                borderRadius: '8px',
                borderLeft: '4px solid #6366f1',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                lineHeight: '1.5'
              }}>
                <span style={{ color: '#818cf8', fontWeight: '700' }}>#{idx + 1}</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

