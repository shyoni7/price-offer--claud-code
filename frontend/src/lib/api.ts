import axios from 'axios';
import type { Document, DocumentFormData, User, Template, Sender } from '@/types';

const fallbackBaseUrl = import.meta.env.DEV
  ? '/api'
  : 'https://ortam-docs-backend-production.up.railway.app/api';

const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL || fallbackBaseUrl).trim();
const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (email: string, password: string, name: string, role?: string) => {
    const response = await api.post('/auth/register', { email, password, name, role });
    return response.data;
  },

  getCurrentUser: async (): Promise<{ status: string; data: { user: User } }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Documents API
export const documentsApi = {
  getAll: async (): Promise<{ status: string; data: { documents: Document[] } }> => {
    const response = await api.get('/docs');
    return response.data;
  },

  getById: async (id: string): Promise<{ status: string; data: { document: Document } }> => {
    const response = await api.get(`/docs/${id}`);
    return response.data;
  },

  create: async (data: DocumentFormData): Promise<{ status: string; data: { document: Document } }> => {
    const response = await api.post('/docs', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Document>): Promise<{ status: string; data: { document: Document } }> => {
    const response = await api.put(`/docs/${id}`, data);
    return response.data;
  },

  generate: async (id: string): Promise<{ status: string; data: { document: Document; generatedContent: string } }> => {
    const response = await api.post(`/docs/${id}/generate`);
    return response.data;
  },

  exportPDF: async (id: string): Promise<Blob> => {
    const response = await api.post(`/docs/${id}/export/pdf`, null, {
      responseType: 'blob',
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/docs/${id}`);
  },
};

// Templates API
export const templatesApi = {
  getAll: async (): Promise<{ status: string; data: { templates: Template[] } }> => {
    const response = await api.get('/templates');
    return response.data;
  },

  getById: async (id: string): Promise<{ status: string; data: { template: Template } }> => {
    const response = await api.get(`/templates/${id}`);
    return response.data;
  },
};

// Senders API
export const sendersApi = {
  getAll: async (): Promise<{ status: string; data: { senders: Sender[] } }> => {
    const response = await api.get('/senders');
    return response.data;
  },
};

export default api;
