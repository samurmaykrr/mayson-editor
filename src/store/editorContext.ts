import { createContext } from 'react';

// Editor navigation target
export interface NavigationTarget {
  line: number;
  column?: number;
  highlight?: boolean; // Briefly highlight the line
}

// Editor event types
export type EditorEventType = 
  | 'goToLine'
  | 'goToError'
  | 'focusEditor';

export interface EditorEvent {
  type: EditorEventType;
  payload?: NavigationTarget;
}

// Panel layout types
export type PanelLayout = 'single' | 'split';
export type ActivePanel = 'left' | 'right';

export interface EditorState {
  // Current navigation request (consumed by TextEditor)
  navigationTarget: NavigationTarget | null;
  // Event for editor to respond to
  pendingEvent: EditorEvent | null;
  // Panel layout state
  panelLayout: PanelLayout;
  splitRatio: number; // 0-1, percentage of left panel width
  activePanel: ActivePanel;
  // Document ID for right panel (left panel uses the main active document)
  rightPanelDocId: string | null;
}

export interface EditorContextValue {
  state: EditorState;
  // Navigate to a specific line
  goToLine: (line: number, column?: number, highlight?: boolean) => void;
  // Navigate to the current error
  goToError: () => void;
  // Clear navigation target after handling
  clearNavigation: () => void;
  // Focus the editor
  focusEditor: () => void;
  // Clear pending event
  clearEvent: () => void;
  // Panel layout controls
  toggleSplitView: () => void;
  setSplitRatio: (ratio: number) => void;
  setActivePanel: (panel: ActivePanel) => void;
  setRightPanelDoc: (docId: string | null) => void;
  closeSplitView: () => void;
}

export const EditorContext = createContext<EditorContextValue | null>(null);
