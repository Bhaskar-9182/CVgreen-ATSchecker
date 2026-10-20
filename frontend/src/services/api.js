import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Automatically inject JWT bearer token into headers if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authApi = {
  login: async (username, password) => {
    const response = await API.post('/auth/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
  register: async (username, email, password) => {
    const response = await API.post('/auth/register', { username, email, password });
    return response.data;
  },
  getMe: async () => {
    const response = await API.get('/auth/me');
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
};

export const resumeApi = {
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await API.post('/resumes/upload', formData);
    return response.data;
  },
  analyzeResume: async (resumeId, jobTitle, jobDescription, targetSkills = []) => {
    const response = await API.post(`/resumes/${resumeId}/analyze`, {
      jobTitle,
      jobDescription,
      targetSkills,
    });
    return response.data;
  },
  getResumes: async () => {
    const response = await API.get('/resumes');
    return response.data;
  },
  getLatestReport: async (resumeId) => {
    const response = await API.get(`/resumes/${resumeId}/latest-report`);
    return response.data;
  },
  getReportById: async (reportId) => {
    const response = await API.get(`/resumes/reports/${reportId}`);
    return response.data;
  },
  downloadResume: async (resumeId, filename = 'resume.pdf') => {
    const response = await API.get(`/resumes/${resumeId}/download`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  },
};

export const systemApi = {
  getHealth: async () => {
    const response = await API.get('/health');
    return response.data;
  }
};

export default API;
