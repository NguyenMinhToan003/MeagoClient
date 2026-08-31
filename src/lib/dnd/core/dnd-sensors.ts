import { KeyboardSensor, PointerSensor } from '@dnd-kit/react';
import { PointerActivationConstraints } from '@dnd-kit/dom';

import type { DndActivationPolicy } from './dnd.types';

const INTERACTIVE_SELECTOR = 'a, button, input, textarea, select, option, [contenteditable="true"]';

function isNestedInteractiveTarget(event: Event) {
  const target = event.target;
  const currentTarget = event.currentTarget;
  return target instanceof Element && target !== currentTarget && Boolean(target.closest(INTERACTIVE_SELECTOR));
}

export function createDndSensors(policy: DndActivationPolicy = {}) {
  const { pointerDistance = 7, touchDelay = 220, touchTolerance = 8 } = policy;

  return [
    PointerSensor.configure({
      preventActivation: (event) => isNestedInteractiveTarget(event),
      activationConstraints: (event) =>
        event.pointerType === 'touch'
          ? [new PointerActivationConstraints.Delay({ value: touchDelay, tolerance: touchTolerance })]
          : [new PointerActivationConstraints.Distance({ value: pointerDistance, tolerance: 1 })],
    }),
    KeyboardSensor.configure({
      preventActivation: (event) => isNestedInteractiveTarget(event),
    }),
  ];
}
