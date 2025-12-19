import { useContext, useMemo, useCallback } from 'react';
import type { Document, ViewMode, ValidationError, JsonSchema, SchemaSource } from '@/types';
import { generateId } from '@/lib/utils';
import {
  DocumentContext,
  DocumentOverrideContext,
  type DocumentContextValue,
} from './documentContext';

// ============================================
// Internal Hook
// ============================================

export function useDocumentStore(): DocumentContextValue {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocumentStore must be used within DocumentProvider');
  }
  return context;
}

// ============================================
// Override Hook
// ============================================

/**
 * Hook to get the override document ID if set
 */
export function useDocumentOverride(): string | null {
  return useContext(DocumentOverrideContext).overrideDocId;
}

// ============================================
// Public Hooks
// ============================================

/**
 * Get the currently active document
 */
export function useActiveDocument(): Document | null {
  const { state } = useDocumentStore();
  return useMemo(
    () => state.activeDocumentId
      ? state.documents.get(state.activeDocumentId) ?? null
      : null,
    [state.documents, state.activeDocumentId]
  );
}

/**
 * Get the current document for editors - respects DocumentOverrideProvider.
 * If inside a DocumentOverrideProvider, returns that document.
 * Otherwise returns the globally active document.
 * Use this in editor components instead of useActiveDocument().
 */
export function useCurrentDocument(): Document | null {
  const { state } = useDocumentStore();
  const overrideDocId = useDocumentOverride();
  
  return useMemo(() => {
    const docId = overrideDocId ?? state.activeDocumentId;
    return docId ? state.documents.get(docId) ?? null : null;
  }, [state.documents, state.activeDocumentId, overrideDocId]);
}

/**
 * Get the current document ID - respects DocumentOverrideProvider.
 */
export function useCurrentDocumentId(): string | null {
  const { state } = useDocumentStore();
  const overrideDocId = useDocumentOverride();
  return overrideDocId ?? state.activeDocumentId;
}

/**
 * Get a specific document by ID
 */
export function useDocument(id: string): Document | undefined {
  const { state } = useDocumentStore();
  return state.documents.get(id);
}

/**
 * Get tab information for the tab bar
 */
export function useTabs(): Array<{ id: string; name: string; isDirty: boolean; isActive: boolean }> {
  const { state } = useDocumentStore();
  return useMemo(
    () => state.tabOrder.map((id: string) => {
      const doc = state.documents.get(id);
      return {
        id,
        name: doc?.name ?? 'Unknown',
        isDirty: doc?.isDirty ?? false,
        isActive: id === state.activeDocumentId,
      };
    }),
    [state.tabOrder, state.documents, state.activeDocumentId]
  );
}

/**
 * Get the active document ID
 */
export function useActiveDocumentId(): string | null {
  const { state } = useDocumentStore();
  return state.activeDocumentId;
}

/**
 * Document actions hook
 */
export function useDocumentActions() {
  const { state, dispatch, historyManager } = useDocumentStore();
  
  return useMemo(() => ({
    createDocument: (name: string = 'Untitled', content: string = '{\n  \n}'): string => {
      const id = generateId();
      dispatch({ type: 'CREATE_DOCUMENT', payload: { id, name, content } });
      historyManager.initHistory(id, content);
      return id;
    },
    
    duplicateDocument: (sourceId: string): string | null => {
      const sourceDoc = state.documents.get(sourceId);
      if (!sourceDoc) return null;
      
      const newId = generateId();
      const newName = `${sourceDoc.name} (copy)`;
      dispatch({ type: 'CREATE_DOCUMENT', payload: { id: newId, name: newName, content: sourceDoc.content } });
      historyManager.initHistory(newId, sourceDoc.content);
      return newId;
    },
    
    closeDocument: (id: string) => {
      dispatch({ type: 'CLOSE_DOCUMENT', payload: { id } });
      historyManager.clearHistory(id);
    },
    
    setActive: (id: string) => {
      dispatch({ type: 'SET_ACTIVE', payload: { id } });
    },
    
    updateContent: (id: string, content: string) => {
      // Track in history
      historyManager.pushHistory(id, content);
      // Update document
      dispatch({ type: 'UPDATE_CONTENT', payload: { id, content } });
    },
    
    setViewMode: (id: string, mode: ViewMode) => {
      dispatch({ type: 'SET_VIEW_MODE', payload: { id, mode } });
    },
    
    renameDocument: (id: string, name: string) => {
      dispatch({ type: 'RENAME_DOCUMENT', payload: { id, name } });
    },
    
    reorderTabs: (fromIndex: number, toIndex: number) => {
      dispatch({ type: 'REORDER_TABS', payload: { fromIndex, toIndex } });
    },
    
    markSaved: (id: string) => {
      dispatch({ type: 'MARK_SAVED', payload: { id } });
    },
  }), [state.documents, dispatch, historyManager]);
}

/**
 * Callback to update active document content (with history tracking)
 */
export function useUpdateActiveContent() {
  const { state, dispatch, historyManager } = useDocumentStore();
  
  return useCallback((content: string) => {
    if (state.activeDocumentId) {
      // Track in history
      historyManager.pushHistory(state.activeDocumentId, content);
      // Update document
      dispatch({
        type: 'UPDATE_CONTENT',
        payload: { id: state.activeDocumentId, content },
      });
    }
  }, [state.activeDocumentId, dispatch, historyManager]);
}

/**
 * Callback to update current document content (respects override) with history tracking
 */
export function useUpdateCurrentContent() {
  const { state, dispatch, historyManager } = useDocumentStore();
  const overrideDocId = useDocumentOverride();
  
  return useCallback((content: string) => {
    const docId = overrideDocId ?? state.activeDocumentId;
    if (docId) {
      // Track in history
      historyManager.pushHistory(docId, content);
      // Update document
      dispatch({
        type: 'UPDATE_CONTENT',
        payload: { id: docId, content },
      });
    }
  }, [state.activeDocumentId, overrideDocId, dispatch, historyManager]);
}

/**
 * Hook for undo/redo functionality
 */
export function useUndoRedo() {
  const { state, dispatch, historyManager } = useDocumentStore();
  
  const undo = useCallback(() => {
    if (!state.activeDocumentId) return false;
    
    const entry = historyManager.undo(state.activeDocumentId);
    if (entry) {
      dispatch({
        type: 'UPDATE_CONTENT',
        payload: { id: state.activeDocumentId, content: entry.content },
      });
      return true;
    }
    return false;
  }, [state.activeDocumentId, dispatch, historyManager]);
  
  const redo = useCallback(() => {
    if (!state.activeDocumentId) return false;
    
    const entry = historyManager.redo(state.activeDocumentId);
    if (entry) {
      dispatch({
        type: 'UPDATE_CONTENT',
        payload: { id: state.activeDocumentId, content: entry.content },
      });
      return true;
    }
    return false;
  }, [state.activeDocumentId, dispatch, historyManager]);
  
  const canUndo = state.activeDocumentId
    ? historyManager.canUndo(state.activeDocumentId)
    : false;
    
  const canRedo = state.activeDocumentId
    ? historyManager.canRedo(state.activeDocumentId)
    : false;
  
  return { undo, redo, canUndo, canRedo };
}

/**
 * Hook for getting validation errors for the active document
 */
export function useValidationErrors(): ValidationError[] {
  const { state } = useDocumentStore();
  const activeDoc = state.activeDocumentId
    ? state.documents.get(state.activeDocumentId)
    : null;
  return activeDoc?.validationErrors ?? [];
}

/**
 * Hook for setting validation errors on a document
 */
export function useSetValidationErrors() {
  const { state, dispatch } = useDocumentStore();
  
  return useCallback((errors: ValidationError[]) => {
    if (state.activeDocumentId) {
      dispatch({
        type: 'SET_VALIDATION_ERRORS',
        payload: { id: state.activeDocumentId, errors },
      });
    }
  }, [state.activeDocumentId, dispatch]);
}

/**
 * Hook for getting the schema associated with the active document
 */
export function useActiveDocumentSchema(): { schema: JsonSchema | null; source: SchemaSource | null } {
  const { state } = useDocumentStore();
  const activeDoc = state.activeDocumentId
    ? state.documents.get(state.activeDocumentId)
    : null;
  return {
    schema: activeDoc?.schema ?? null,
    source: activeDoc?.schemaSource ?? null,
  };
}

/**
 * Hook for setting the schema on the active document
 */
export function useSetDocumentSchema() {
  const { state, dispatch } = useDocumentStore();
  
  return useCallback((schema: JsonSchema | null, source: SchemaSource | null) => {
    if (state.activeDocumentId) {
      dispatch({
        type: 'SET_SCHEMA',
        payload: { id: state.activeDocumentId, schema, source },
      });
    }
  }, [state.activeDocumentId, dispatch]);
}
