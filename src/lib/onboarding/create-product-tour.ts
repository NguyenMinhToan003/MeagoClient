import { driver, type Config, type DriveStep } from 'driver.js';

export function createProductTour(steps: DriveStep[], config: Omit<Config, 'steps'> = {}) {
  return driver({
    animate: true,
    showProgress: true,
    allowClose: true,
    steps,
    ...config,
  });
}
