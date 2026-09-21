import './index.css';

const root = document.getElementById('root');

const jobTitleSuggestions = [
  'Frontend Developer',
  'Senior Frontend Developer',
  'React Developer',
  'Full-Stack Developer',
  'Senior Full-Stack Engineer',
  'Backend Java Developer',
  'Java Spring Boot Developer',
  'Software Engineer',
  'Data Analyst',
  'Product Manager',
  'DevOps Engineer',
  'Cloud Solutions Architect',
  'UI/UX Designer'
];

const appState = {
  currentStep: 1,
  activeTab: 'Scanner',
  isAuthenticated: false,
  authMode: 'login',
  userName: 'Kothapalli Bhaskar',
  jobTitle: 'Senior Full-Stack Engineer',
  targetCompany: 'Stripe',
  jobDescription: '',
  resumeName: 'Alex_Morgan_Resume_2025.pdf',
  score: 78,
  skillMatch: 74,
  keywordDensity: 80,
  formatting: 100,
  sectionCoverage: 100,
  wordCount: 542,
  experience: '5.5 Yrs',
  status: 'Ready'
};

function renderStepper() {
  const steps = [
    { num: 1, label: 'Target' },
    { num: 2, label: 'Resume' },
    { num: 3, label: 'Diagnostics' },
    { num: 4, label: 'Optimize' }
  ];

  return `
    <div class="stepper" aria-label="Progress steps">
      ${steps.map((step, index) => {
        const isComplete = appState.currentStep > step.num;
        const isActive = appState.currentStep === step.num;
        const stepHtml = `
          <div class="step ${isComplete ? 'complete' : isActive ? 'active' : ''}">
            <span class="step-dot">${step.num}</span>
            <span>${step.label}</span>
          </div>
        `;

        if (index < steps.length - 1) {
          return `${stepHtml}<div class="step-line ${isComplete ? 'complete' : ''}"></div>`;
        }

        return stepHtml;
      }).join('')}
    </div>
  `;
}

function renderStepOne() {
  return `
    <section class="panel main-panel">
      ${renderStepper()}

      <div class="panel-header">
        <div>
          <p class="section-kicker">Configuration</p>
          <h1>Target job and resume setup</h1>
        </div>
        <span class="pill green">Ready</span>
      </div>

      <div class="field-grid">
        <label class="field">
          <span>Job title</span>
          <div class="job-title-field">
            <input type="text" value="${appState.jobTitle}" aria-label="Job title" id="job-title-input" autocomplete="off" />
            <div class="job-title-suggestions" id="job-title-suggestions" hidden></div>
          </div>
        </label>

        <label class="field">
          <span>Target company</span>
          <input type="text" value="${appState.targetCompany}" aria-label="Target company" id="company-input" />
        </label>
      </div>

      <label class="field textarea-field">
        <span>Job description</span>
        <textarea aria-label="Job description" id="job-desc-input" placeholder="Paste the job description and requirements here...">${appState.jobDescription}</textarea>
      </label>

      <div class="action-row">
        <button class="ghost-btn" type="button" id="save-draft-btn">Save draft</button>
        <button class="primary-btn" type="button" id="continue-to-upload-btn">Continue to Resume</button>
      </div>
    </section>
  `;
}

function renderStepTwo() {
  return `
    <section class="panel main-panel">
      ${renderStepper()}

      <div class="panel-header">
        <div>
          <p class="section-kicker">Resume Upload</p>
          <h1>Upload your resume</h1>
        </div>
        <span class="pill blue">Upload ready</span>
      </div>

      <div class="resume-upload-box">
        <div class="upload-meta">
          <div class="doc-badge">${appState.resumeName.split('.').pop().toUpperCase()}</div>
          <div>
            <strong>${appState.resumeName}</strong>
            <small>145 KB • Storage: S3</small>
          </div>
        </div>
        <button class="secondary-btn" type="button" id="change-resume-btn">Change resume</button>
        <input type="file" id="resume-file-input" hidden accept=".pdf,.doc,.docx" />
      </div>

      <div class="action-row">
        <button class="ghost-btn" type="button" id="back-to-step1-btn">Back</button>
        <button class="primary-btn" type="button" id="run-analysis-btn">Analyze Resume</button>
      </div>
    </section>
  `;
}

function renderStepThree() {
  return `
    <section class="panel main-panel">
      ${renderStepper()}

      <div class="panel-header">
        <div>
          <p class="section-kicker">Diagnostics</p>
          <h1>ATS analysis results</h1>
        </div>
        <span class="pill green">Scored</span>
      </div>

      <div class="score-panel-inner">
        <div class="score-ring-wrap">
          <div class="score-ring">
            <div class="score-ring-inner">
              <strong>${appState.score}</strong>
              <small>ATS score</small>
            </div>
          </div>
        </div>

        <div class="metric-grid">
          <div class="metric-box">
            <label>Skill Match</label>
            <strong>${appState.skillMatch}%</strong>
          </div>
          <div class="metric-box">
            <label>Keyword Density</label>
            <strong>${appState.keywordDensity}%</strong>
          </div>
          <div class="metric-box">
            <label>Format & Length</label>
            <strong>${appState.formatting}%</strong>
          </div>
          <div class="metric-box">
            <label>Section Coverage</label>
            <strong>${appState.sectionCoverage}%</strong>
          </div>
        </div>

        <div class="insight-row">
          <div>
            <span>Word count</span>
            <strong>${appState.wordCount}</strong>
          </div>
          <div>
            <span>Experience</span>
            <strong>${appState.experience}</strong>
          </div>
        </div>
      </div>

      <div class="analysis-grid">
        <article class="panel small-panel">
          <div class="small-header">
            <h2>Matched skills</h2>
            <span class="pill green">${appState.skillMatch}%</span>
          </div>
          <div class="tag-list">
            <span>React</span>
            <span>TypeScript</span>
            <span>Node.js</span>
            <span>REST APIs</span>
            <span>Git</span>
            <span>PostgreSQL</span>
            <span>Tailwind CSS</span>
          </div>
        </article>

        <article class="panel small-panel">
          <div class="small-header">
            <h2>Missing skills</h2>
            <span class="pill orange">5 gaps</span>
          </div>
          <div class="tag-list warning-list">
            <span>Docker</span>
            <span>AWS EC2</span>
            <span>GraphQL</span>
            <span>Redis</span>
            <span>CI/CD Pipeline</span>
          </div>
        </article>
      </div>

      <div class="action-row">
        <button class="ghost-btn" type="button" id="back-to-step2-btn">Back</button>
        <button class="primary-btn" type="button" id="go-to-optimization-btn">Next: Optimize Resume</button>
      </div>
    </section>
  `;
}

function renderStepFour() {
  return `
    <section class="panel main-panel">
      ${renderStepper()}

      <div class="panel-header">
        <div>
          <p class="section-kicker">Optimization</p>
          <h1>Suggested resume improvements</h1>
        </div>
        <span class="pill blue">Priority</span>
      </div>

      <div class="analysis-grid">
        <article class="panel wide-panel">
          <div class="small-header">
            <h2>Recommended edits</h2>
            <span class="pill blue">Action plan</span>
          </div>

          <ul class="recommendations">
            <li>Add missing key skills requested by the job description: Docker, AWS EC2, GraphQL, Redis, and CI/CD pipeline.</li>
            <li>Replace passive bullet points with measurable results using impact-first phrasing like “Improved latency by 34%”.</li>
            <li>Standardize section headings to match ATS parsing rules and improve keyword detection.</li>
            <li>Highlight cloud-native deployment experience and production-scale system ownership.</li>
          </ul>
        </article>
      </div>

      <div class="resume-upload-box">
        <div class="upload-meta">
          <div class="doc-badge">NEW</div>
          <div>
            <strong>Optimized_Resume_Draft.docx</strong>
            <small>Generated from ATS feedback</small>
          </div>
        </div>
        <button class="secondary-btn" type="button">Download draft</button>
      </div>

      <div class="action-row">
        <button class="ghost-btn" type="button" id="back-to-step3-btn">Back</button>
        <button class="primary-btn" type="button" id="start-over-btn">Start Over</button>
      </div>
    </section>
  `;
}

function renderAuthScreen() {
  root.innerHTML = `
    <div class="auth-screen">
      <div class="auth-card panel">
        <div class="auth-header">
          <div class="brand auth-brand">
            <span class="brand-mark">C</span>
            <div class="brand-copy">
              <strong>CVgreen</strong>
              <small>Resume Studio</small>
            </div>
          </div>
        </div>

        <div class="auth-toggle">
          <button class="auth-tab ${appState.authMode === 'login' ? 'active' : ''}" type="button" data-mode="login">Login</button>
          <button class="auth-tab ${appState.authMode === 'register' ? 'active' : ''}" type="button" data-mode="register">Register</button>
        </div>

        <form class="auth-form" id="auth-form">
          ${appState.authMode === 'register' ? `
            <label class="field auth-field">
              <span>Full name</span>
              <input type="text" value="Kothapalli Bhaskar" />
            </label>
          ` : ''}

          <label class="field auth-field">
            <span>Email</span>
            <input type="email" value="bhaskar.24mis7052@vitapstudent.ac.in" />
          </label>

          <label class="field auth-field">
            <span>Password</span>
            <input type="password" value="password123" />
          </label>

          <button class="primary-btn auth-btn" type="submit">
            ${appState.authMode === 'login' ? 'Login to Dashboard' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  `;

  document.querySelectorAll('.auth-tab').forEach((button) => {
    button.addEventListener('click', () => {
      appState.authMode = button.dataset.mode;
      renderAuthScreen();
    });
  });

  document.getElementById('auth-form').addEventListener('submit', (event) => {
    event.preventDefault();
    appState.isAuthenticated = true;
    appState.userName = 'Kothapalli Bhaskar';
    renderApp();
    showToast('Login successful. Welcome back!');
  });
}

function renderApp() {
  if (!appState.isAuthenticated) {
    renderAuthScreen();
    return;
  }

  const tabMeta = {
    Scanner: { title: 'Target job and resume setup', kicker: 'Configuration', status: 'Ready' },
    History: { title: 'Recent resume scans', kicker: 'History', status: 'Synced' },
    'Saved Resumes': { title: 'Saved resume analyses', kicker: 'Library', status: 'Saved' }
  };

  const meta = tabMeta[appState.activeTab];

  if (appState.activeTab !== 'Scanner') {
    root.innerHTML = `
      <div class="page-shell">
        <header class="topbar">
          <div class="brand">
            <span class="brand-mark">C</span>
            <div class="brand-copy">
              <strong>CVgreen</strong>
              <small>Resume Studio</small>
            </div>
          </div>

          <nav class="toolbar-nav" aria-label="Primary navigation">
            <button class="nav-tab ${appState.activeTab === 'Scanner' ? 'active' : ''}" type="button">Scanner</button>
            <button class="nav-tab ${appState.activeTab === 'History' ? 'active' : ''}" type="button">History</button>
            <button class="nav-tab ${appState.activeTab === 'Saved Resumes' ? 'active' : ''}" type="button">Saved Resumes</button>
          </nav>

          <div class="profile-pill" aria-label="User profile">
            <div class="avatar">KB</div>
            <div class="profile-copy">
              <strong>${appState.userName}</strong>
              <span>Profile</span>
            </div>
          </div>
        </header>

        <main class="workspace">
          <section class="panel main-panel">
            <div class="panel-header">
              <div>
                <p class="section-kicker">${meta.kicker}</p>
                <h1>${meta.title}</h1>
              </div>
              <span class="pill green">${meta.status}</span>
            </div>
            <div class="resume-upload-box">
              <div class="upload-meta">
                <div class="doc-badge">INFO</div>
                <div>
                  <strong>Prototype view only</strong>
                  <small>Switch back to Scanner to continue the workflow.</small>
                </div>
              </div>
              <button class="primary-btn" type="button" id="back-to-scanner-btn">Back to Scanner</button>
            </div>
          </section>
        </main>
      </div>
    `;

    document.getElementById('back-to-scanner-btn').addEventListener('click', () => {
      appState.activeTab = 'Scanner';
      renderApp();
    });

    document.querySelectorAll('.nav-tab').forEach((button) => {
      button.addEventListener('click', () => {
        appState.activeTab = button.textContent.trim();
        renderApp();
      });
    });
    return;
  }

  root.innerHTML = `
    <div class="page-shell">
      <header class="topbar">
        <div class="brand">
          <span class="brand-mark">C</span>
          <div class="brand-copy">
            <strong>CVgreen</strong>
            <small>Resume Studio</small>
          </div>
        </div>

        <nav class="toolbar-nav" aria-label="Primary navigation">
          <button class="nav-tab ${appState.activeTab === 'Scanner' ? 'active' : ''}" type="button">Scanner</button>
          <button class="nav-tab ${appState.activeTab === 'History' ? 'active' : ''}" type="button">History</button>
          <button class="nav-tab ${appState.activeTab === 'Saved Resumes' ? 'active' : ''}" type="button">Saved Resumes</button>
        </nav>

        <div class="profile-pill" aria-label="User profile">
          <div class="avatar">KB</div>
          <div class="profile-copy">
            <strong>${appState.userName}</strong>
            <span>Profile</span>
          </div>
        </div>
      </header>

      ${appState.currentStep === 1 ? renderStepOne() : ''}
      ${appState.currentStep === 2 ? renderStepTwo() : ''}
      ${appState.currentStep === 3 ? renderStepThree() : ''}
      ${appState.currentStep === 4 ? renderStepFour() : ''}
    </div>
  `;

  bindEvents();
}

function updateScoreFromInput() {
  const jobTitle = document.getElementById('job-title-input')?.value || appState.jobTitle;
  const jobDescription = document.getElementById('job-desc-input')?.value || appState.jobDescription;

  const combined = `${jobTitle} ${jobDescription}`.toLowerCase();
  const keywords = ['react', 'node', 'typescript', 'aws', 'docker', 'graphql', 'postgresql', 'ci', 'pipeline', 'rest', 'api', 'cloud', 'javascript'];
  const matches = keywords.filter((keyword) => combined.includes(keyword)).length;
  const score = Math.min(96, Math.max(65, 52 + matches * 4 + (combined.includes('cloud') ? 5 : 0)));

  appState.jobTitle = jobTitle;
  appState.jobDescription = jobDescription;
  appState.score = Math.round(score);
  appState.skillMatch = Math.min(96, Math.max(70, Math.round(score - 4)));
  appState.keywordDensity = Math.min(98, Math.max(72, Math.round(score + 3)));
  appState.formatting = 100;
  appState.sectionCoverage = 100;
  appState.wordCount = 540 + (Math.round(score) % 20);
  appState.experience = score > 80 ? '5.5 Yrs' : '4.2 Yrs';
}

function getJobTitleSuggestions(query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  const words = normalizedQuery.split(/\s+/).filter(Boolean);
  return jobTitleSuggestions
    .filter((suggestion) => {
      const normalizedSuggestion = suggestion.toLowerCase();
      return words.every((word) => normalizedSuggestion.includes(word));
    })
    .slice(0, 6);
}

function renderJobTitleSuggestions(query) {
  const suggestionsElement = document.getElementById('job-title-suggestions');
  if (!suggestionsElement) return;

  const suggestions = getJobTitleSuggestions(query);
  suggestionsElement.innerHTML = suggestions.map((suggestion) => `
    <button type="button" class="job-title-suggestion" data-job-title="${suggestion}">
      <span>${suggestion}</span>
      <small>Use suggestion</small>
    </button>
  `).join('');
  suggestionsElement.hidden = suggestions.length === 0;

  suggestionsElement.querySelectorAll('.job-title-suggestion').forEach((button) => {
    button.addEventListener('click', () => {
      const jobTitleInput = document.getElementById('job-title-input');
      const selectedTitle = button.dataset.jobTitle;
      jobTitleInput.value = selectedTitle;
      appState.jobTitle = selectedTitle;
      suggestionsElement.hidden = true;
      jobTitleInput.focus();
    });
  });
}

function bindEvents() {
  document.querySelectorAll('.nav-tab').forEach((button) => {
    button.addEventListener('click', () => {
      appState.activeTab = button.textContent.trim();
      renderApp();
    });
  });

  const continueBtn = document.getElementById('continue-to-upload-btn');
  const jobTitleInput = document.getElementById('job-title-input');
  if (jobTitleInput) {
    jobTitleInput.addEventListener('input', () => {
      appState.jobTitle = jobTitleInput.value;
      renderJobTitleSuggestions(jobTitleInput.value);
    });

    jobTitleInput.addEventListener('focus', () => {
      renderJobTitleSuggestions(jobTitleInput.value);
    });
  }

  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      updateScoreFromInput();
      appState.currentStep = 2;
      renderApp();
      showToast('Job details saved. Upload your resume next.');
    });
  }

  const backToStep1 = document.getElementById('back-to-step1-btn');
  if (backToStep1) {
    backToStep1.addEventListener('click', () => {
      appState.currentStep = 1;
      renderApp();
    });
  }

  const changeResumeBtn = document.getElementById('change-resume-btn');
  const fileInput = document.getElementById('resume-file-input');
  if (changeResumeBtn && fileInput) {
    changeResumeBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      appState.resumeName = file.name;
      renderApp();
      showToast(`Resume selected: ${file.name}`);
    });
  }

  const runAnalysisBtn = document.getElementById('run-analysis-btn');
  if (runAnalysisBtn) {
    runAnalysisBtn.addEventListener('click', () => {
      updateScoreFromInput();
      appState.currentStep = 3;
      appState.status = 'Scored';
      renderApp();
      showToast(`ATS analysis complete: ${appState.score}/100`);
    });
  }

  const goBackToStep2 = document.getElementById('back-to-step2-btn');
  if (goBackToStep2) {
    goBackToStep2.addEventListener('click', () => {
      appState.currentStep = 2;
      renderApp();
    });
  }

  const goToOptimizationBtn = document.getElementById('go-to-optimization-btn');
  if (goToOptimizationBtn) {
    goToOptimizationBtn.addEventListener('click', () => {
      appState.currentStep = 4;
      renderApp();
    });
  }

  const backToStep3 = document.getElementById('back-to-step3-btn');
  if (backToStep3) {
    backToStep3.addEventListener('click', () => {
      appState.currentStep = 3;
      renderApp();
    });
  }

  const startOverBtn = document.getElementById('start-over-btn');
  if (startOverBtn) {
    startOverBtn.addEventListener('click', () => {
      appState.currentStep = 1;
      appState.status = 'Ready';
      renderApp();
    });
  }

  const saveDraftBtn = document.getElementById('save-draft-btn');
  if (saveDraftBtn) {
    saveDraftBtn.addEventListener('click', () => {
      appState.status = 'Saved';
      showToast('Draft saved successfully.');
    });
  }
}

function showToast(message) {
  const existingToast = document.querySelector('.toast');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('visible'));

  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 250);
  }, 2200);
}

renderApp();
