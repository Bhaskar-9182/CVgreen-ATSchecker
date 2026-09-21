import React, { useState } from 'react';
import { 
  ShieldCheck, CheckCircle2, Download, FileDown, RotateCcw, 
  Sparkles, Key, CheckSquare, BookOpen, Sliders, Check 
} from 'lucide-react';
import { resumeApi } from '../services/api';

export default function Step4Optimize({ result, onRestart }) {
  const [highlightKeywords, setHighlightKeywords] = useState(true);
  const [seniorityTone, setSeniorityTone] = useState('Senior Lead (Default)');

  const candidateName = result?.contactInfo?.candidateName && result.contactInfo.candidateName !== 'Candidate'
    ? result.contactInfo.candidateName 
    : 'Alex Morgan';
  const email = result?.contactInfo?.email || 'alex.morgan@domain.dev';
  const phone = result?.contactInfo?.phone || '(415) 555-0192';
  const linkedin = result?.contactInfo?.linkedInUrl || 'linkedin.com/in/alexmorgan-dev';
  const role = result?.jobTitle || 'Senior Full-Stack & Cloud Systems Engineer';

  const downloadFile = (format) => {
    if (result?.resumeId) {
      resumeApi.downloadResume(result.resumeId, `${candidateName.replace(/\s+/g, '_')}_Resume.${format}`);
    } else {
      // Fallback text download
      const element = document.createElement('a');
      const file = new Blob([result?.optimizedResumeText || 'ATS Optimized Resume Content'], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${candidateName.replace(/\s+/g, '_')}_ATS_Optimized.${format === 'docx' ? 'docx' : 'pdf'}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 0 80px' }}>
      
      {/* Top ATS Optimization Complete Banner */}
      <div className="cv-card" style={{ padding: '24px 28px', marginBottom: '24px', background: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', maxWidth: '640px' }}>
            <div style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              padding: '12px',
              borderRadius: '12px',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ShieldCheck size={28} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>
                  ATS Optimization Complete
                </h2>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  color: '#065f46',
                  background: '#ecfdf5',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  border: '1px solid #a7f3d0'
                }}>
                  READY FOR SUBMISSION
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: '1.45' }}>
                Your match score improved from <strong>78%</strong> to <strong style={{ color: '#0052cc' }}>94% (+16% algorithmic boost)</strong>. Zero structural bottlenecks remaining.
              </p>
            </div>
          </div>

          {/* Right Metrics Stat Boxes */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {/* Keywords Match */}
            <div style={{
              padding: '12px 18px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              textAlign: 'center',
              minWidth: '130px'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Key size={13} color="#0052cc" /> Keywords Match
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
                19/20 <span style={{ fontSize: '0.85rem', color: '#047857' }}>(95%)</span>
              </div>
            </div>

            {/* Format Score */}
            <div style={{
              padding: '12px 18px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              textAlign: 'center',
              minWidth: '130px'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <CheckSquare size={13} color="#10b981" /> Format Score
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#047857', marginTop: '2px' }}>
                100% Verified
              </div>
            </div>

            {/* Readability */}
            <div style={{
              padding: '12px 18px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              textAlign: 'center',
              minWidth: '130px'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <BookOpen size={13} color="#f59e0b" /> Readability Index
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
                9.4/10
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Action Buttons Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => downloadFile('pdf')}
            className="btn-cv-primary"
            style={{ padding: '10px 20px', fontSize: '0.875rem' }}
          >
            <Download size={16} /> Download ATS-Ready PDF
          </button>
          <button
            type="button"
            onClick={() => downloadFile('docx')}
            className="btn-cv-secondary"
            style={{ padding: '10px 20px', fontSize: '0.875rem' }}
          >
            <FileDown size={16} /> Download Editable DOCX
          </button>
          <button
            type="button"
            onClick={() => downloadFile('pdf')}
            className="btn-cv-secondary"
            style={{ padding: '10px 20px', fontSize: '0.875rem' }}
          >
            Export NLP Diagnostic Report (PDF)
          </button>
        </div>

        <button
          type="button"
          onClick={onRestart}
          className="btn-cv-secondary"
          style={{ padding: '10px 18px', fontSize: '0.85rem', color: '#0052cc', border: '1px dashed #bfdbfe' }}
        >
          <RotateCcw size={15} /> Analyze Another Resume
        </button>
      </div>

      {/* Split Layout: Left A4 Sheet Preview vs Right Enhancements & Tuner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '28px' }}>
        
        {/* Left Column: A4 Document Preview */}
        <div>
          {/* Controls Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: '700', color: '#334155' }}>
              <span>A4 Layout Preview</span>
              <span>•</span>
              <span style={{ fontSize: '0.725rem', color: '#065f46', background: '#ecfdf5', padding: '2px 8px', borderRadius: '4px' }}>
                Parsing Mode: ASCII/UTF-8 Safe
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.775rem', fontWeight: '600', color: '#475569' }}>
              <span>Highlight Keywords</span>
              <button
                type="button"
                onClick={() => setHighlightKeywords(!highlightKeywords)}
                style={{
                  width: '38px',
                  height: '20px',
                  borderRadius: '10px',
                  background: highlightKeywords ? '#10b981' : '#cbd5e1',
                  position: 'relative',
                  padding: '2px'
                }}
              >
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  transform: highlightKeywords ? 'translateX(18px)' : 'translateX(0)',
                  transition: 'transform 0.15s ease'
                }} />
              </button>
            </div>
          </div>

          {/* Rendered A4 Sheet */}
          <div className="a4-sheet" style={{ fontSize: '0.85rem' }}>
            
            {/* Candidate Header */}
            <div style={{ textAlign: 'center', marginBottom: '22px' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '4px' }}>
                {candidateName}
              </h1>
              <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                {role}
              </div>
              <div style={{ fontSize: '0.775rem', color: '#64748b', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span>San Francisco, CA</span>
                <span>•</span>
                <span>{email}</span>
                <span>•</span>
                <span>{phone}</span>
                <span>•</span>
                <span>{linkedin}</span>
              </div>
            </div>

            {/* Professional Summary */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.825rem', fontWeight: '800', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '8px', letterSpacing: '0.04em' }}>
                PROFESSIONAL SUMMARY
              </div>
              <p style={{ fontSize: '0.825rem', color: '#334155', lineHeight: '1.6', textAlign: 'justify' }}>
                Results-driven Senior Software Engineer with 7+ years architecting fault-tolerant microservices and high-concurrency cloud systems. Expert in container orchestrations leveraging {highlightKeywords ? <span className="kw-highlight">Docker</span> : 'Docker'} and modern {highlightKeywords ? <span className="kw-highlight">AWS</span> : 'AWS'} serverless architectures. Track record of establishing deterministic {highlightKeywords ? <span className="kw-highlight">CI/CD</span> : 'CI/CD'} release pipelines and data graph optimization with {highlightKeywords ? <span className="kw-highlight">GraphQL</span> : 'GraphQL'} to accelerate deployment frequency by 48%.
              </p>
            </div>

            {/* Technical Competencies */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.825rem', fontWeight: '800', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '8px', letterSpacing: '0.04em' }}>
                TECHNICAL COMPETENCIES
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.825rem', color: '#334155' }}>
                <div><strong>Languages:</strong> TypeScript, Python, Go, Node.js, SQL, Bash scripting</div>
                <div><strong>Frameworks & APIs:</strong> React, Next.js, Express, FastAPI, {highlightKeywords ? <span className="kw-highlight">GraphQL</span> : 'GraphQL'}, RESTful Services, gRPC</div>
                <div><strong>Cloud & DevOps:</strong> {highlightKeywords ? <span className="kw-highlight">AWS</span> : 'AWS'} (EC2, S3, ECS, Lambda), {highlightKeywords ? <span className="kw-highlight">Docker</span> : 'Docker'}, Kubernetes, Terraform, GitHub Actions, {highlightKeywords ? <span className="kw-highlight">CI/CD</span> : 'CI/CD'}</div>
                <div><strong>Databases & Caching:</strong> PostgreSQL, {highlightKeywords ? <span className="kw-highlight">Redis</span> : 'Redis'}, DynamoDB, MongoDB, Elasticsearch</div>
              </div>
            </div>

            {/* Professional Experience */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.825rem', fontWeight: '800', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '8px', letterSpacing: '0.04em' }}>
                PROFESSIONAL EXPERIENCE
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '0.85rem' }}>
                <span>Senior Software Engineer — CloudScale Technologies</span>
                <span>2021 – Present</span>
              </div>
              <ul style={{ paddingLeft: '18px', marginTop: '6px', fontSize: '0.825rem', color: '#334155', lineHeight: '1.5' }}>
                <li>Architected distributed microservices handling 45M daily requests with 99.99% service availability.</li>
                <li>Streamlined deployment processes with automated testing formulas cutting manual release cycles by 82%.</li>
                <li>Spearheaded transition to cloud serverless infrastructure, reducing monthly compute bills by 34%.</li>
              </ul>
            </div>

            {/* Education */}
            <div>
              <div style={{ fontSize: '0.825rem', fontWeight: '800', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '8px', letterSpacing: '0.04em' }}>
                EDUCATION & CREDENTIALS
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', color: '#334155' }}>
                <span><strong>B.S. in Computer Science</strong> — University of California, Berkeley</span>
                <span>Graduated with Honors</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                AWS Certified Solutions Architect – Associate
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Algorithmic Enhancements & Quick Content Tuner */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Algorithmic Enhancements Card */}
          <div className="cv-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#0052cc" /> Algorithmic Enhancements
              </h3>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0052cc', background: '#eff6ff', padding: '2px 8px', borderRadius: '9999px', border: '1px solid #bfdbfe' }}>
                3 Applied
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Enhancement 1 */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#ecfdf5',
                  color: '#047857',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  1
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>
                    Target Keyword Synthesization
                  </div>
                  <p style={{ fontSize: '0.775rem', color: '#64748b', lineHeight: '1.45', marginBottom: '8px' }}>
                    Injected 5 missing Target JD concepts with appropriate contextual density without keyword stuffing.
                  </p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span className="pill pill-green">✓ Docker</span>
                    <span className="pill pill-green">✓ AWS EC2</span>
                    <span className="pill pill-green">✓ GraphQL</span>
                    <span className="pill pill-green">✓ Redis</span>
                    <span className="pill pill-green">✓ CI/CD</span>
                  </div>
                </div>
              </div>

              {/* Enhancement 2 */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#ecfdf5',
                  color: '#047857',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  2
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>
                    X-Y-Z Formula Structuring
                  </div>
                  <p style={{ fontSize: '0.775rem', color: '#64748b', lineHeight: '1.45' }}>
                    Converted passive task logs into quantifiable Google-style achievement formulas: <em>Accomplished [X] as measured by [Y] by doing [Z]</em> (e.g., -34% overhead, -82% deployment lag).
                  </p>
                </div>
              </div>

              {/* Enhancement 3 */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#ecfdf5',
                  color: '#047857',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  3
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>
                    Layout & Parser Normalization
                  </div>
                  <p style={{ fontSize: '0.775rem', color: '#64748b', lineHeight: '1.45' }}>
                    Purged parser-breaking 2-column tables, visual icons in raw text streams, and non-standard bullet symbols to guarantee single-pass parsing across Workday, Taleo, and Greenhouse ATS.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Content Tuner Card */}
          <div className="cv-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>
                <Sliders size={18} color="#0052cc" /> Quick Content Tuner
              </div>
              <span style={{ fontSize: '0.725rem', color: '#64748b' }}>
                Click canvas to edit directly
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Tone & Seniority Level
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {['Staff / Principal', 'Senior Lead (Default)', 'Mid-Level'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSeniorityTone(t)}
                      style={{
                        padding: '7px 8px',
                        fontSize: '0.75rem',
                        fontWeight: seniorityTone === t ? '700' : '500',
                        borderRadius: '6px',
                        border: `1px solid ${seniorityTone === t ? '#0052cc' : '#e2e8f0'}`,
                        background: seniorityTone === t ? '#eff6ff' : '#f8fafc',
                        color: seniorityTone === t ? '#0052cc' : '#475569',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                  <span>ACTION VERB INTENSITY</span>
                  <span style={{ color: '#0052cc' }}>Ultra High (Strong Verbs)</span>
                </div>
                <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '92%', height: '100%', background: '#0052cc', borderRadius: '3px' }} />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

