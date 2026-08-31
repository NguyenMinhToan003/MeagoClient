import type { DndActivationPolicy, DndMovementPolicy, DndOrientation } from '../core/dnd.types';

export interface SortablePreset {
  orientation: DndOrientation;
  activation: DndActivationPolicy;
  movement: DndMovementPolicy;
}

export const SORTABLE_PRESETS = {
  vertical: {
    orientation: 'vertical',
    activation: { pointerDistance: 7, touchDelay: 220, touchTolerance: 8 },
    movement: { restrictToParent: true },
  },
  horizontal: {
    orientation: 'horizontal',
    activation: { pointerDistance: 7, touchDelay: 220, touchTolerance: 8 },
    movement: { restrictToParent: true },
  },
  grid: {
    orientation: 'grid',
    activation: { pointerDistance: 7, touchDelay: 220, touchTolerance: 8 },
    movement: { restrictToParent: true },
  },
} satisfies Record<string, SortablePreset>;
