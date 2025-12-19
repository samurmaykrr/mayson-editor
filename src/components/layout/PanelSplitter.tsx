import { useCallback, useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface PanelSplitterProps {
  onResize: (ratio: number) => void;
  className?: string;
}

// Find the actual flex container parent (skipping React's internal SLOT elements)
function findFlexContainer(element: HTMLElement | null): HTMLElement | null {
  let current = element?.parentElement;
  while (current) {
    const rect = current.getBoundingClientRect();
    // Find the first ancestor with actual width (the flex container)
    if (rect.width > 0) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

export function PanelSplitter({ onResize, className }: PanelSplitterProps) {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const parentRectRef = useRef<DOMRect | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Prevent text selection and event bubbling to parent panels
    e.preventDefault();
    e.stopPropagation();
    // Only respond to left mouse button, and ignore if this is second click of double-click
    if (e.button === 0 && e.detail === 1) {
      // Find and cache the actual flex container's rect at drag start
      const container = findFlexContainer(containerRef.current);
      if (container) {
        parentRectRef.current = container.getBoundingClientRect();
      }
      setIsDragging(true);
    }
  }, []);

  // Handle mouse move and up at document level when dragging.
  // This effect is required to attach/detach document-level event listeners for drag operations.
  // eslint-disable-next-line react-you-might-not-need-an-effect/you-might-not-need-an-effect
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      moveEvent.stopPropagation();
      
      // Use the cached rect for consistent calculations during drag
      const rect = parentRectRef.current;
      if (!rect) return;

      const newRatio = (moveEvent.clientX - rect.left) / rect.width;
      // Clamp between 20% and 80%
      const clampedRatio = Math.max(0.2, Math.min(0.8, newRatio));
      onResize(clampedRatio);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      parentRectRef.current = null;
    };

    // Use capture phase to intercept events before other handlers
    document.addEventListener('mousemove', handleMouseMove, { capture: true });
    document.addEventListener('mouseup', handleMouseUp, { capture: true });
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove, { capture: true });
      document.removeEventListener('mouseup', handleMouseUp, { capture: true });
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, onResize]);

  const handleDoubleClick = useCallback(() => {
    // Reset to 50/50 split on double-click
    onResize(0.5);
  }, [onResize]);

  return (
    <>
      <div
        ref={containerRef}
        className={cn(
          'relative w-2 flex-shrink-0 cursor-col-resize group z-20',
          'bg-border-default hover:bg-accent transition-colors',
          isDragging && 'bg-accent',
          className
        )}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize panels"
      >
        {/* Larger hit area for easier grabbing */}
        <div 
          className="absolute inset-y-0 -left-3 -right-3 cursor-col-resize"
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
        />
        
        {/* Visual indicator in the middle */}
        <div
          className={cn(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none',
            'w-1 h-8 rounded-full',
            'bg-border-strong group-hover:bg-accent-hover transition-colors',
            isDragging && 'bg-accent-hover'
          )}
        />
      </div>
      
      {/* Full-screen overlay during drag to capture all mouse events */}
      {isDragging && createPortal(
        <div 
          className="fixed inset-0 z-[9999] cursor-col-resize"
          style={{ background: 'transparent' }}
        />,
        document.body
      )}
    </>
  );
}
