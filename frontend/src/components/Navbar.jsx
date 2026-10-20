import React from 'react';
import { FileText, Check, ShieldCheck, User } from 'lucide-react';

export default function Navbar({ currentStep, onStepClick, user, onOpenAuth, activeTab, onTabChange }) {
  const steps = [
    { id: 1, label: 'Target' },
    { id: 2, label: 'Resume' },
    { id: 3, label: 'NLP' },
    { id: 4, label: 'Optimize' }
  ];

  return (
    <div className="app-navbar" style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Top Header Row */}
      <header style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => onStepClick(1)}>
          <div style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            padding: '7px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0052cc'
          }}>
            <FileText size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.125rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              CVScan AI
            </div>
            <div style={{ fontSize: '0.675rem', fontWeight: '700', color: '#0052cc', letterSpacing: '0.06em' }}>
              NLP ATS ENGINE
            </div>
          </div>
        </div>

        {/* Stepper (Steps 1 to 4) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flex: 1,
          maxWidth: '560px',
          margin: '0 24px'
        }}>
          {steps.map((s, index) => {
            const isCompleted = currentStep > s.id;
            const isActive = currentStep === s.id;

            return (
              <React.Fragment key={s.id}>
                <div 
                  onClick={() => onStepClick(s.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    color: isActive ? '#0052cc' : (isCompleted ? '#10b981' : '#94a3b8'),
                    fontWeight: isActive ? '700' : '600',
                    fontSize: '0.825rem'
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    background: isActive ? '#0052cc' : (isCompleted ? '#10b981' : '#f1f5f9'),
                    color: (isActive || isCompleted) ? '#ffffff' : '#64748b'
                  }}>
                    {isCompleted ? <Check size={14} strokeWidth={3} /> : s.id}
                  </div>
                  <span>{s.label}</span>
                </div>

                {index < steps.length - 1 && (
                  <div style={{
                    flex: 1,
                    height: '2px',
                    background: isCompleted ? '#10b981' : '#e2e8f0',
                    minWidth: '24px'
                  }} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* User Account / Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={onOpenAuth}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a', lineHeight: 1.2 }}>
                  {user.fullName || user.username || 'Account'}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  Enterprise Tier
                </div>
              </div>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0052cc',
                position: 'relative'
              }}>
                <User size={18} />
                <span style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: '#10b981',
                  border: '2px solid #ffffff'
                }} />
              </div>
            </div>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="btn-cv-secondary"
              style={{ padding: '7px 16px', fontSize: '0.825rem' }}
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Secondary Navigation Row (Tabs & Engine Badge) */}
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid #f1f5f9'
      }}>
        <div className="app-tabs" style={{ display: 'flex', gap: '8px' }}>
          {['Scanner', 'History', 'Saved Resumes'].map((tab) => {
            const isTabActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`app-tab ${isTabActive ? 'active' : ''}`}
                style={{
                  padding: '10px 16px',
                  fontSize: '0.825rem',
                  fontWeight: isTabActive ? '700' : '500',
                  color: isTabActive ? '#0052cc' : '#64748b',
                  background: 'none',
                  borderBottom: `2px solid ${isTabActive ? '#0052cc' : 'transparent'}`,
                  borderRadius: '0'
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '0.725rem',
            fontWeight: '600',
            color: '#065f46',
            background: '#ecfdf5',
            padding: '3px 10px',
            borderRadius: '9999px',
            border: '1px solid #a7f3d0',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
            NLP Rule Core v4.2 - Active
          </span>
        </div>
      </div>
    </div>
  );
}
