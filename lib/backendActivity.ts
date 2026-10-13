let generation = 0;
let pending = 0;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

/** Start a new page-load window. Requests already in flight are ignored. */
export function startBackendWait() {
  generation += 1;
  pending = 0;
  emit();
}

export function backendPending() {
  return pending;
}

export function subscribeBackendActivity(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Count a backend call toward the current page load.
 * Calls made before a page load starts are not counted.
 */
export function trackBackendRequest<T>(work: () => Promise<T>): Promise<T> {
  const gen = generation;
  if (gen === 0) return work();

  pending += 1;
  emit();

  return work().finally(() => {
    if (gen !== generation) return;
    pending = Math.max(0, pending - 1);
    emit();
  });
}
