import React from 'react';
import { 
  Activity, CheckCircle2, User, Mail, Phone, Wrench, 
  Briefcase, GraduationCap, ArrowRight, Sparkles 
} from 'lucide-react';

export default function Step3Diagnostics({ result, onNext }) {
  if (!result) {
    return (
      <div style={{ maxWidth: '1080px', margin: '40px auto', textAlign: 'center' }}>
        <p>No analysis result available. Please run analysis from Step 1 & 2.</p>
      </div>
    );
  }

  const score = result.overallScore ?? 0;
  const matchedSkills = result.matchedSkills || [];
  const missingSkills = result.missingSkills || [];

  const candidateName = result.contactInfo?.candidateName && result.contactInfo.candidateName !== 'Candidate'
    ? result.contactInfo.candidateName
    : 'Not detected';
  const email = result.contactInfo?.email || 'Not detected';
  const phone = result.contactInfo?.phone || 'Not detected';

  const careerProgression = result.careerProgression || [];

  const totalExp = result.totalExperienceYears || 0;
  const credentials = result.credentials || [];
  const detectedContactCount = [candidateName, email, phone]
    .filter((value) => value !== 'Not detected').length;

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '16px 0 60px' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={22} color="#0052cc" /> Algorithmic Resume Diagnostics
        </h2>

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
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
          Analysis complete
        </span>
      </div>

      {/* Main Score Hero Card */}
      <div className="cv-card" style={{ padding: '28px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }}>
          {/* Circular Score Ring */}
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            border: '6px solid #0052cc',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            background: '#eff6ff'
          }}>
            <span style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>
              {score}%
            </span>
            <span style={{ fontSize: '0.675rem', fontWeight: '700', color: '#0052cc', letterSpacing: '0.04em', marginTop: '2px' }}>
              ATS SCORE
            </span>
          </div>

          {/* Feedback & Progress Bar */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.775rem',
              fontWeight: '700',
              color: '#065f46',
              background: '#ecfdf5',
              padding: '3px 10px',
              borderRadius: '9999px',
              border: '1px solid #a7f3d0',
              marginBottom: '10px'
            }}>
              {missingSkills.length
                ? `${matchedSkills.length} matched skills — ${missingSkills.length} gaps`
                : `${matchedSkills.length} matched skills`}
            </span>

            <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.5, marginBottom: '14px' }}>
              {missingSkills.length
                ? <>Your resume matches {matchedSkills.length} target skills. {missingSkills.length} job-description skills were not found in the document.</>
                : 'No unmatched job-description skills were reported for this document.'}
            </p>

            <div>
              <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '6px' }}>
                <div style={{ width: `${score}%`, height: '100%', background: '#0052cc', borderRadius: '4px' }} />
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.75rem', fontWeight: '700', color: '#64748b' }}>
                {score} / 100
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Entity Extraction Card */}
      <div className="cv-card" style={{ padding: '22px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>
            <User size={18} color="#0052cc" /> Entity Extraction
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#065f46', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={14} color="#10b981" /> {detectedContactCount} contact fields detected
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          {/* Full Name */}
          <div style={{
            padding: '12px 16px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: '#eff6ff', padding: '6px', borderRadius: '6px', color: '#0052cc' }}>
                <User size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>Full Name</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0f172a' }}>{candidateName}</div>
              </div>
            </div>
            {candidateName !== 'Not detected' && <CheckCircle2 size={16} color="#10b981" />}
          </div>

          {/* Email */}
          <div style={{
            padding: '12px 16px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: '#eff6ff', padding: '6px', borderRadius: '6px', color: '#0052cc' }}>
                <Mail size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>Email Identifier</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0f172a' }}>{email}</div>
              </div>
            </div>
            {email !== 'Not detected' && <CheckCircle2 size={16} color="#10b981" />}
          </div>

          {/* Direct Contact */}
          <div style={{
            padding: '12px 16px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: '#eff6ff', padding: '6px', borderRadius: '6px', color: '#0052cc' }}>
                <Phone size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>Direct Contact</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0f172a' }}>{phone}</div>
              </div>
            </div>
            {phone !== 'Not detected' && <CheckCircle2 size={16} color="#10b981" />}
          </div>
        </div>
      </div>

      {/* Skills Semantic Detection Card */}
      <div className="cv-card" style={{ padding: '22px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>
            <Wrench size={18} color="#0052cc" /> Skills Semantic Detection
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b' }}>
            {matchedSkills.length} of {matchedSkills.length + missingSkills.length} Matched
          </span>
        </div>

        {/* Matched Skills */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#047857', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <CheckCircle2 size={14} color="#10b981" /> Matched Skills ({matchedSkills.length})
            </div>
            <span style={{ fontSize: '0.725rem', color: '#64748b' }}>Compared with the target job description</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {matchedSkills.map((s, idx) => (
              <span key={idx} className="pill pill-green">
                ✓ {s}
              </span>
            ))}
          </div>
        </div>

        {/* Missing High-Impact Skills */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#b45309', display: 'flex', alignItems: 'center', gap: '5px' }}>
              ⚠ Missing High-Impact Skills ({missingSkills.length})
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {missingSkills.map((s, idx) => (
              <span key={idx} className="pill pill-orange">
                + {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Experience & Academic Extraction Card */}
      <div className="cv-card" style={{ padding: '22px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', marginBottom: '14px' }}>
          <Briefcase size={18} color="#0052cc" /> Experience & Academic Extraction
        </div>

        <div style={{ fontSize: '0.725rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
          CAREER DETAILS {totalExp > 0 ? `(${totalExp} YRS TOTAL)` : ''}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
          {careerProgression.map((exp, i) => (
            <div key={i} style={{
              padding: '12px 16px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#eff6ff', padding: '6px', borderRadius: '6px', color: '#0052cc' }}>
                  <Briefcase size={15} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>{exp.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{exp.description}</div>
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569' }}>
                {exp.duration}
              </span>
            </div>
          ))}
          {careerProgression.length === 0 && (
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>No career timeline details were extracted for this report.</p>
          )}
        </div>

        <div style={{ fontSize: '0.725rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
          ACADEMIC DEGREE VERIFICATION
        </div>
        <div style={{
          padding: '12px 16px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#eff6ff', padding: '6px', borderRadius: '6px', color: '#0052cc' }}>
              <GraduationCap size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>
                {credentials.length ? credentials.join(', ') : 'No credentials extracted'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Credentials reported from the uploaded resume</div>
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: credentials.length ? '#047857' : '#64748b' }}>
            {credentials.length ? 'Detected' : 'Not detected'}
          </span>
        </div>
      </div>

      {/* CTA Button */}
      <div style={{ textAlign: 'center' }}>
        <button
          type="button"
          onClick={onNext}
          className="btn-cv-primary"
          style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
        >
          Proceed to Step 4: Optimize & Export <ArrowRight size={18} />
        </button>
      </div>

    </div>
  );
}
