'use client';

import type { PropsWithChildren } from 'react';
import { DragDropProvider, type DragEndEvent } from '@dnd-kit/react';

import { createDndModifiers } from './dnd-modifiers';
import { createDndSensors } from './dnd-sensors';
import type { DndActivationPolicy, DndMovementPolicy, DndOrientation } from './dnd.types';

interface MeagoDndProviderProps extends PropsWithChildren {
  activation?: DndActivationPolicy;
  movement?: DndMovementPolicy;
  orientation?: DndOrientation;
  container: HTMLElement | null;
  onDragEnd: (event: DragEndEvent) => void;
}

export function MeagoDndProvider({
  activation,
  children,
  container,
  movement = { restrictToParent: true },
  onDragEnd,
  orientation = 'vertical',
}: MeagoDndProviderProps) {
  return (
    <DragDropProvider
      sensors={createDndSensors(activation)}
      modifiers={createDndModifiers(orientation, movement, () => container)}
      onDragEnd={onDragEnd}
    >
      {children}
    </DragDropProvider>
  );
}
