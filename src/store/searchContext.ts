import { createContext } from 'react';

// Define SearchMatch here to avoid circular dependency with SearchBar.tsx
export interface SearchMatch {
  start: number;
  end: number;
  line: number;
  column: number;
}

export interface SearchState {
  isOpen: boolean;
  showReplace: boolean;
  matches: SearchMatch[];
  currentMatchIndex: number;
}

export interface SearchContextValue {
  state: SearchState;
  openSearch: (showReplace?: boolean) => void;
  closeSearch: () => void;
  setMatches: (matches: SearchMatch[], currentIndex: number) => void;
}

export const SearchContext = createContext<SearchContextValue | null>(null);
