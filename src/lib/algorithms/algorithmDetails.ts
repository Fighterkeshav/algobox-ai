import type { AlgorithmId } from "./algorithmCode";

export interface AlgorithmDetail {
    id: AlgorithmId;
    name: string;
    summary: string;
    complexity: {
        time: string;
        space: string;
    };
    details: string; // Markdown supported
    pros: string[];
    cons: string[];
    slides: Array<{
        title: string;
        content: string; // Markdown supported
    }>;
}

export const ALGORITHM_DETAILS: Record<AlgorithmId, AlgorithmDetail> = {
    "bubble-sort": {
        id: "bubble-sort",
        name: "Bubble Sort",
        summary: "A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
        complexity: {
            time: "O(n²)",
            space: "O(1)",
        },
        pros: [
            "Simple to understand and implement",
            "No extra memory required (in-place)",
            "Stable sorting algorithm"
        ],
        cons: [
            "Very inefficient for large datasets",
            "O(n²) time complexity makes it slow"
        ],
        details: `
### How it Works
Bubble Sort involves two nested loops. The outer loop iterates from the end of the array down to the start, defining the "unsorted" portion. The inner loop iterates through the unsorted portion, comparing adjacent elements.

If \`arr[j] > arr[j+1]\`, they are swapped. This process causes larger values to "bubble" up to the end of the array in each iteration, hence the name.

### Optimization
A common optimization is to introduce a flag (e.g., \`swapped\`) that checks if any swap happened in the inner loop. If no swap occurred during a full pass, the array is already sorted, and we can terminate early.
    `,
        slides: [
            {
                title: "Introduction",
                content: "Bubble Sort is the simplest sorting algorithm to understand. It works like comparing people in a line: if the person on the left is taller than the person on the right, they swap places."
            },
            {
                title: "Mechanism Check",
                content: "We repeatedly step through the list, comparing adjacent elements. `arr[j]` vs `arr[j+1]`."
            },
            {
                title: "The Swap",
                content: "If `arr[j] > arr[j+1]`, they are in the wrong order. We **swap** them. This moves the larger element towards the right."
            },
            {
                title: "Bubbling Up",
                content: "After one full pass through the array, the largest element is guaranteed to be at the end. It has 'bubbled up' to the top."
            },
            {
                title: "Repeat and Reduce",
                content: "We repeat this process for the remaining `N-1` elements, then `N-2`, and so on, until the entire array is sorted."
            },
            {
                title: "Optimization",
                content: "If we go through a whole pass without making any swaps, we know the list is already sorted and can stop early!"
            }
        ]
    },
    "quick-sort": {
        id: "quick-sort",
        name: "Quick Sort",
        summary: "A highly efficient divide-and-conquer sorting algorithm that partitions an array into two sub-arrays based on a pivot.",
        complexity: {
            time: "O(n log n)",
            space: "O(log n)",
        },
        pros: [
            "Very fast in practice",
            "Efficient for large datasets",
            "In-place variation requires little memory"
        ],
        cons: [
            "Unstable sort (relative order of equal elements not guaranteed)",
            "Worst-case performance is O(n²) if pivot is poorly chosen"
        ],
        details: `
### Divide and Conquer
Quick Sort selects a 'pivot' element and partitions the other elements into two sub-arrays:
1. Elements less than the pivot.
2. Elements greater than the pivot.

The sub-arrays are then sorted recursively.

### Pivot Selection
The choice of pivot is crucial. Common strategies include:
- Always picking the first element
- Always picking the last element
- Picking a random element
- Median-of-three
    `,
        slides: [
            {
                title: "Divide & Conquer Strategy",
                content: "Quick Sort is a divide-and-conquer algorithm. It solves a big problem by breaking it into smaller versions of itself."
            },
            {
                title: "The Pivot",
                content: "We pick one element to be the **Pivot**. Our goal is to put this pivot in its exact final sorted position."
            },
            {
                title: "Partitioning",
                content: "We reorder the array so that all elements **smaller** than the pivot are on its left, and all elements **larger** are on its right."
            },
            {
                title: "Recursive Step",
                content: "Now we have two smaller unsorted sub-arrays (left and right of pivot). We apply the exact same logic (Pivot -> Partition) to them."
            },
            {
                title: "Base Case",
                content: "We stop when a sub-array has 0 or 1 elements, as it is already sorted by definition."
            }
        ]
    },
    "merge-sort": {
        id: "merge-sort",
        name: "Merge Sort",
        summary: "A stable, divide-and-conquer algorithm that divides the array into halves, sorts them, and then merges them back together.",
        complexity: {
            time: "O(n log n)",
            space: "O(n)",
        },
        pros: [
            "Consistent O(n log n) performance",
            "Stable sort",
            "Good for linked lists and external sorting"
        ],
        cons: [
            "Requires O(n) extra space for merging",
            "Slower than Quick Sort for smaller arrays"
        ],
        details: `
### The Merge Step
The key operation is **merging** two sorted sub-arrays into a single sorted array. We compare the smallest elements of both sub-arrays and pick the smaller one to add to the result.

### Recursive Structure
1. **Divide**: Calculate the middle index \`mid = n // 2\`.
2. **Conquer**: Recursively sort \`arr[0..mid]\` and \`arr[mid..n]\`.
3. **Combine**: Merge the two sorted halves.
    `,
        slides: [
            {
                title: "Divide and Conquer",
                content: "Merge Sort also uses divide-and-conquer. It splits the array exactly in half, over and over."
            },
            {
                title: "Breaking Down",
                content: "We keep dividing the array until we have `N` sub-arrays, each containing just 1 element. A list of 1 element is considered sorted."
            },
            {
                title: "The Merge Phase",
                content: "Now we start combining (merging) them back together. We take two sorted lists and zip them into one sorted list."
            },
            {
                title: "Comparison Logic",
                content: "We look at the front of both lists, pick the smaller item, and add it to our result. We repeat this until one list is empty."
            },
            {
                title: "Final Result",
                content: "By merging up the levels, we eventually merge two sorted halves of original size `N/2` to get our fully sorted array."
            }
        ]
    },
    "insertion-sort": {
        id: "insertion-sort",
        name: "Insertion Sort",
        summary: "Builds the sorted array one item at a time, similar to how you sort playing cards in your hand.",
        complexity: {
            time: "O(n²)",
            space: "O(1)",
        },
        pros: [
            "Simple implementation",
            "Efficient for small or mostly sorted data",
            "Stable and in-place"
        ],
        cons: [
            "Inefficient for large lists",
            "High number of shifts/writes"
        ],
        details: `
### Algorithm Logic
1. Start from the second element (index 1).
2. Compare the current element (\`key\`) with the one before it.
3. If the previous element is greater, shift it one position up.
4. Repeat shifting until the correct spot for \`key\` is found.
5. Insert \`key\`.

This performs well on data that is already substantially sorted (Adaptive).
    `,
        slides: [
            {
                title: "Card Analogy",
                content: "Think of sorting cards in your hand. You pick up a new card and slide it into the correct spot among the cards you already held."
            },
            {
                title: "The Split",
                content: "The array is virtually split into a **sorted** left part and an **unsorted** right part. Initially, the sorted part has just one item."
            },
            {
                title: "Pick and Place",
                content: "We pick the first item from the unsorted part (the `key`). We compare it backwards against the sorted items."
            },
            {
                title: "Shifting",
                content: "If a sorted item is larger than our key, we shift it to the right to make space. We keep doing this until we find the correct slot."
            },
            {
                title: "Insertion",
                content: "Once the space is found, we insert the `key`. Now our sorted portion is one element larger!"
            }
        ]
    },
    "selection-sort": {
        id: "selection-sort",
        name: "Selection Sort",
        summary: "Divides the list into a sorted and unsorted region, repeatedly picking the smallest element from the unsorted region.",
        complexity: {
            time: "O(n²)",
            space: "O(1)",
        },
        pros: [
            "Simple to understand",
            "Performs minimum number of swaps (O(n))"
        ],
        cons: [
            "O(n²) time complexity",
            "Unstable sort usually"
        ],
        details: `
### Finding the Minimum
In every iteration \`i\`, we scan from \`i\` to \`n\` to find the index of the minimum element.
Once found, we swap it with the element at index \`i\`.
This grows the sorted region by one element each step.
    `,
        slides: [
            {
                title: "Selection Strategy",
                content: "Selection Sort works by finding the absolute smallest element in the mess and putting it at the front."
            },
            {
                title: "Scanning",
                content: "We scan the entire unsorted portion of the list (shown in red/uncolored) to find the minimum value."
            },
            {
                title: "Swapping",
                content: "Once we find the minimum, we **swap** it with the first element of the unsorted part."
            },
            {
                title: "Growing the Sorted Region",
                content: "That element is now 'locked' and sorted. We repeat the process for the rest of the list."
            },
            {
                title: "Efficiency Note",
                content: "Selection sort always scans the entire list, even if it's already sorted. It's predictable but slow."
            }
        ]
    },
    "binary-search": {
        id: "binary-search",
        name: "Binary Search",
        summary: "Efficient algorithm for finding an item from a sorted list of items by repeatedly dividing the search interval in half.",
        complexity: {
            time: "O(log n)",
            space: "O(1)",
        },
        pros: [
            "Extremely fast for large datasets",
            "Logarithmic time complexity"
        ],
        cons: [
            "Requires the array to be sorted first",
            "Harder to implement correctly (off-by-one errors)"
        ],
        details: `
### The Concept
Instead of checking every element (Linear Search), check the middle.
- If \`target == middle\`, we found it.
- If \`target < middle\`, we know the target must be in the left half. We discard the right half.
- If \`target > middle\`, we discard the left half.

This eliminates half the search space in every step.
    `,
        slides: [
            {
                title: "The Problem",
                content: "We need to find a number in a list. If the list is random, we have to check every number. But what if it's **sorted**?"
            },
            {
                title: "Divide and Conquer",
                content: "We check the **middle** element. Is it our target? Is our target smaller or larger?"
            },
            {
                title: "Elimination",
                content: "If our target is smaller than the middle, we know it CANNOT be in the right half. We throw away half the list instantly!"
            },
            {
                title: "Repeat",
                content: "We look at the remaining half and pick its middle. We keep halving the search space."
            },
            {
                title: "Logarithmic Speed",
                content: "This is `O(log n)`. For 1,000,000 items, we only need about 20 checks to find anything. Linear search would need up to 1,000,000."
            }
        ]
    },
    "dijkstra": {
        id: "dijkstra",
        name: "Dijkstra's Algorithm",
        summary: "Algorithm for finding the shortest paths between nodes in a graph, which may represent, for example, road networks.",
        complexity: {
            time: "O(E + V log V)",
            space: "O(V)",
        },
        pros: [
            "Guarantees shortest path in non-negative graphs",
            "Widely used in routing protocols"
        ],
        cons: [
            "Doesn't work with negative edge weights",
            "Can be slow on very dense graphs"
        ],
        details: `
### Greedy Approach
Dijkstra's is a greedy algorithm. It always visits the unvisited node with the smallest known distance from the start.
1. Assign temporary distance values (0 for start, infinity for others).
2. Visit the node with smallest tentative distance.
3. Update distances of neighbors (Relaxation).
4. Mark current node as visited.
5. Repeat.
    `,
        slides: [
            {
                title: "The Goal",
                content: "Find the shortest path from a Start Node to a Goal Node (or all other nodes) in a weighted graph."
            },
            {
                title: "Initialization",
                content: "We set the distance to the Start Node as 0, and distance to all other nodes as Infinity."
            },
            {
                title: "Greedy Choice",
                content: "We always look at the unvisited node with the **smallest known distance**. Initially, this is just the Start Node."
            },
            {
                title: "Relaxation",
                content: "For the current node, we check its neighbors. Can we reach a neighbor faster through the current node than the previous best known way? If yes, update the distance."
            },
            {
                title: "Completion",
                content: "Once we proceed to a node, we are guaranteed to have found the shortest path to it. We mark it as visited and never check it again."
            }
        ]
    },
    "a-star": {
        id: "a-star",
        name: "A* Pathfinding",
        summary: "An extension of Dijkstra's Algorithm that uses heuristics to guide the search towards the goal more efficiently.",
        complexity: {
            time: "O(E)",
            space: "O(V)",
        },
        pros: [
            "Faster than Dijkstra for point-to-point",
            "Optimally efficient with admissible heuristic"
        ],
        cons: [
            "Heuristic must be admissible (never overestimate)",
            "Memory heavy (keeps all generated nodes)"
        ],
        details: `
### The Magic of Heuristics
A* uses a cost function \`f(n) = g(n) + h(n)\`.
- \`g(n)\`: Exact cost from start to node \`n\`.
- \`h(n)\`: Estimated cost from \`n\` to goal (Heuristic).

By adding \`h(n)\`, A* prioritizes nodes that seem to lead closer to the goal, avoiding expanding paths in the wrong direction.
    `,
        slides: [
            {
                title: "Smarter Search",
                content: "Dijkstra explores equally in all directions, like a growing circle. A* is smarter—it knows roughly where the goal is."
            },
            {
                title: "The Heuristic (h)",
                content: "A* adds a 'guess' cost (heuristic) to the real cost. `f(n) = g(n) + h(n)`. `h(n)` is usually the straight-line distance to the goal."
            },
            {
                title: "Beeline",
                content: "Because of the heuristic, A* prioritizes nodes that get us geographically closer to the target, ignoring paths that go away from it."
            },
            {
                title: "Optimality",
                content: "As long as the heuristic never overestimates the true distance (it's 'admissible'), A* is guaranteed to find the shortest path."
            }
        ]
    },
    "bfs": {
        id: "bfs",
        name: "Breadth-First Search",
        summary: "Algorithm for traversing or searching tree or graph data structures. It starts at the tree root and explores all neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.",
        complexity: {
            time: "O(V + E)",
            space: "O(V)",
        },
        pros: [
            "Guarantees shortest path in unweighted graphs",
            "Complete (will find a solution if one exists)"
        ],
        cons: [
            "Memory intensive (stores all nodes at current level)",
            "Slower on deep solutions"
        ],
        details: `
### Layer by Layer
BFS explores the graph in concentric circles (or layers) expanding from the start node.
- Layer 0: Start node
- Layer 1: Neighbors of start
- Layer 2: Neighbors of neighbors
It uses a **Queue** (FIFO) data structure to manage the frontier.
    `,
        slides: [
            {
                title: "The Wave",
                content: "Imagine dropping a stone in a pond. The ripples move out in circles. That is exactly how BFS works."
            },
            {
                title: "The Queue",
                content: "BFS uses a Queue (First-In-First-Out). We check neighbors, add them to the back of the line, and process them in order."
            },
            {
                title: "Level by Level",
                content: "It checks everything at 1 step away, then everything at 2 steps away, and so on."
            },
            {
                title: "Shortest Path Guarantee",
                content: "In an unweighted graph (like a grid), BFS is guaranteed to find the path with the fewest number of edges/steps."
            }
        ]
    },
    "n-queen": {
        id: "n-queen",
        name: "N-Queens",
        summary: "The problem of placing N chess queens on an N×N chessboard so that no two queens threaten each other.",
        complexity: {
            time: "O(N!)",
            space: "O(N)",
        },
        pros: [
            "Classic backtracking example",
            "Good for testing constraint solvers"
        ],
        cons: [
            "Exponential time complexity",
            "Becomes very slow for N > 15"
        ],
        details: `
### Backtracking
We try to place a queen in the first column of the current row.
If safe, we move to the next row (recursive call).
If we reach a state where no queen can be placed in current row, we **backtrack** - go back to previous row and move that queen to the next column.
    `,
        slides: [
            {
                title: "The Challenge",
                content: "Place N Queens on an NxN board so no two queens attack each other. Queens attack horizontally, vertically, and diagonally."
            },
            {
                title: "Brute Force vs Smart",
                content: "Trying every position is impossible. We use **Backtracking**, which is like smart trial-and-error."
            },
            {
                title: "Placement Strategy",
                content: "We place a queen row by row. We try the first valid column in the current row."
            },
            {
                title: "Dead End",
                content: "If we reach a row where NO column is safe (because of previous queens), we hit a dead end."
            },
            {
                title: "Backtrack",
                content: "We go back to the previous row, pick up that queen, and move her to the next valid spot. Then we try moving forward again."
            }
        ]
    },
    "sieve": {
        id: "sieve",
        name: "Sieve of Eratosthenes",
        summary: "Ancient algorithm for finding all prime numbers up to any given limit.",
        complexity: {
            time: "O(n log log n)",
            space: "O(n)",
        },
        pros: [
            "Most efficient way to find small primes",
            "Simple array-based logic"
        ],
        cons: [
            "Memory intensive O(n)",
            "Not suitable for finding extremely large primes (RSA)"
        ],
        details: `
### Elimination Method
1. Create a list of numbers from 2 to n.
2. Start with the first prime, p=2.
3. Mark all multiples of p (2p, 3p, ... etc) as composite (not prime).
4. Find the next unmarked number. This is the next prime.
5. Repeat.
    `,
        slides: [
            {
                title: "Finding Primes",
                content: "We want to find all prime numbers up to N. A prime is only divisible by 1 and itself."
            },
            {
                title: "Assume True",
                content: "We start by assuming ALL numbers from 2 to N are prime."
            },
            {
                title: "The First Prime: 2",
                content: "We start with 2. 2 is prime. But we know every multiple of 2 (4, 6, 8...) cannot be prime. We cross them out!"
            },
            {
                title: "Next Number",
                content: "We move to the next not-crossed-out number, which is 3. We know 3 is prime. We cross out all multiples of 3 (6, 9, 12...)."
            },
            {
                title: "Optimization",
                content: "We only need to check up to the square root of N. Any composite number larger than that would have already been crossed out by a smaller factor."
            }
        ]
    },
};
