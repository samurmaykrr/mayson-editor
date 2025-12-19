import { createContext } from 'react';
import type { DocumentState, DocumentAction } from './types';
import type { HistoryManager } from '@/hooks';

// ============================================
// Document Context
// ============================================

export interface DocumentContextValue {
  state: DocumentState;
  dispatch: React.Dispatch<DocumentAction>;
  historyManager: HistoryManager;
}

export const DocumentContext = createContext<DocumentContextValue | null>(null);

// ============================================
// Document Override Context
// ============================================
// This context allows overriding which document editors display
// Used for split view where right panel shows a different document

export interface DocumentOverrideContextValue {
  overrideDocId: string | null;
}

export const DocumentOverrideContext = createContext<DocumentOverrideContextValue>({ overrideDocId: null });
