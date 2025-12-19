import { useState, useCallback } from 'react';
import type { ContextMenuItem } from './ContextMenu';

/**
 * Hook for managing context menu state
 */
export function useContextMenu() {
  const [menuState, setMenuState] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
    items: ContextMenuItem[];
  }>({
    isOpen: false,
    x: 0,
    y: 0,
    items: [],
  });
  
  const openMenu = useCallback((e: React.MouseEvent, items: ContextMenuItem[]) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuState({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      items,
    });
  }, []);
  
  const closeMenu = useCallback(() => {
    setMenuState((prev) => ({ ...prev, isOpen: false }));
  }, []);
  
  return {
    isOpen: menuState.isOpen,
    x: menuState.x,
    y: menuState.y,
    items: menuState.items,
    openMenu,
    closeMenu,
  };
}
