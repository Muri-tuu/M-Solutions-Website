export class MemStorage {
  constructor() {
    this.keyToValue = new Map();
  }

  put(key, value) {
    this.keyToValue.set(key, value);
  }

  get(key) {
    return this.keyToValue.get(key);
  }

  has(key) {
    return this.keyToValue.has(key);
  }
}

export const GlobalMem = new MemStorage();
