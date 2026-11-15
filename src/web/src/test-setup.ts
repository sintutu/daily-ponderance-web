import '@testing-library/jest-dom/vitest';

Object.defineProperty(window, 'scrollTo', { configurable: true, value: () => undefined });
Element.prototype.scrollIntoView = () => undefined;
const storage = new Map<string, string>();
Object.defineProperty(window, 'localStorage', {
  configurable: true,
  value: {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, String(value)),
    removeItem: (key: string) => storage.delete(key),
    clear: () => storage.clear(),
  },
});
