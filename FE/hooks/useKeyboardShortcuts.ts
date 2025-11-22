'use client';

import { useEffect } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  handler: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatches = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = shortcut.ctrlKey ? e.ctrlKey : !e.ctrlKey;
        const metaMatches = shortcut.metaKey ? e.metaKey : !e.metaKey;
        const shiftMatches = shortcut.shiftKey ? e.shiftKey : !e.shiftKey;
        const altMatches = shortcut.altKey ? e.altKey : !e.altKey;

        // For mod+key shortcuts (Cmd on Mac, Ctrl on Windows)
        if (shortcut.metaKey || shortcut.ctrlKey) {
          const modKeyPressed = e.metaKey || e.ctrlKey;
          if (keyMatches && modKeyPressed && shiftMatches && altMatches) {
            e.preventDefault();
            shortcut.handler();
            return;
          }
        } else {
          // For single key shortcuts
          if (keyMatches && !e.metaKey && !e.ctrlKey && shiftMatches && altMatches) {
            e.preventDefault();
            shortcut.handler();
            return;
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
