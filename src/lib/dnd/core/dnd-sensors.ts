import { KeyboardSensor, PointerSensor } from '@dnd-kit/react';
import { PointerActivationConstraints } from '@dnd-kit/dom';

import type { DndActivationPolicy } from './dnd.types';

export function createDndSensors(policy: DndActivationPolicy = {}) {
  const { pointerDistance = 7, touchDelay = 220, touchTolerance = 8 } = policy;

  return [
    PointerSensor.configure({
      activationConstraints: (event) =>
        event.pointerType === 'touch'
          ? [new PointerActivationConstraints.Delay({ value: touchDelay, tolerance: touchTolerance })]
          : [new PointerActivationConstraints.Distance({ value: pointerDistance })],
    }),
    KeyboardSensor.configure({}),
  ];
}
