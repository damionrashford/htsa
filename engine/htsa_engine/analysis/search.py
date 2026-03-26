"""
Search strategies — how to traverse the Why tree.

Implements Best-First, DFS, and BFS from math/06_search_algorithms.md.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from collections import deque
from enum import Enum

from ..core import Node, NodeStatus


class SearchType(Enum):
    BEST_FIRST = "best_first"
    DFS = "dfs"
    BFS = "bfs"


class SearchStrategy(ABC):
    """Base class for search strategies over the investigation graph."""

    @abstractmethod
    def add(self, node: Node) -> None:
        """Add a node to the exploration frontier."""

    @abstractmethod
    def next(self) -> Node | None:
        """Get the next node to explore. Returns None if empty."""

    @abstractmethod
    def is_empty(self) -> bool:
        """Whether the frontier is empty."""

    @abstractmethod
    def peek(self) -> Node | None:
        """Look at the next node without removing it."""

    @property
    @abstractmethod
    def strategy_type(self) -> SearchType:
        """The type of search strategy."""

    def add_all(self, nodes: list[Node]) -> None:
        for node in nodes:
            self.add(node)


class BestFirstSearch(SearchStrategy):
    """
    Priority queue ordered by LIVE probability (highest first).
    Default strategy — follows the most likely branch.

    Unlike a traditional heap where priority is fixed at insertion,
    this implementation reads the node's current probability on every
    extraction. Bayesian updates change probabilities after insertion,
    so stale snapshots would violate the Best-First invariant.
    """

    def __init__(self) -> None:
        self._nodes: list[Node] = []

    @property
    def strategy_type(self) -> SearchType:
        return SearchType.BEST_FIRST

    def add(self, node: Node) -> None:
        self._nodes.append(node)

    def next(self) -> Node | None:
        # Select the OPEN node with highest CURRENT probability
        best: Node | None = None
        best_idx: int = -1
        for i, node in enumerate(self._nodes):
            if node.status == NodeStatus.OPEN:
                if best is None or node.probability > best.probability:
                    best = node
                    best_idx = i
        if best is not None:
            self._nodes.pop(best_idx)
            return best
        return None

    def peek(self) -> Node | None:
        best: Node | None = None
        for node in self._nodes:
            if node.status == NodeStatus.OPEN:
                if best is None or node.probability > best.probability:
                    best = node
        return best

    def is_empty(self) -> bool:
        return all(n.status != NodeStatus.OPEN for n in self._nodes)


class DepthFirstSearch(SearchStrategy):
    """
    Stack-based. Goes deep fast on one branch.
    Use under time pressure (Rapid Mode).
    """

    def __init__(self) -> None:
        self._stack: list[Node] = []

    @property
    def strategy_type(self) -> SearchType:
        return SearchType.DFS

    def add(self, node: Node) -> None:
        self._stack.append(node)

    def next(self) -> Node | None:
        while self._stack:
            node = self._stack.pop()
            if node.status == NodeStatus.OPEN:
                return node
        return None

    def peek(self) -> Node | None:
        for node in reversed(self._stack):
            if node.status == NodeStatus.OPEN:
                return node
        return None

    def is_empty(self) -> bool:
        return all(n.status != NodeStatus.OPEN for n in self._stack)


class BreadthFirstSearch(SearchStrategy):
    """
    Queue-based. Explores all branches at each depth before going deeper.
    Use when completeness matters more than speed.
    """

    def __init__(self) -> None:
        self._queue: deque[Node] = deque()

    @property
    def strategy_type(self) -> SearchType:
        return SearchType.BFS

    def add(self, node: Node) -> None:
        self._queue.append(node)

    def next(self) -> Node | None:
        while self._queue:
            node = self._queue.popleft()
            if node.status == NodeStatus.OPEN:
                return node
        return None

    def peek(self) -> Node | None:
        for node in self._queue:
            if node.status == NodeStatus.OPEN:
                return node
        return None

    def is_empty(self) -> bool:
        return all(n.status != NodeStatus.OPEN for n in self._queue)


def create_search(strategy: SearchType) -> SearchStrategy:
    """Factory for search strategies."""
    return {
        SearchType.BEST_FIRST: BestFirstSearch,
        SearchType.DFS: DepthFirstSearch,
        SearchType.BFS: BreadthFirstSearch,
    }[strategy]()
