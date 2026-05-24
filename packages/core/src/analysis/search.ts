import { type Node, NodeStatus, SearchType } from "../types.js";

export interface SearchStrategy {
  readonly strategyType: SearchType;
  add(node: Node): void;
  addAll(nodes: Node[]): void;
  next(): Node | null;
  peek(): Node | null;
  isEmpty(): boolean;
}

export class BestFirstSearch implements SearchStrategy {
  readonly strategyType = SearchType.BestFirst;
  private _nodes: Node[] = [];

  add(node: Node): void {
    this._nodes.push(node);
  }

  addAll(nodes: Node[]): void {
    for (const n of nodes) this.add(n);
  }

  next(): Node | null {
    let best: Node | null = null;
    let bestIdx = -1;
    for (let i = 0; i < this._nodes.length; i++) {
      const n = this._nodes[i]!;
      if (n.status === NodeStatus.Open) {
        if (best === null || n.probability > best.probability) {
          best = n;
          bestIdx = i;
        }
      }
    }
    if (best !== null) {
      this._nodes.splice(bestIdx, 1);
    }
    return best;
  }

  peek(): Node | null {
    let best: Node | null = null;
    for (const n of this._nodes) {
      if (n.status === NodeStatus.Open) {
        if (best === null || n.probability > best.probability) best = n;
      }
    }
    return best;
  }

  isEmpty(): boolean {
    return this._nodes.every(n => n.status !== NodeStatus.Open);
  }
}

export class DepthFirstSearch implements SearchStrategy {
  readonly strategyType = SearchType.DFS;
  private _stack: Node[] = [];

  add(node: Node): void {
    this._stack.push(node);
  }

  addAll(nodes: Node[]): void {
    for (const n of nodes) this.add(n);
  }

  next(): Node | null {
    while (this._stack.length > 0) {
      const n = this._stack.pop()!;
      if (n.status === NodeStatus.Open) return n;
    }
    return null;
  }

  peek(): Node | null {
    for (let i = this._stack.length - 1; i >= 0; i--) {
      const n = this._stack[i]!;
      if (n.status === NodeStatus.Open) return n;
    }
    return null;
  }

  isEmpty(): boolean {
    return this._stack.every(n => n.status !== NodeStatus.Open);
  }
}

export class BreadthFirstSearch implements SearchStrategy {
  readonly strategyType = SearchType.BFS;
  private _queue: Node[] = [];

  add(node: Node): void {
    this._queue.push(node);
  }

  addAll(nodes: Node[]): void {
    for (const n of nodes) this.add(n);
  }

  next(): Node | null {
    while (this._queue.length > 0) {
      const n = this._queue.shift()!;
      if (n.status === NodeStatus.Open) return n;
    }
    return null;
  }

  peek(): Node | null {
    for (const n of this._queue) {
      if (n.status === NodeStatus.Open) return n;
    }
    return null;
  }

  isEmpty(): boolean {
    return this._queue.every(n => n.status !== NodeStatus.Open);
  }
}

export function createSearch(strategy: SearchType): SearchStrategy {
  switch (strategy) {
    case SearchType.BestFirst: return new BestFirstSearch();
    case SearchType.DFS: return new DepthFirstSearch();
    case SearchType.BFS: return new BreadthFirstSearch();
  }
}
