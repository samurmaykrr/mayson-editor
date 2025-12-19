import {
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import {
  EditorContext,
  type EditorState,
  type ActivePanel,
} from './editorContext';

export function EditorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EditorState>({
    navigationTarget: null,
    pendingEvent: null,
    panelLayout: 'single',
    splitRatio: 0.5,
    activePanel: 'left',
    rightPanelDocId: null,
  });

  const goToLine = useCallback((line: number, column?: number, highlight?: boolean) => {
    setState((prev) => ({
      ...prev,
      navigationTarget: { line, column, highlight },
      pendingEvent: { type: 'goToLine', payload: { line, column, highlight } },
    }));
  }, []);

  const goToError = useCallback(() => {
    setState((prev) => ({
      ...prev,
      pendingEvent: { type: 'goToError' },
    }));
  }, []);

  const clearNavigation = useCallback(() => {
    setState((prev) => ({ ...prev, navigationTarget: null }));
  }, []);

  const focusEditor = useCallback(() => {
    setState((prev) => ({
      ...prev,
      pendingEvent: { type: 'focusEditor' },
    }));
  }, []);

  const clearEvent = useCallback(() => {
    setState((prev) => ({ ...prev, pendingEvent: null }));
  }, []);

  // Panel layout controls
  const toggleSplitView = useCallback(() => {
    setState((prev) => ({
      ...prev,
      panelLayout: prev.panelLayout === 'single' ? 'split' : 'single',
    }));
  }, []);

  const setSplitRatio = useCallback((ratio: number) => {
    setState((prev) => ({
      ...prev,
      splitRatio: Math.max(0.2, Math.min(0.8, ratio)), // Clamp between 20% and 80%
    }));
  }, []);

  const setActivePanel = useCallback((panel: ActivePanel) => {
    setState((prev) => ({
      ...prev,
      activePanel: panel,
    }));
  }, []);

  const setRightPanelDoc = useCallback((docId: string | null) => {
    setState((prev) => ({
      ...prev,
      rightPanelDocId: docId,
    }));
  }, []);

  const closeSplitView = useCallback(() => {
    setState((prev) => ({
      ...prev,
      panelLayout: 'single',
      rightPanelDocId: null,
      activePanel: 'left',
    }));
  }, []);

  const value = useMemo(
    () => ({
      state,
      goToLine,
      goToError,
      clearNavigation,
      focusEditor,
      clearEvent,
      toggleSplitView,
      setSplitRatio,
      setActivePanel,
      setRightPanelDoc,
      closeSplitView,
    }),
    [state, goToLine, goToError, clearNavigation, focusEditor, clearEvent, toggleSplitView, setSplitRatio, setActivePanel, setRightPanelDoc, closeSplitView]
  );

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}
