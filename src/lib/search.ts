export interface SearchMatch {
  start: number;
  end: number;
  line: number;
  column: number;
}

/**
 * Find all matches in content
 */
export function findMatches(
  content: string,
  searchText: string,
  caseSensitive: boolean,
  useRegex: boolean
): SearchMatch[] {
  if (!searchText) return [];
  
  const matches: SearchMatch[] = [];
  
  try {
    let regex: RegExp;
    if (useRegex) {
      regex = new RegExp(searchText, caseSensitive ? 'g' : 'gi');
    } else {
      // Escape special regex characters for literal search
      const escaped = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      regex = new RegExp(escaped, caseSensitive ? 'g' : 'gi');
    }
    
    let match: RegExpExecArray | null;
    while ((match = regex.exec(content)) !== null) {
      // Calculate line and column
      const textBefore = content.slice(0, match.index);
      const lines = textBefore.split('\n');
      const line = lines.length;
      const column = (lines[lines.length - 1]?.length ?? 0) + 1;
      
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        line,
        column,
      });
      
      // Prevent infinite loops for zero-length matches
      if (match[0].length === 0) {
        regex.lastIndex++;
      }
    }
  } catch {
    // Invalid regex, return empty matches
  }
  
  return matches;
}
