import type { ReactNode } from 'react';

export type DndOrientation = 'vertical' | 'horizontal' | 'grid';

export interface DndActivationPolicy {
  pointerDistance?: number;
  touchDelay?: number;
  touchTolerance?: number;
}

export interface DndMovementPolicy {
  restrictToParent?: boolean;
  restrictToWindow?: boolean;
  snapToGrid?: number;
}

export interface SortableItemState {
  isDragging: boolean;
  isDropTarget: boolean;
  handleRef: (element: Element | null) => void;
  handleLabel: string;
}

export interface ReorderResult<TItem> {
  item: TItem;
  itemId: string;
  fromIndex: number;
  toIndex: number;
  items: TItem[];
}

export interface SortableAccessibility<TItem> {
  itemLabel: (item: TItem) => string;
  movedMessage: (result: ReorderResult<TItem>) => string;
  dragHandleLabel: (item: TItem) => string;
}

export interface SortableListProps<TItem> {
  items: readonly TItem[];
  getItemId: (item: TItem) => string;
  children: (item: TItem, state: SortableItemState) => ReactNode;
  onReorder: (result: ReorderResult<TItem>) => void | Promise<void>;
  onReorderError?: (error: unknown, result: ReorderResult<TItem>) => void;
  accessibility: SortableAccessibility<TItem>;
  activation?: DndActivationPolicy;
  movement?: DndMovementPolicy;
  orientation?: DndOrientation;
  disabled?: boolean;
  className?: string;
  itemClassName?: string;
}
