"""
Investigation graph — the DAG structure from Definition 1.

G = (V, E, P, Ev) where:
  V = finite set of typed nodes
  E = directed edges (causal links, surface -> root cause)
  P = probability function on nodes
  Ev = evidence mapping
"""

from __future__ import annotations

from typing import Optional

from .models import Node, NodeStatus


class InvestigationGraph:
    """
    DAG representing the full investigation.

    Nodes are causal claims. Edges point from surface toward root cause
    (parent -> child means "child is a deeper cause of parent").
    """

    def __init__(self) -> None:
        self._nodes: dict[str, Node] = {}
        self._edges: dict[str, list[str]] = {}     # parent_id -> [child_ids]
        self._parents: dict[str, Optional[str]] = {}  # child_id -> parent_id
        self._origin_id: Optional[str] = None

    # -- Node operations --

    def add_node(self, node: Node, parent_id: Optional[str] = None) -> str:
        self._nodes[node.id] = node
        self._edges.setdefault(node.id, [])

        if parent_id is None:
            self._origin_id = node.id
            self._parents[node.id] = None
        else:
            if parent_id not in self._nodes:
                raise KeyError(f"Parent node {parent_id} does not exist")
            self._edges[parent_id].append(node.id)
            self._parents[node.id] = parent_id
            node.depth = self.depth(parent_id) + 1

        return node.id

    def get_node(self, node_id: str) -> Node:
        return self._nodes[node_id]

    def remove_node(self, node_id: str) -> None:
        """Remove a node and all its descendants."""
        descendants = self._get_descendants(node_id)
        for nid in descendants:
            del self._nodes[nid]
            del self._edges[nid]
            if nid in self._parents:
                del self._parents[nid]
        # Remove from parent's edge list
        parent_id = self._parents.get(node_id)
        if parent_id and parent_id in self._edges:
            self._edges[parent_id] = [
                cid for cid in self._edges[parent_id] if cid != node_id
            ]
        del self._nodes[node_id]
        del self._edges[node_id]
        if node_id in self._parents:
            del self._parents[node_id]

    # -- Edge / structure queries --

    def children(self, node_id: str) -> list[Node]:
        return [self._nodes[cid] for cid in self._edges.get(node_id, [])]

    def children_ids(self, node_id: str) -> list[str]:
        return list(self._edges.get(node_id, []))

    def parent(self, node_id: str) -> Optional[Node]:
        pid = self._parents.get(node_id)
        return self._nodes[pid] if pid else None

    def parent_id(self, node_id: str) -> Optional[str]:
        return self._parents.get(node_id)

    def depth(self, node_id: str) -> int:
        d = 0
        current = node_id
        while self._parents.get(current) is not None:
            current = self._parents[current]
            d += 1
        return d

    def is_leaf(self, node_id: str) -> bool:
        return len(self._edges.get(node_id, [])) == 0

    @property
    def origin(self) -> Optional[Node]:
        return self._nodes.get(self._origin_id) if self._origin_id else None

    @property
    def origin_id(self) -> Optional[str]:
        return self._origin_id

    # -- Filtered views --

    def all_nodes(self) -> list[Node]:
        return list(self._nodes.values())

    def active_nodes(self) -> list[Node]:
        return [n for n in self._nodes.values() if n.status == NodeStatus.OPEN]

    def root_causes(self) -> list[Node]:
        return [n for n in self._nodes.values() if n.status == NodeStatus.ROOT_CAUSE]

    def pruned_nodes(self) -> list[Node]:
        return [n for n in self._nodes.values() if n.status == NodeStatus.PRUNED]

    def frontier_nodes(self) -> list[Node]:
        """Unexpanded leaf nodes that are still OPEN."""
        return [
            n for n in self._nodes.values()
            if n.status == NodeStatus.OPEN and self.is_leaf(n.id)
        ]

    # -- Sibling probability normalization --

    def siblings(self, node_id: str) -> list[Node]:
        pid = self._parents.get(node_id)
        if pid is None:
            return []
        return [
            self._nodes[cid]
            for cid in self._edges[pid]
            if cid != node_id
        ]

    def sibling_group(self, node_id: str) -> list[Node]:
        """All children of this node's parent, including this node."""
        pid = self._parents.get(node_id)
        if pid is None:
            return [self._nodes[node_id]]
        return [self._nodes[cid] for cid in self._edges[pid]]

    # -- Internal helpers --

    def _get_descendants(self, node_id: str) -> list[str]:
        result = []
        stack = list(self._edges.get(node_id, []))
        while stack:
            nid = stack.pop()
            result.append(nid)
            stack.extend(self._edges.get(nid, []))
        return result

    # -- Cycle detection (for feedback loop handler) --

    def has_cycle(self) -> bool:
        visited: set[str] = set()
        in_stack: set[str] = set()

        def dfs(nid: str) -> bool:
            visited.add(nid)
            in_stack.add(nid)
            for child_id in self._edges.get(nid, []):
                if child_id in in_stack:
                    return True
                if child_id not in visited and dfs(child_id):
                    return True
            in_stack.discard(nid)
            return False

        for nid in self._nodes:
            if nid not in visited:
                if dfs(nid):
                    return True
        return False

    # -- Convergence detection --

    def convergent_nodes(self) -> dict[str, list[list[str]]]:
        """
        Find nodes reachable by multiple paths from origin.
        Returns {node_id: [path1, path2, ...]} for convergent nodes.

        In the formal graph, convergence means two branches of the Why tree
        independently point to the same root cause.
        """
        if not self._origin_id:
            return {}

        all_paths: dict[str, list[list[str]]] = {}

        def find_paths(nid: str, current_path: list[str]) -> None:
            current_path = current_path + [nid]
            if self.is_leaf(nid):
                all_paths.setdefault(nid, []).append(current_path)
            for child_id in self._edges.get(nid, []):
                find_paths(child_id, current_path)

        find_paths(self._origin_id, [])
        return {nid: paths for nid, paths in all_paths.items() if len(paths) > 1}

    def __len__(self) -> int:
        return len(self._nodes)

    def __contains__(self, node_id: str) -> bool:
        return node_id in self._nodes
