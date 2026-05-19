// Simple localStorage polyfill for test environment. Vitest jsdom may already provide localStorage,
// but some test runners or flags produce a stubbed object where methods are not functions.
// Ensure a deterministic implementation for tests.
const storage: Record<string, string> = {};

function isFn(v: unknown): v is Function {
  return typeof v === 'function';
}

if (typeof window !== 'undefined') {
  try {
    const ls = (window as any).localStorage;
    if (!ls || !isFn(ls.getItem) || !isFn(ls.setItem) || !isFn(ls.removeItem) || !isFn(ls.clear)) {
      (window as any).localStorage = {
        getItem(key: string) {
          return Object.prototype.hasOwnProperty.call(storage, key) ? storage[key] : null;
        },
        setItem(key: string, value: string) {
          storage[key] = String(value);
        },
        removeItem(key: string) {
          delete storage[key];
        },
        clear() {
          Object.keys(storage).forEach((k) => delete storage[k]);
        },
      };
    }
  } catch (e) {
    // ignore
  }
}

