import { useContext } from 'react';
import { SearchContext, type SearchContextValue } from './searchContext';

export function useSearch(): SearchContextValue {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
}
