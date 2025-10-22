import { create } from 'zustand';
import type { Document } from '@/types';

interface DocumentState {
  currentDocument: Document | null;
  documents: Document[] | null;
  isPreviewMode: boolean;
  direction: 'rtl' | 'ltr';
  setCurrentDocument: (doc: Document | null) => void;
  setDocuments: (docs: Document[]) => void;
  togglePreviewMode: () => void;
  setDirection: (dir: 'rtl' | 'ltr') => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  currentDocument: null,
  documents: null,
  isPreviewMode: false,
  direction: 'rtl',

  setCurrentDocument: (doc) => set({ currentDocument: doc }),
  setDocuments: (docs) => set({ documents: docs }),
  togglePreviewMode: () => set((state) => ({ isPreviewMode: !state.isPreviewMode })),
  setDirection: (dir) => set({ direction: dir }),
}));
