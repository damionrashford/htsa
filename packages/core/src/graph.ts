import { type Node, NodeStatus } from "./types.js";

export class InvestigationGraph {
  private _nodes = new Map<string, Node>();
  private _children = new Map<string, string[]>();
  private _parents = new Map<string, string | null>();
  private _originId: string | null = null;

  addNode(node: Node, parentId?: string): string {
    this._nodes.set(node.id, node);
    this._children.set(node.id, []);

    if (parentId === undefined) {
      this._originId = node.id;
      this._parents.set(node.id, null);
    } else {
      if (!this._nodes.has(parentId)) {
        throw new Error(`Parent node ${parentId} does not exist`);
      }
      this._children.get(parentId)!.push(node.id);
      this._parents.set(node.id, parentId);
      const updated: Node = { ...node, depth: this.depth(parentId) + 1 };
      this._nodes.set(node.id, updated);
    }

    return node.id;
  }

  getNode(id: string): Node {
    const node = this._nodes.get(id);
    if (!node) throw new Error(`Node ${id} not found`);
    return node;
  }

  updateNode(id: string, patch: Partial<Node>): void {
    const node = this.getNode(id);
    this._nodes.set(id, { ...node, ...patch });
  }

  removeNode(nodeId: string): void {
    const descendants = this._getDescendants(nodeId);
    for (const nid of descendants) {
      this._nodes.delete(nid);
      this._children.delete(nid);
      this._parents.delete(nid);
    }
    const pid = this._parents.get(nodeId);
    if (pid) {
      const siblings = this._children.get(pid) ?? [];
      this._children.set(pid, siblings.filter(id => id !== nodeId));
    }
    this._nodes.delete(nodeId);
    this._children.delete(nodeId);
    this._parents.delete(nodeId);
  }

  children(nodeId: string): Node[] {
    return (this._children.get(nodeId) ?? []).map(id => this.getNode(id));
  }

  childrenIds(nodeId: string): string[] {
    return [...(this._children.get(nodeId) ?? [])];
  }

  parent(nodeId: string): Node | null {
    const pid = this._parents.get(nodeId);
    return pid ? this.getNode(pid) : null;
  }

  parentId(nodeId: string): string | null {
    return this._parents.get(nodeId) ?? null;
  }

  depth(nodeId: string): number {
    let d = 0;
    let current: string | null = nodeId;
    while (true) {
      const pid = this._parents.get(current ?? "");
      if (!pid) break;
      current = pid;
      d++;
    }
    return d;
  }

  isLeaf(nodeId: string): boolean {
    return (this._children.get(nodeId) ?? []).length === 0;
  }

  get origin(): Node | null {
    return this._originId ? (this._nodes.get(this._originId) ?? null) : null;
  }

  get originId(): string | null {
    return this._originId;
  }

  allNodes(): Node[] {
    return [...this._nodes.values()];
  }

  activeNodes(): Node[] {
    return this.allNodes().filter(n => n.status === NodeStatus.Open);
  }

  rootCauses(): Node[] {
    return this.allNodes().filter(n => n.status === NodeStatus.RootCause);
  }

  prunedNodes(): Node[] {
    return this.allNodes().filter(n => n.status === NodeStatus.Pruned);
  }

  frontierNodes(): Node[] {
    return this.allNodes().filter(
      n => n.status === NodeStatus.Open && this.isLeaf(n.id),
    );
  }

  siblingGroup(nodeId: string): Node[] {
    const pid = this._parents.get(nodeId);
    if (!pid) return [this.getNode(nodeId)];
    return (this._children.get(pid) ?? []).map(id => this.getNode(id));
  }

  has(nodeId: string): boolean {
    return this._nodes.has(nodeId);
  }

  get size(): number {
    return this._nodes.size;
  }

  hasCycle(): boolean {
    const visited = new Set<string>();
    const inStack = new Set<string>();

    const dfs = (nid: string): boolean => {
      visited.add(nid);
      inStack.add(nid);
      for (const childId of this._children.get(nid) ?? []) {
        if (inStack.has(childId)) return true;
        if (!visited.has(childId) && dfs(childId)) return true;
      }
      inStack.delete(nid);
      return false;
    };

    for (const nid of this._nodes.keys()) {
      if (!visited.has(nid) && dfs(nid)) return true;
    }
    return false;
  }

  private _getDescendants(nodeId: string): string[] {
    const result: string[] = [];
    const stack = [...(this._children.get(nodeId) ?? [])];
    while (stack.length > 0) {
      const nid = stack.pop()!;
      result.push(nid);
      stack.push(...(this._children.get(nid) ?? []));
    }
    return result;
  }
}
