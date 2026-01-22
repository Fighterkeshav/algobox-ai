export type AlgorithmId =
    | "bubble-sort"
    | "quick-sort"
    | "merge-sort"
    | "insertion-sort"
    | "selection-sort"
    | "binary-search"
    | "dijkstra"
    | "a-star"
    | "bfs"
    | "n-queen"
    | "sieve";

export interface AlgorithmCodeInfo {
    name: string;
    code: string;
    language: "python" | "javascript" | "pseudocode";
    lineCount: number;
}

export const ALGORITHM_CODE: Record<AlgorithmId, AlgorithmCodeInfo> = {
    "bubble-sort": {
        name: "Bubble Sort",
        language: "python",
        lineCount: 10,
        code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                # Swap elements
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

result = bubble_sort([64, 34, 25, 12, 22, 11, 90])`,
    },
    "quick-sort": {
        name: "Quick Sort",
        language: "python",
        lineCount: 16,
        code: `def quick_sort(arr, low, high):
    if low < high:
        pivot_idx = partition(arr, low, high)
        quick_sort(arr, low, pivot_idx - 1)
        quick_sort(arr, pivot_idx + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
    },
    "merge-sort": {
        name: "Merge Sort",
        language: "python",
        lineCount: 20,
        code: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
    },
    "insertion-sort": {
        name: "Insertion Sort",
        language: "python",
        lineCount: 10,
        code: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
    },
    "selection-sort": {
        name: "Selection Sort",
        language: "python",
        lineCount: 10,
        code: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
    },
    "binary-search": {
        name: "Binary Search",
        language: "python",
        lineCount: 13,
        code: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid  # Found!
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1  # Not found`,
    },
    "dijkstra": {
        name: "Dijkstra's Algorithm",
        language: "python",
        lineCount: 18,
        code: `def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    visited = set()
    
    while len(visited) < len(graph):
        # Find unvisited node with min distance
        current = min(
            (n for n in graph if n not in visited),
            key=lambda n: distances[n]
        )
        visited.add(current)
        
        # Update neighbor distances
        for neighbor, weight in graph[current]:
            new_dist = distances[current] + weight
            if new_dist < distances[neighbor]:
                distances[neighbor] = new_dist
    
    return distances`,
    },
    "a-star": {
        name: "A* Pathfinding",
        language: "python",
        lineCount: 22,
        code: `def a_star(grid, start, end):
    open_set = [start]
    came_from = {}
    g_score = {start: 0}
    f_score = {start: heuristic(start, end)}
    
    while open_set:
        current = min(open_set, key=lambda n: f_score.get(n, float('inf')))
        
        if current == end:
            return reconstruct_path(came_from, current)
        
        open_set.remove(current)
        
        for neighbor in get_neighbors(current, grid):
            tentative_g = g_score[current] + 1
            
            if tentative_g < g_score.get(neighbor, float('inf')):
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g
                f_score[neighbor] = tentative_g + heuristic(neighbor, end)
                if neighbor not in open_set:
                    open_set.append(neighbor)
    
    return None  # No path found`,
    },
    "bfs": {
        name: "Breadth-First Search",
        language: "python",
        lineCount: 16,
        code: `def bfs(grid, start, end):
    queue = [start]
    visited = {start}
    parent = {}
    
    while queue:
        current = queue.pop(0)
        
        if current == end:
            return reconstruct_path(parent, end)
        
        for neighbor in get_neighbors(current, grid):
            if neighbor not in visited:
                visited.add(neighbor)
                parent[neighbor] = current
                queue.append(neighbor)
    
    return None  # No path found`,
    },
    "n-queen": {
        name: "N-Queens",
        language: "python",
        lineCount: 18,
        code: `def solve_n_queens(n):
    board = [[0] * n for _ in range(n)]
    solutions = []
    
    def is_safe(row, col):
        # Check column and diagonals
        for i in range(row):
            if board[i][col] == 1:
                return False
            if col - (row - i) >= 0 and board[i][col - (row - i)] == 1:
                return False
            if col + (row - i) < n and board[i][col + (row - i)] == 1:
                return False
        return True
    
    def backtrack(row):
        if row == n:
            solutions.append([r[:] for r in board])
            return
        for col in range(n):
            if is_safe(row, col):
                board[row][col] = 1
                backtrack(row + 1)
                board[row][col] = 0
    
    backtrack(0)
    return solutions`,
    },
    "sieve": {
        name: "Sieve of Eratosthenes",
        language: "python",
        lineCount: 12,
        code: `def sieve_of_eratosthenes(n):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    
    p = 2
    while p * p <= n:
        if is_prime[p]:
            # Mark multiples as not prime
            for i in range(p * p, n + 1, p):
                is_prime[i] = False
        p += 1
    
    return [i for i in range(n + 1) if is_prime[i]]`,
    },
};

// Step-to-line mapping for each algorithm
// Maps step types to the line numbers that should be highlighted
export const STEP_LINE_MAPPING: Record<AlgorithmId, Record<string, number>> = {
    "bubble-sort": {
        init: 1,
        compare: 5,
        swap: 7,
        done: 10,
    },
    "quick-sort": {
        init: 1,
        pivot: 8,
        compare: 11,
        swap: 13,
        "place-pivot": 14,
        done: 5,
    },
    "merge-sort": {
        init: 1,
        divide: 4,
        merge: 12,
        merged: 19,
        done: 7,
    },
    "insertion-sort": {
        init: 1,
        select: 3,
        compare: 5,
        shift: 6,
        insert: 8,
        done: 9,
    },
    "selection-sort": {
        init: 1,
        "select-min": 4,
        compare: 5,
        "new-min": 7,
        swap: 8,
        done: 9,
    },
    "binary-search": {
        init: 2,
        check: 5,
        found: 8,
        narrow: 10,
        "not-found": 14,
    },
    dijkstra: {
        init: 2,
        visit: 8,
        update: 15,
        done: 20,
    },
    "a-star": {
        init: 2,
        visit: 8,
        "add-open": 20,
        done: 11,
        "no-path": 25,
    },
    bfs: {
        init: 2,
        visit: 7,
        enqueue: 13,
        done: 10,
        "no-path": 16,
    },
    "n-queen": {
        init: 2,
        place: 21,
        check: 7,
        backtrack: 23,
        solution: 18,
        done: 26,
    },
    sieve: {
        init: 2,
        check: 6,
        mark: 9,
        done: 13,
    },
};
