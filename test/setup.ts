import "@testing-library/jest-dom/vitest";

/**
 * @description Node 22+'s native (still-experimental) `localStorage` global
 * shadows jsdom's implementation and throws without `--localstorage-file`,
 * which breaks every Zustand `persist` store under test. Replace it with a
 * plain in-memory Storage polyfill for the test environment.
 */
class MemoryStorage implements Storage {
  private store = new Map<string, string>();

  get length() {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

Object.defineProperty(globalThis, "localStorage", {
  value: new MemoryStorage(),
  configurable: true,
  writable: true,
});
