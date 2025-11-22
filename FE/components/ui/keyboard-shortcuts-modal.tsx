'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface KeyboardShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ShortcutRowProps {
  keys: string[];
  description: string;
}

function ShortcutRow({ keys, description }: ShortcutRowProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-700">{description}</span>
      <div className="flex items-center gap-1">
        {keys.map((key, index) => (
          <span key={index}>
            <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded-md shadow-sm">
              {key}
            </kbd>
            {index < keys.length - 1 && (
              <span className="mx-1 text-gray-400">+</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export function KeyboardShortcutsModal({ open, onOpenChange }: KeyboardShortcutsModalProps) {
  const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-1 mt-4">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Navigation</h3>
            <div className="space-y-1">
              <ShortcutRow keys={[modKey, 'K']} description="Open command palette" />
              <ShortcutRow keys={['C']} description="Add new course" />
              <ShortcutRow keys={['T']} description="Go to tasks" />
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Actions</h3>
            <div className="space-y-1">
              <ShortcutRow keys={['Esc']} description="Close open menus" />
              <ShortcutRow keys={['Shift', '/']} description="Show this help" />
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">List Navigation</h3>
            <div className="space-y-1">
              <ShortcutRow keys={['↑', '↓']} description="Navigate items" />
              <ShortcutRow keys={['Enter']} description="Select item" />
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Press <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-100 border border-gray-300 rounded">?</kbd> anytime to view shortcuts
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
