export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'EDITOR';
  createdAt: string;
}

export interface Document {
  id: string;
  docType: string;
  language: string;
  templateId: string;
  clientName?: string;
  clientContactPerson?: string;
  clientContactPhone?: string;
  subject?: string;
  priceAmount?: number;
  priceCurrency: string;
  vatPercent: number;
  showPrice: boolean;
  userPrompt?: string;
  generatedBody?: string;
  editedBody?: string;
  status: 'DRAFT' | 'LOCKED' | 'EXPORTED';
  sender?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  versions?: DocumentVersion[];
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  content: string;
  snapshot: any;
  createdAt: string;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  code: string;
  headerHtml?: string;
  footerHtml?: string;
  styles?: any;
  isActive: boolean;
}

export interface Sender {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  title?: string;
  isActive: boolean;
}

export interface DocumentFormData {
  docType: string;
  language: string;
  templateId: string;
  clientName?: string;
  clientContactPerson?: string;
  clientContactPhone?: string;
  subject?: string;
  priceAmount?: number;
  showPrice: boolean;
  userPrompt?: string;
  sender?: string;
}

export const DOCUMENT_TYPES = [
  'הצעת מחיר',
  'הסכם משווק',
  'הסכם ריסלר',
  'הסכם אפיליאט',
  'בריף קורס חדש',
  'תכנית הכשרה מקצועית',
  'דרישת תשלום',
  'מכתב רשמי',
  'Auto'
] as const;

export const LANGUAGES = [
  { value: 'he', label: 'עברית' },
  { value: 'en', label: 'English' }
] as const;

export const TEMPLATES = [
  { value: 'A', label: 'Template A - Header + Footer קלאסי' },
  { value: 'B', label: 'Template B - עיצוב בלוקי מודרני' },
  { value: 'C', label: 'Template C - עיצוב עם סרגל צד ולוגו קבוע' }
] as const;
