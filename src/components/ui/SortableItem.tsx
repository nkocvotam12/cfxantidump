'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
    position: 'relative' as const,
  };

  // Prevent keyboard drag listener from intercepting Space/Enter inside form controls
  const safeListeners = listeners
    ? {
        ...listeners,
        onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
          const target = e.target as HTMLElement | null;
          if (target?.closest('input, button, select, textarea, a, label')) return;
          listeners.onKeyDown?.(e);
        },
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...safeListeners}>
      {children}
    </div>
  );
}
