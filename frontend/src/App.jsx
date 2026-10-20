import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Step1Target from './components/Step1Target';
import Step2Resume from './components/Step2Resume';
import Step3Diagnostics from './components/Step3Diagnostics';
import Step4Optimize from './components/Step4Optimize';
import BottomNav from './components/BottomNav';
import ResumeHistory from './components/ResumeHistory';
import { authApi, resumeApi, systemApi } from './services/api';

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState('Scanner');
  const [activeBottomNav, setActiveBottomNav] = useState('Scanner');
  const [user, setUser] = useState(authApi.getCurrentUser());
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Form State
  const [jobTitle, setJobTitle] = useState('Senior Full-Stack Engineer');
  const [targetCompany, setTargetCompany] = useState('Stripe');
  const [jobDescription, setJobDescription] = useState('');

  // Resume State
  const [currentResume, setCurrentResume] = useState(null);

  // Diagnostics & Result State
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [libraryResumes, setLibraryResumes] = useState([]);
  const [libraryReports, setLibraryReports] = useState({});
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [libraryError, setLibraryError] = useState(null);
  const [libraryRefresh, setLibraryRefresh] = useState(0);

  useEffect(() => {
    systemApi.getHealth().catch(() => {});
    if (!localStorage.getItem('token')) {
      setUser(null);
      return;
    }

    authApi.getMe()
      .then((profile) => {
        if (!profile.authenticated) {
          authApi.logout();
          setUser(null);
          return;
        }

        setUser((savedUser) => ({
          ...profile,
          fullName: savedUser?.fullName || profile.fullName || profile.username
        }));
      })
      .catch(() => {
        authApi.logout();
        setUser(null);
      });
  }, []);

  useEffect(() => {
    if (activeTab !== 'History' && activeTab !== 'Saved Resumes') return undefined;

    let cancelled = false;
    const loadLibrary = async () => {
      setLibraryLoading(true);
      setLibraryError(null);
      try {
        const resumes = await resumeApi.getResumes();
        const reports = {};
        if (activeTab === 'History') {
          const reportResults = await Promise.all(
            resumes.map(async (resume) => {
              try {
                return [resume.id, await resumeApi.getLatestReport(resume.id)];
              } catch (error) {
                if (error.response?.status === 404) return [resume.id, null];
                throw error;
              }
            })
          );
          reportResults.forEach(([resumeId, report]) => {
            if (report) reports[resumeId] = report;
          });
        }

        if (!cancelled) {
          setLibraryResumes(resumes);
          setLibraryReports(reports);
        }
      } catch (error) {
        if (!cancelled) {
          setLibraryError(error.response?.status === 401
            ? 'Sign in to view resumes and analysis reports saved to your account.'
            : error.response?.data?.error || 'Please check your connection and try again.');
        }
      } finally {
        if (!cancelled) setLibraryLoading(false);
      }
    };

    loadLibrary();
    return () => { cancelled = true; };
  }, [activeTab, libraryRefresh]);

  const handleStepClick = (stepNum) => {
    setCurrentStep(stepNum);
    setActiveTab('Scanner');
    setActiveBottomNav('Scanner');
  };

  const handleResumeUploaded = (res) => {
    if (!res) {
      setCurrentResume(null);
      setAnalysisResult(null);
      setAnalysisError(null);
      return;
    }

    const resumeObj = {
      id: res.resumeId,
      fileName: res.fileName,
      fileSize: res.fileSize,
      fileFormat: res.fileFormat,
      storageType: res.storageType,
      uploadedAt: res.uploadedAt,
      previewSnippet: res.previewSnippet,
      contactInfo: res.contactInfo,
      extractedSkills: res.extractedSkills,
      sections: res.sections
    };
    setCurrentResume(resumeObj);
    setAnalysisResult(null);
    setAnalysisError(null);
  };

  const handleRunAnalysis = async () => {
    if (!currentResume?.id) {
      setAnalysisError('Upload a resume successfully before running diagnostics.');
      return;
    }

    setAnalyzing(true);
    setAnalysisError(null);
    try {
      const result = await resumeApi.analyzeResume(currentResume.id, jobTitle, jobDescription);
      setAnalysisResult(result);
      setCurrentStep(3);
    } catch (err) {
      setAnalysisError(err.response?.data?.error || 'Analysis failed. Please check the backend and try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setAnalysisResult(null);
  };

  const handleBottomNavChange = (navId) => {
    setActiveBottomNav(navId);
    if (navId === 'Profile') {
      setIsAuthOpen(true);
    } else if (navId === 'Scanner') {
      setActiveTab('Scanner');
    } else if (navId === 'History') {
      setActiveTab('History');
    } else if (navId === 'Saved') {
      setActiveTab('Saved Resumes');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveBottomNav(tab === 'Saved Resumes' ? 'Saved' : tab);
  };

  const handleSignOut = () => {
    authApi.logout();
    setUser(null);
    setCurrentResume(null);
    setAnalysisResult(null);
    setAnalysisError(null);
    setLibraryResumes([]);
    setLibraryReports({});
    setActiveTab('Scanner');
    setActiveBottomNav('Scanner');
    setCurrentStep(1);
    setIsAuthOpen(false);
  };

  const handleSelectSavedResume = (resume) => {
    setCurrentResume({
      id: resume.id,
      fileName: resume.fileName,
      fileSize: resume.fileSize,
      fileFormat: resume.fileFormat,
      storageType: resume.storageType,
      uploadedAt: resume.uploadedAt
    });
    setAnalysisResult(null);
    setAnalysisError(null);
    setCurrentStep(2);
    handleTabChange('Scanner');
  };

  const handleSelectReport = (report) => {
    setAnalysisResult(report);
    setCurrentStep(3);
    handleTabChange('Scanner');
  };

  return (
    <div
      className="app-shell"
      onPointerMove={(event) => {
        event.currentTarget.style.setProperty('--pointer-x', `${event.clientX}px`);
        event.currentTarget.style.setProperty('--pointer-y', `${event.clientY}px`);
      }}
    >
      
      {/* Top Header & Navigation */}
      <Navbar
        currentStep={currentStep}
        onStepClick={handleStepClick}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Main View Container */}
      <main style={{ flex: 1, padding: '24px 24px 80px', maxWidth: '1360px', width: '100%', margin: '0 auto' }}>
        
        {activeTab === 'History' || activeTab === 'Saved Resumes' ? (
          <ResumeHistory
            mode={activeTab}
            resumes={libraryResumes}
            reports={libraryReports}
            loading={libraryLoading}
            error={libraryError}
            onSelectResume={handleSelectSavedResume}
            onSelectReport={handleSelectReport}
            onGoToScanner={() => handleTabChange('Scanner')}
            onSignIn={() => setIsAuthOpen(true)}
          />
        ) : (
          <>
        {/* Step 1: Target Job */}
        {currentStep === 1 && (
          <Step1Target
            jobTitle={jobTitle}
            setJobTitle={setJobTitle}
            targetCompany={targetCompany}
            setTargetCompany={setTargetCompany}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {/* Step 2: Resume Upload */}
        {currentStep === 2 && (
          <Step2Resume
            currentResume={currentResume}
            onResumeUploaded={handleResumeUploaded}
            onNext={handleRunAnalysis}
            analysisError={analysisError}
            analyzing={analyzing}
          />
        )}

        {/* Step 3: Algorithmic Resume Diagnostics (NLP Analysis) */}
        {currentStep === 3 && (
          <Step3Diagnostics
            result={analysisResult}
            onNext={() => setCurrentStep(4)}
          />
        )}

        {/* Step 4: Optimize & Export */}
        {currentStep === 4 && (
          <Step4Optimize
            result={analysisResult}
            onRestart={handleRestart}
          />
        )}
          </>
        )}

      </main>

      {/* Bottom Floating Nav Bar (Matches Screenshots 1, 3, 4) */}
      <BottomNav
        activeNav={activeBottomNav}
        onNavChange={handleBottomNavChange}
      />

      {/* Auth Modal (Matches Screenshot 2) */}
      <AuthModal
        isOpen={isAuthOpen}
        initialUser={user}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(u) => {
          setUser(u);
          if (activeTab === 'History' || activeTab === 'Saved Resumes') {
            setLibraryRefresh((refresh) => refresh + 1);
          }
          if (analysisResult) {
            setAnalysisResult(prev => prev ? {
              ...prev,
              contactInfo: {
                ...prev.contactInfo,
                candidateName: u.fullName || u.username || prev.contactInfo?.candidateName
              }
            } : null);
          }
        }}
        onSignOut={handleSignOut}
      />

    </div>
  );
}
