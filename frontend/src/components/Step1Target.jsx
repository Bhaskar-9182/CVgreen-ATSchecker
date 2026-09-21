import React, { useState, useEffect } from 'react';
import { Briefcase, Building, Sparkles, UploadCloud, FileText, ArrowRight, Check } from 'lucide-react';

const SAMPLE_JD = `We are looking for a Senior Full-Stack Engineer with 5+ years building distributed cloud applications. You will architect robust microservices using Node.js, TypeScript, and Go, coupled with modern React frontend interfaces. Deep knowledge of PostgreSQL, GraphQL API design, Docker containerization, and AWS serverless infrastructure is essential. You will drive CI/CD pipelines, lead engineering peer reviews, and mentor engineers to maintain high standards of code safety and scalable telemetry.`;

export default function Step1Target({ 
  jobTitle, 
  setJobTitle, 
  targetCompany, 
  setTargetCompany, 
  jobDescription, 
  setJobDescription, 
  onNext 
}) {
  const [activeTab, setActiveTab] = useState('paste'); // 'paste' | 'upload'
  const [wordCount, setWordCount] = useState(68);

  useEffect(() => {
    if (jobDescription) {
      const words = jobDescription.trim().split(/\s+/).filter(Boolean);
      setWordCount(words.length);
    } else {
      setWordCount(0);
    }
  }, [jobDescription]);

  const handlePasteSample = () => {
    setJobTitle('Senior Full-Stack Engineer');
    setTargetCompany('Stripe');
    setJobDescription(SAMPLE_JD);
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '16px 0 60px' }}>
      
      {/* Step Subtitle */}
      <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '24px' }}>
        Provide the job details to calibrate rule-based keyword extraction and match weights
      </p>

      {/* Target Job Title Card */}
      <div className="cv-card" style={{ padding: '18px 22px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1e293b' }}>
            Target Job Title <span style={{ color: '#0052cc' }}>*</span>
          </label>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>e.g. Lead, Senior</span>
        </div>
        <div style={{ position: 'relative' }}>
          <Briefcase size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: '#64748b' }} />
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Senior Full-Stack Engineer"
            style={{
              width: '100%',
              padding: '8px 14px 8px 36px',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.875rem',
              color: '#0f172a',
              background: '#f8fafc'
            }}
          />
        </div>
      </div>

      {/* Target Company Card */}
      <div className="cv-card" style={{ padding: '18px 22px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1e293b' }}>
            Target Company
          </label>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Optional</span>
        </div>
        <div style={{ position: 'relative' }}>
          <Building size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: '#64748b' }} />
          <input
            type="text"
            value={targetCompany}
            onChange={(e) => setTargetCompany(e.target.value)}
            placeholder="Stripe"
            style={{
              width: '100%',
              padding: '8px 14px 8px 36px',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.875rem',
              color: '#0f172a',
              background: '#f8fafc'
            }}
          />
        </div>
      </div>

      {/* JD Input Area Card */}
      <div className="cv-card" style={{ overflow: 'hidden', marginBottom: '20px' }}>
        {/* Toggle Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            style={{
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'paste' ? '700' : '600',
              background: activeTab === 'paste' ? '#ffffff' : 'transparent',
              color: activeTab === 'paste' ? '#0052cc' : '#64748b',
              borderBottom: activeTab === 'paste' ? '2px solid #0052cc' : 'none'
            }}
          >
            <FileText size={16} /> Paste Text
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            style={{
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'upload' ? '700' : '600',
              background: activeTab === 'upload' ? '#ffffff' : 'transparent',
              color: activeTab === 'upload' ? '#0052cc' : '#64748b',
              borderBottom: activeTab === 'upload' ? '2px solid #0052cc' : 'none'
            }}
          >
            <UploadCloud size={16} /> Upload JD File
          </button>
        </div>

        {/* Text Content */}
        <div style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              fontWeight: '700',
              color: '#065f46',
              background: '#ecfdf5',
              padding: '3px 10px',
              borderRadius: '9999px',
              border: '1px solid #a7f3d0'
            }}>
              <Sparkles size={13} color="#10b981" /> PARSER READY
            </span>

            <button
              type="button"
              onClick={handlePasteSample}
              style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                color: '#1d4ed8',
                fontSize: '0.775rem',
                fontWeight: '600',
                padding: '4px 12px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Sparkles size={12} /> Paste Sample JD
            </button>
          </div>

          <textarea
            rows={7}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste target job requirements and core technical competencies..."
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.875rem',
              color: '#1e293b',
              lineHeight: '1.6',
              resize: 'vertical',
              background: '#f8fafc'
            }}
          />

          <div style={{ textAlign: 'right', marginTop: '8px', fontSize: '0.75rem', color: '#64748b' }}>
            ● {wordCount} words detected
          </div>
        </div>

        {/* Instant Rule Pre-Check Bar */}
        <div style={{
          padding: '14px 24px',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Instant Rule Pre-Check
            </span>
            <span className="pill pill-blue">
              🎯 Target Level: Mid-Senior (5+ yrs)
            </span>
            <span className="pill pill-green">
              ✓ TypeScript
            </span>
            <span className="pill pill-green">
              ✓ React
            </span>
            <span className="pill pill-green">
              ✓ AWS Serverless
            </span>
            <span className="pill pill-green">
              ✓ PostgreSQL
            </span>
            <span className="pill pill-slate">
              +7 inferred tokens
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: '700', color: '#065f46' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }} />
            Calibrated
          </div>
        </div>
      </div>

      {/* Continue CTA Button */}
      <div style={{ textAlign: 'center', marginTop: '28px' }}>
        <button
          type="button"
          onClick={onNext}
          disabled={!jobTitle || !jobDescription}
          className="btn-cv-primary"
          style={{
            width: '100%',
            padding: '14px 28px',
            fontSize: '1rem',
            letterSpacing: '-0.01em',
            borderRadius: '10px'
          }}
        >
          Continue to Upload Resume <ArrowRight size={18} />
        </button>
        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          ⇄ Next: Upload your CV for automated text parsing
        </p>
      </div>

    </div>
  );
}

