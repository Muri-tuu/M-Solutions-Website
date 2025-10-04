export class MemStorage<T extends { id: string }> {
  private readonly items = new Map<string, T>();

  getAll(): T[] {
    return Array.from(this.items.values());
  }

  getById(id: string): T | undefined {
    return this.items.get(id);
  }

  upsert(item: T): void {
    this.items.set(item.id, item);
  }

  seed(items: T[]): void {
    for (const item of items) {
      this.items.set(item.id, item);
    }
  }
}
