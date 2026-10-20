import React from 'react';
import { Bookmark, Calendar, FileText, History, Loader2, Search, AlertTriangle, ArrowRight } from 'lucide-react';

function formatDate(value) {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleString();
}

export default function ResumeHistory({
  mode,
  resumes,
  reports,
  loading,
  error,
  onSelectResume,
  onSelectReport,
  onGoToScanner,
  onSignIn
}) {
  const isHistory = mode === 'History';
  const Icon = isHistory ? History : Bookmark;

  return (
    <section className="library-page">
      <header className="library-heading">
        <div className="library-icon"><Icon size={22} /></div>
        <div>
          <p className="library-eyebrow">{isHistory ? 'YOUR ACTIVITY' : 'YOUR LIBRARY'}</p>
          <h1>{isHistory ? 'Analysis history' : 'Saved resumes'}</h1>
          <p>{isHistory ? 'Review past resume analyses and open a report.' : 'Resume files you have uploaded are listed here.'}</p>
        </div>
      </header>

      {loading && (
        <div className="library-state" role="status">
          <Loader2 className="animate-spin" size={20} /> Loading your {isHistory ? 'history' : 'saved resumes'}…
        </div>
      )}

      {!loading && error && (
        <div className="library-state library-error" role="alert">
          <AlertTriangle size={20} />
          <div>
            <strong>Could not load your library</strong>
            <p>{error}</p>
            {error.startsWith('Sign in') && (
              <button className="btn-cv-primary" type="button" onClick={onSignIn}>Sign in</button>
            )}
          </div>
        </div>
      )}

      {!loading && !error && resumes.length === 0 && (
        <div className="library-state library-empty">
          <Search size={24} />
          <h2>{isHistory ? 'No resume history yet' : 'No saved resumes yet'}</h2>
          <p>Upload a resume and run an analysis to see it here.</p>
          <button className="btn-cv-primary" type="button" onClick={onGoToScanner}>
            Go to scanner <ArrowRight size={16} />
          </button>
        </div>
      )}

      {!loading && !error && resumes.length > 0 && (
        <div className="library-grid">
          {resumes.map((resume) => {
            const report = reports[resume.id];
            return (
              <article className="library-card" key={resume.id}>
                <div className="library-card-top">
                  <div className="library-file-icon"><FileText size={20} /></div>
                  <div className="library-file-name">
                    <h2 title={resume.fileName}>{resume.fileName}</h2>
                    <span>{resume.fileFormat?.toUpperCase()} · {resume.storageType || 'Stored'}</span>
                  </div>
                  {report && <span className="library-score">{report.overallScore}/100</span>}
                </div>
                <div className="library-card-date">
                  <Calendar size={14} /> Uploaded {formatDate(resume.uploadedAt)}
                </div>
                {isHistory ? (
                  report ? (
                    <div className="library-report">
                      <div>
                        <strong>{report.jobTitle || 'Resume analysis'}</strong>
                        <span>Analyzed {formatDate(report.analyzedAt)}</span>
                      </div>
                      <button type="button" className="btn-cv-secondary" onClick={() => onSelectReport(report)}>
                        Open report <ArrowRight size={15} />
                      </button>
                    </div>
                  ) : (
                    <div className="library-report-empty">No analysis report yet.</div>
                  )
                ) : (
                  <button type="button" className="btn-cv-secondary library-open" onClick={() => onSelectResume(resume)}>
                    Open resume <ArrowRight size={15} />
                  </button>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
