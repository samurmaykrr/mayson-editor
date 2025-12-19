import { useContext, useEffect } from 'react';
import {
  EditorContext,
  type NavigationTarget,
  type EditorContextValue,
  type EditorEventType,
} from './editorContext';

// Hook for accessing the editor context
export function useEditor(): EditorContextValue {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within EditorProvider');
  }
  return context;
}

// Hook for accessing panel layout state
export function usePanelLayout() {
  const { state, toggleSplitView, setSplitRatio, setActivePanel, setRightPanelDoc, closeSplitView } = useEditor();
  return {
    panelLayout: state.panelLayout,
    splitRatio: state.splitRatio,
    activePanel: state.activePanel,
    rightPanelDocId: state.rightPanelDocId,
    toggleSplitView,
    setSplitRatio,
    setActivePanel,
    setRightPanelDoc,
    closeSplitView,
  };
}

// Hook for listening to editor events
// Note: This triggers handler when event matches, which is intentional event-driven behavior
export function useEditorEvent(
  eventType: EditorEventType,
  handler: (payload?: NavigationTarget) => void
) {
  const { state, clearEvent } = useEditor();

  useEffect(() => {
    if (state.pendingEvent?.type === eventType) {
      // eslint-disable-next-line react-you-might-not-need-an-effect/you-might-not-need-an-effect -- Event dispatch is intentional
      handler(state.pendingEvent.payload);
      clearEvent();
    }
  }, [state.pendingEvent, eventType, handler, clearEvent]);
}
