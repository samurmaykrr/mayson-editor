import {
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import {
  SearchContext,
  type SearchMatch,
  type SearchState,
} from './searchContext';

export function SearchProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SearchState>({
    isOpen: false,
    showReplace: false,
    matches: [],
    currentMatchIndex: 0,
  });
  
  const openSearch = useCallback((showReplace = false) => {
    setState((prev) => ({ ...prev, isOpen: true, showReplace }));
  }, []);
  
  const closeSearch = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false, matches: [], currentMatchIndex: 0 }));
  }, []);
  
  const setMatches = useCallback((matches: SearchMatch[], currentIndex: number) => {
    setState((prev) => ({ ...prev, matches, currentMatchIndex: currentIndex }));
  }, []);
  
  const value = useMemo(
    () => ({ state, openSearch, closeSearch, setMatches }),
    [state, openSearch, closeSearch, setMatches]
  );
  
  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}
