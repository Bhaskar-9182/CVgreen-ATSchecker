import React, { useState } from 'react';
import { 
  X, Mail, Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, 
  Activity, ArrowRight, Check, AlertCircle, User 
} from 'lucide-react';
import { authApi } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, onSignOut, initialUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState(initialUser?.fullName || initialUser?.username || '');
  const [email, setEmail] = useState(initialUser?.email || '');
  const [username, setUsername] = useState(initialUser?.username || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const enteredName = fullName.trim() || username;

    try {
      if (isLogin) {
        const data = await authApi.login(username, password);
        const userObj = { ...data, fullName: data.fullName || data.username };
        localStorage.setItem('user', JSON.stringify(userObj));
        onAuthSuccess(userObj);
        setPassword('');
        onClose();
      } else {
        await authApi.register(username, email, password);
        const data = await authApi.login(username, password);
        const userObj = { ...data, fullName: enteredName };
        localStorage.setItem('user', JSON.stringify(userObj));
        onAuthSuccess(userObj);
        setPassword('');
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Authentication failed. Check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div className="auth-panel" style={{
        background: '#ffffff',
        borderRadius: '20px',
        maxWidth: '520px',
        width: '100%',
        padding: '36px 32px 28px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        position: 'relative',
        border: '1px solid #e2e8f0'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#f1f5f9',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b'
          }}
        >
          <X size={18} />
        </button>

        {/* Top Header Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: '700',
            color: '#065f46',
            background: '#ecfdf5',
            padding: '3px 10px',
            borderRadius: '9999px',
            border: '1px solid #a7f3d0',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
            PRECISION ATS ENGINE • RULE-BASED NLP
          </span>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>
            v2.4.1 Production Core
          </span>
        </div>

        {/* Title */}
        <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '6px' }}>
          {initialUser ? 'Your account' : 'Sign in to CVScan AI'}
        </h2>
        <p style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '22px', lineHeight: '1.4' }}>
          {initialUser
            ? `Signed in as ${initialUser.fullName || initialUser.username}.`
            : 'Deterministic parsing, keyword density calibration, and instant ATS scoring for tech applicants.'}
        </p>

        {initialUser ? (
          <button
            type="button"
            onClick={onSignOut}
            className="btn-cv-secondary"
            style={{ width: '100%', padding: '12px', fontSize: '0.925rem' }}
          >
            Sign out
          </button>
        ) : (
          <div>
        {/* Switch Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: '#f1f5f9',
          padding: '4px',
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            style={{
              padding: '8px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: isLogin ? '700' : '600',
              background: isLogin ? '#ffffff' : 'transparent',
              color: isLogin ? '#0f172a' : '#64748b',
              boxShadow: isLogin ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <ShieldCheck size={16} color={isLogin ? '#0052cc' : '#64748b'} /> Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            style={{
              padding: '8px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: !isLogin ? '700' : '600',
              background: !isLogin ? '#ffffff' : 'transparent',
              color: !isLogin ? '#0f172a' : '#64748b',
              boxShadow: !isLogin ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            + Create Free Account
          </button>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          margin: '0 0 16px',
          fontSize: '0.75rem',
          color: '#94a3b8'
        }}>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          <span>{isLogin ? 'Use your account username' : 'Create an account with your email'}</span>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
        </div>

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '0.825rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Full Name */}
          {!isLogin && <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: '#64748b' }} />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''));
                }}
                placeholder="Your full name"
                style={{
                  width: '100%',
                  padding: '9px 36px 9px 34px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.875rem',
                  color: '#0f172a',
                  background: '#ffffff'
                }}
              />
              <CheckCircle2 size={16} color="#10b981" style={{ position: 'absolute', right: '12px', top: '11px' }} />
            </div>
          </div>}

          {/* Username or email */}
          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
              {isLogin ? 'Username' : 'Work Email'}
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '10px', color: '#64748b', fontSize: '0.9rem' }}>
                {isLogin ? <User size={15} /> : '@'}
              </span>
              <input
                type={isLogin ? 'text' : 'email'}
                required
                value={isLogin ? username : email}
                onChange={(e) => isLogin ? setUsername(e.target.value) : setEmail(e.target.value)}
                placeholder={isLogin ? 'Your account username' : 'you@example.com'}
                style={{
                  width: '100%',
                  padding: '9px 36px 9px 34px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.875rem',
                  color: '#0f172a',
                  background: '#ffffff'
                }}
              />
              <CheckCircle2 size={16} color="#10b981" style={{ position: 'absolute', right: '12px', top: '11px' }} />
            </div>
          </div>

          {/* Password */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.775rem', fontWeight: '700', color: '#334155' }}>
                Password
              </label>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  width: '100%',
                  padding: '9px 36px 9px 34px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.875rem',
                  color: '#0f172a',
                  background: '#ffffff'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '10px', background: 'none', color: '#64748b' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-cv-primary"
            style={{ width: '100%', padding: '12px', fontSize: '0.925rem', marginTop: '6px' }}
          >
            {loading ? 'Validating...' : (isLogin ? 'Sign In to Dashboard →' : 'Create Account & Continue →')}
          </button>
        </form>

        {/* NLP Engine Status Card (Matching Screenshot 2) */}
        <div style={{
          marginTop: '22px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: '700', color: '#1e293b' }}>
              <Activity size={16} color="#0052cc" /> Rule-Based NLP Engine Status
            </div>
            <span style={{
              fontSize: '0.675rem',
              fontWeight: '700',
              color: '#065f46',
              background: '#ecfdf5',
              padding: '2px 8px',
              borderRadius: '9999px',
              border: '1px solid #a7f3d0'
            }}>
              Active Parser
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              border: '3px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '0.875rem',
              color: '#065f46',
              background: '#ecfdf5',
              flexShrink: 0
            }}>
              94%
            </div>
            <div>
              <div style={{ fontSize: '0.825rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Benchmark Calibration <Check size={14} color="#10b981" />
              </div>
              <div style={{ fontSize: '0.725rem', color: '#64748b' }}>
                Deterministic evaluation matching tier-1 ATS formats.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.725rem', color: '#475569', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
            <span>✓ Regex contact pa...</span>
            <span>✓ 4.5k+ skill taxono...</span>
            <span>✓ Zero hallucination</span>
          </div>
        </div>

        {/* Compliance Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '18px',
          fontSize: '0.7rem',
          color: '#64748b'
        }}>
          <span>🛡 Zero document retention</span>
          <span>🛡 SOC 2 Type II</span>
          <span>🛡 GDPR / CCPA Compliant</span>
        </div>
          </div>
        )}

      </div>
    </div>
  );
}
