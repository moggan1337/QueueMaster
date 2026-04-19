export class Queue<T> {
  private items: T[] = [];
  enqueue(item: T) { this.items.push(item); }
  dequeue(): T | undefined { return this.items.shift(); }
  size() { return this.items.length; }
  peek(): T | undefined { return this.items[0]; }
}
export class WorkerQueue<T> extends Queue<T> {
  process(fn: (item: T) => void) { setInterval(() => { const item = this.dequeue(); if (item) fn(item); }, 1000); }
}
export default Queue;
