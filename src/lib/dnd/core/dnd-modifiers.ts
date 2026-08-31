import { RestrictToHorizontalAxis, RestrictToVerticalAxis, SnapModifier } from '@dnd-kit/abstract/modifiers';
import { RestrictToElement, RestrictToWindow } from '@dnd-kit/dom/modifiers';

import type { DndMovementPolicy, DndOrientation } from './dnd.types';

export function createDndModifiers(
  orientation: DndOrientation,
  movement: DndMovementPolicy,
  container: () => Element | null,
) {
  const modifiers = [];

  if (orientation === 'vertical') modifiers.push(RestrictToVerticalAxis);
  if (orientation === 'horizontal') modifiers.push(RestrictToHorizontalAxis);
  if (movement.restrictToParent) {
    modifiers.push(RestrictToElement.configure({ element: container }));
  }
  if (movement.restrictToWindow) modifiers.push(RestrictToWindow);
  if (movement.snapToGrid && movement.snapToGrid > 0) {
    modifiers.push(SnapModifier.configure({ size: movement.snapToGrid }));
  }

  return modifiers;
}
