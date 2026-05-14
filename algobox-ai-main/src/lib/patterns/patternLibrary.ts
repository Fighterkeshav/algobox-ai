// Algorithm Patterns Library
// Pattern-based learning system inspired by algo.monster
// Each pattern includes theory, template code, and related problems

export interface Pattern {
  id: string;
  name: string;
  category: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  timeToLearn: string;
  interviewFrequency: number; // 1-100 percentage
  companies: string[];
  whenToUse: string[];
  keyIndicators: string[];
  template: {
    python: string;
    javascript: string;
    cpp: string;
  };
  complexity: {
    time: string;
    space: string;
  };
  relatedProblems: string[]; // Problem IDs from problemLibrary
  prerequisites: string[]; // Pattern IDs
  videoUrl?: string;
}

export interface PatternCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  patterns: string[];
}

export const PATTERN_CATEGORIES: PatternCategory[] = [
  {
    id: "two-pointers",
    name: "Two Pointers",
    description: "Techniques using two pointers to traverse data structures efficiently",
    icon: "🎯",
    patterns: ["two-pointers-opposite", "two-pointers-same-direction", "fast-slow-pointers"],
  },
  {
    id: "sliding-window",
    name: "Sliding Window",
    description: "Fixed or variable size window sliding through arrays/strings",
    icon: "🪟",
    patterns: ["fixed-sliding-window", "variable-sliding-window"],
  },
  {
    id: "binary-search",
    name: "Binary Search",
    description: "Divide and conquer on sorted data or search spaces",
    icon: "🔍",
    patterns: ["binary-search-basic", "binary-search-boundary", "binary-search-answer"],
  },
  {
    id: "tree-traversal",
    name: "Tree Traversal",
    description: "DFS and BFS techniques for tree problems",
    icon: "🌳",
    patterns: ["dfs-tree", "bfs-tree", "tree-recursion"],
  },
  {
    id: "graph",
    name: "Graph Algorithms",
    description: "BFS, DFS, and advanced graph algorithms",
    icon: "🔗",
    patterns: ["bfs-graph", "dfs-graph", "topological-sort"],
  },
  {
    id: "dynamic-programming",
    name: "Dynamic Programming",
    description: "Optimal substructure and overlapping subproblems",
    icon: "📊",
    patterns: ["dp-1d", "dp-2d", "dp-knapsack"],
  },
  {
    id: "backtracking",
    name: "Backtracking",
    description: "Exploring all possibilities with pruning",
    icon: "🔙",
    patterns: ["backtracking-combinations", "backtracking-permutations", "backtracking-subsets"],
  },
  {
    id: "stack-queue",
    name: "Stack & Queue",
    description: "LIFO and FIFO data structure patterns",
    icon: "📚",
    patterns: ["monotonic-stack", "stack-parentheses"],
  },
];

export const PATTERNS: Pattern[] = [
  // ========== TWO POINTERS ==========
  {
    id: "two-pointers-opposite",
    name: "Two Pointers (Opposite Direction)",
    category: "two-pointers",
    description: `The opposite direction two-pointer technique uses two pointers starting at opposite ends of an array and moving towards each other. This is commonly used for problems involving sorted arrays, palindromes, or finding pairs.`,
    difficulty: "beginner",
    timeToLearn: "30 mins",
    interviewFrequency: 85,
    companies: ["Google", "Amazon", "Meta", "Microsoft", "Apple"],
    whenToUse: [
      "Sorted array problems",
      "Finding pairs with a target sum",
      "Palindrome checking",
      "Container with most water type problems",
    ],
    keyIndicators: [
      "Array is sorted or can be sorted",
      "Need to find pairs/triplets",
      "Comparing elements from both ends",
    ],
    template: {
      python: `def two_pointers_opposite(arr):
    """
    Two Pointers - Opposite Direction Template
    Time: O(n), Space: O(1)
    """
    left, right = 0, len(arr) - 1
    result = []
    
    while left < right:
        # Calculate current state
        current = arr[left] + arr[right]  # Example: sum
        
        if current == target:
            # Found a valid pair
            result.append([arr[left], arr[right]])
            left += 1
            right -= 1
        elif current < target:
            # Need larger sum, move left pointer
            left += 1
        else:
            # Need smaller sum, move right pointer
            right -= 1
    
    return result`,
      javascript: `function twoPointersOpposite(arr, target) {
  /**
   * Two Pointers - Opposite Direction Template
   * Time: O(n), Space: O(1)
   */
  let left = 0;
  let right = arr.length - 1;
  const result = [];
  
  while (left < right) {
    // Calculate current state
    const current = arr[left] + arr[right]; // Example: sum
    
    if (current === target) {
      // Found a valid pair
      result.push([arr[left], arr[right]]);
      left++;
      right--;
    } else if (current < target) {
      // Need larger sum, move left pointer
      left++;
    } else {
      // Need smaller sum, move right pointer
      right--;
    }
  }
  
  return result;
}`,
      cpp: `vector<pair<int,int>> twoPointersOpposite(vector<int>& arr, int target) {
    /**
     * Two Pointers - Opposite Direction Template
     * Time: O(n), Space: O(1)
     */
    int left = 0, right = arr.size() - 1;
    vector<pair<int,int>> result;
    
    while (left < right) {
        // Calculate current state
        int current = arr[left] + arr[right]; // Example: sum
        
        if (current == target) {
            // Found a valid pair
            result.push_back({arr[left], arr[right]});
            left++;
            right--;
        } else if (current < target) {
            // Need larger sum, move left pointer
            left++;
        } else {
            // Need smaller sum, move right pointer
            right--;
        }
    }
    
    return result;
}`,
    },
    complexity: {
      time: "O(n)",
      space: "O(1)",
    },
    relatedProblems: ["two-sum", "three-sum", "container-water", "reverse-string"],
    prerequisites: [],
  },
  {
    id: "fast-slow-pointers",
    name: "Fast & Slow Pointers (Floyd's Cycle)",
    category: "two-pointers",
    description: `The fast and slow pointer technique (also known as Floyd's Cycle Detection) uses two pointers moving at different speeds. The slow pointer moves one step at a time while the fast pointer moves two steps. This pattern is essential for detecting cycles in linked lists and finding middle elements.`,
    difficulty: "intermediate",
    timeToLearn: "45 mins",
    interviewFrequency: 75,
    companies: ["Google", "Amazon", "Meta", "Microsoft"],
    whenToUse: [
      "Cycle detection in linked lists",
      "Finding the middle of a linked list",
      "Finding the start of a cycle",
      "Happy number problems",
    ],
    keyIndicators: [
      "Linked list problems",
      "Detecting cycles or loops",
      "Finding middle elements",
    ],
    template: {
      python: `def fast_slow_pointers(head):
    """
    Fast & Slow Pointers Template
    Time: O(n), Space: O(1)
    """
    if not head or not head.next:
        return None  # or appropriate base case
    
    slow = head
    fast = head
    
    # Detect cycle or find middle
    while fast and fast.next:
        slow = slow.next          # Move 1 step
        fast = fast.next.next     # Move 2 steps
        
        # For cycle detection
        if slow == fast:
            # Cycle detected! Find cycle start
            slow = head
            while slow != fast:
                slow = slow.next
                fast = fast.next
            return slow  # Start of cycle
    
    # If no cycle, slow is at middle (for odd-length lists)
    return slow`,
      javascript: `function fastSlowPointers(head) {
  /**
   * Fast & Slow Pointers Template
   * Time: O(n), Space: O(1)
   */
  if (!head || !head.next) {
    return null; // or appropriate base case
  }
  
  let slow = head;
  let fast = head;
  
  // Detect cycle or find middle
  while (fast && fast.next) {
    slow = slow.next;        // Move 1 step
    fast = fast.next.next;   // Move 2 steps
    
    // For cycle detection
    if (slow === fast) {
      // Cycle detected! Find cycle start
      slow = head;
      while (slow !== fast) {
        slow = slow.next;
        fast = fast.next;
      }
      return slow; // Start of cycle
    }
  }
  
  // If no cycle, slow is at middle
  return slow;
}`,
      cpp: `ListNode* fastSlowPointers(ListNode* head) {
    /**
     * Fast & Slow Pointers Template
     * Time: O(n), Space: O(1)
     */
    if (!head || !head->next) {
        return nullptr;
    }
    
    ListNode* slow = head;
    ListNode* fast = head;
    
    // Detect cycle or find middle
    while (fast && fast->next) {
        slow = slow->next;        // Move 1 step
        fast = fast->next->next;  // Move 2 steps
        
        // For cycle detection
        if (slow == fast) {
            // Cycle detected! Find cycle start
            slow = head;
            while (slow != fast) {
                slow = slow->next;
                fast = fast->next;
            }
            return slow;
        }
    }
    
    return slow; // Middle of list
}`,
    },
    complexity: {
      time: "O(n)",
      space: "O(1)",
    },
    relatedProblems: [],
    prerequisites: ["two-pointers-opposite"],
  },

  // ========== SLIDING WINDOW ==========
  {
    id: "variable-sliding-window",
    name: "Variable Size Sliding Window",
    category: "sliding-window",
    description: `The variable sliding window pattern maintains a window that can grow or shrink based on certain conditions. This is commonly used for finding the longest or shortest substring/subarray that satisfies a condition.`,
    difficulty: "intermediate",
    timeToLearn: "1 hour",
    interviewFrequency: 90,
    companies: ["Google", "Amazon", "Meta", "Microsoft", "Apple", "Netflix"],
    whenToUse: [
      "Longest/shortest substring problems",
      "Subarray with sum conditions",
      "String with at most K distinct characters",
      "Minimum window substring",
    ],
    keyIndicators: [
      "Contiguous subarray/substring",
      "Max/min length with condition",
      "At most K distinct elements",
    ],
    template: {
      python: `def variable_sliding_window(s):
    """
    Variable Size Sliding Window Template
    Time: O(n), Space: O(k) where k = distinct elements
    """
    window = {}  # or set(), or counter
    left = 0
    result = 0  # or float('inf') for minimum
    
    for right in range(len(s)):
        # 1. Expand: Add element at right to window
        char = s[right]
        window[char] = window.get(char, 0) + 1
        
        # 2. Shrink: While window is invalid, remove from left
        while not is_valid(window):  # Define your condition
            left_char = s[left]
            window[left_char] -= 1
            if window[left_char] == 0:
                del window[left_char]
            left += 1
        
        # 3. Update result (window is now valid)
        result = max(result, right - left + 1)
    
    return result`,
      javascript: `function variableSlidingWindow(s) {
  /**
   * Variable Size Sliding Window Template
   * Time: O(n), Space: O(k)
   */
  const window = new Map();
  let left = 0;
  let result = 0; // or Infinity for minimum
  
  for (let right = 0; right < s.length; right++) {
    // 1. Expand: Add element at right to window
    const char = s[right];
    window.set(char, (window.get(char) || 0) + 1);
    
    // 2. Shrink: While window is invalid, remove from left
    while (!isValid(window)) { // Define your condition
      const leftChar = s[left];
      window.set(leftChar, window.get(leftChar) - 1);
      if (window.get(leftChar) === 0) {
        window.delete(leftChar);
      }
      left++;
    }
    
    // 3. Update result (window is now valid)
    result = Math.max(result, right - left + 1);
  }
  
  return result;
}`,
      cpp: `int variableSlidingWindow(string& s) {
    /**
     * Variable Size Sliding Window Template
     * Time: O(n), Space: O(k)
     */
    unordered_map<char, int> window;
    int left = 0;
    int result = 0;
    
    for (int right = 0; right < s.size(); right++) {
        // 1. Expand: Add element at right to window
        char c = s[right];
        window[c]++;
        
        // 2. Shrink: While window is invalid
        while (!isValid(window)) {
            char leftChar = s[left];
            window[leftChar]--;
            if (window[leftChar] == 0) {
                window.erase(leftChar);
            }
            left++;
        }
        
        // 3. Update result
        result = max(result, right - left + 1);
    }
    
    return result;
}`,
    },
    complexity: {
      time: "O(n)",
      space: "O(k)",
    },
    relatedProblems: ["longest-substring"],
    prerequisites: [],
  },

  // ========== BINARY SEARCH ==========
  {
    id: "binary-search-basic",
    name: "Binary Search (Basic)",
    category: "binary-search",
    description: `Binary search is a divide-and-conquer algorithm that repeatedly divides the search interval in half. It requires a sorted array and achieves O(log n) time complexity. Master this fundamental pattern before moving to advanced variations.`,
    difficulty: "beginner",
    timeToLearn: "30 mins",
    interviewFrequency: 95,
    companies: ["Google", "Amazon", "Meta", "Microsoft", "Apple", "Netflix", "Uber"],
    whenToUse: [
      "Searching in a sorted array",
      "Finding exact target value",
      "O(log n) search required",
    ],
    keyIndicators: [
      "Sorted array given",
      "Need to find specific element",
      "Mentions logarithmic complexity",
    ],
    template: {
      python: `def binary_search(arr, target):
    """
    Binary Search - Basic Template
    Time: O(log n), Space: O(1)
    """
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2  # Avoid overflow
        
        if arr[mid] == target:
            return mid  # Found!
        elif arr[mid] < target:
            left = mid + 1   # Search right half
        else:
            right = mid - 1  # Search left half
    
    return -1  # Not found`,
      javascript: `function binarySearch(arr, target) {
  /**
   * Binary Search - Basic Template
   * Time: O(log n), Space: O(1)
   */
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    
    if (arr[mid] === target) {
      return mid; // Found!
    } else if (arr[mid] < target) {
      left = mid + 1;  // Search right half
    } else {
      right = mid - 1; // Search left half
    }
  }
  
  return -1; // Not found
}`,
      cpp: `int binarySearch(vector<int>& arr, int target) {
    /**
     * Binary Search - Basic Template
     * Time: O(log n), Space: O(1)
     */
    int left = 0, right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2; // Avoid overflow
        
        if (arr[mid] == target) {
            return mid; // Found!
        } else if (arr[mid] < target) {
            left = mid + 1;  // Search right half
        } else {
            right = mid - 1; // Search left half
        }
    }
    
    return -1; // Not found
}`,
    },
    complexity: {
      time: "O(log n)",
      space: "O(1)",
    },
    relatedProblems: ["binary-search"],
    prerequisites: [],
  },
  {
    id: "binary-search-boundary",
    name: "Binary Search (Find Boundary)",
    category: "binary-search",
    description: `This variation finds the first or last occurrence of a target, or the boundary where a condition changes from false to true. Essential for problems like "find first bad version" or "search in rotated array".`,
    difficulty: "intermediate",
    timeToLearn: "45 mins",
    interviewFrequency: 85,
    companies: ["Google", "Amazon", "Meta", "Microsoft"],
    whenToUse: [
      "Find first/last occurrence",
      "Find first true in boolean array",
      "Search insert position",
      "Find peak element",
    ],
    keyIndicators: [
      "First/last occurrence needed",
      "Boundary between two states",
      "Monotonic condition",
    ],
    template: {
      python: `def binary_search_boundary(arr):
    """
    Binary Search - Find Boundary Template
    Finds the FIRST index where condition is True
    Time: O(log n), Space: O(1)
    """
    left, right = 0, len(arr) - 1
    boundary_index = -1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if condition(arr[mid]):  # Define your condition
            boundary_index = mid   # Potential answer
            right = mid - 1        # Look for earlier boundary
        else:
            left = mid + 1         # Condition not met yet
    
    return boundary_index

# Alternative: Find LAST index where condition is True
def binary_search_last(arr):
    left, right = 0, len(arr) - 1
    boundary_index = -1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if condition(arr[mid]):
            boundary_index = mid
            left = mid + 1         # Look for later boundary
        else:
            right = mid - 1
    
    return boundary_index`,
      javascript: `function binarySearchBoundary(arr) {
  /**
   * Binary Search - Find Boundary Template
   * Finds the FIRST index where condition is True
   * Time: O(log n), Space: O(1)
   */
  let left = 0;
  let right = arr.length - 1;
  let boundaryIndex = -1;
  
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    
    if (condition(arr[mid])) { // Define your condition
      boundaryIndex = mid;     // Potential answer
      right = mid - 1;         // Look for earlier boundary
    } else {
      left = mid + 1;          // Condition not met yet
    }
  }
  
  return boundaryIndex;
}`,
      cpp: `int binarySearchBoundary(vector<int>& arr) {
    /**
     * Binary Search - Find Boundary Template
     * Time: O(log n), Space: O(1)
     */
    int left = 0, right = arr.size() - 1;
    int boundaryIndex = -1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (condition(arr[mid])) {
            boundaryIndex = mid;
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }
    
    return boundaryIndex;
}`,
    },
    complexity: {
      time: "O(log n)",
      space: "O(1)",
    },
    relatedProblems: [],
    prerequisites: ["binary-search-basic"],
  },

  // ========== TREE TRAVERSAL ==========
  {
    id: "dfs-tree",
    name: "DFS Tree Traversal",
    category: "tree-traversal",
    description: `Depth-First Search on trees explores as deep as possible before backtracking. It includes pre-order, in-order, and post-order traversals. DFS is implemented using recursion or an explicit stack.`,
    difficulty: "intermediate",
    timeToLearn: "1 hour",
    interviewFrequency: 90,
    companies: ["Google", "Amazon", "Meta", "Microsoft", "Apple"],
    whenToUse: [
      "Tree traversal problems",
      "Path finding in trees",
      "Validating BST",
      "Tree height/depth problems",
    ],
    keyIndicators: [
      "Tree data structure",
      "Need to visit all nodes",
      "Path from root to leaf",
    ],
    template: {
      python: `def dfs_tree(root):
    """
    DFS Tree Traversal - Recursive Template
    Time: O(n), Space: O(h) where h = height
    """
    # Base case
    if not root:
        return None  # or 0, [], etc.
    
    # Pre-order: Process current node FIRST
    # process(root.val)
    
    # Recursive calls
    left_result = dfs_tree(root.left)
    
    # In-order: Process current node BETWEEN children
    # process(root.val)
    
    right_result = dfs_tree(root.right)
    
    # Post-order: Process current node LAST
    # process(root.val)
    
    # Combine and return results
    return combine(left_result, right_result, root.val)

# Iterative Version (Pre-order)
def dfs_iterative(root):
    if not root:
        return []
    
    result = []
    stack = [root]
    
    while stack:
        node = stack.pop()
        result.append(node.val)  # Pre-order
        
        # Push right first so left is processed first
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)
    
    return result`,
      javascript: `function dfsTree(root) {
  /**
   * DFS Tree Traversal - Recursive Template
   * Time: O(n), Space: O(h)
   */
  // Base case
  if (!root) {
    return null; // or 0, [], etc.
  }
  
  // Pre-order: Process current node FIRST
  // process(root.val);
  
  // Recursive calls
  const leftResult = dfsTree(root.left);
  
  // In-order: Process current node BETWEEN children
  // process(root.val);
  
  const rightResult = dfsTree(root.right);
  
  // Post-order: Process current node LAST
  // process(root.val);
  
  // Combine and return results
  return combine(leftResult, rightResult, root.val);
}`,
      cpp: `TreeNode* dfsTree(TreeNode* root) {
    /**
     * DFS Tree Traversal Template
     * Time: O(n), Space: O(h)
     */
    // Base case
    if (!root) {
        return nullptr;
    }
    
    // Pre-order: Process current node FIRST
    
    // Recursive calls
    auto leftResult = dfsTree(root->left);
    
    // In-order: Process current node BETWEEN
    
    auto rightResult = dfsTree(root->right);
    
    // Post-order: Process current node LAST
    
    return combine(leftResult, rightResult, root);
}`,
    },
    complexity: {
      time: "O(n)",
      space: "O(h)",
    },
    relatedProblems: [],
    prerequisites: [],
  },
  {
    id: "bfs-tree",
    name: "BFS Tree Traversal (Level Order)",
    category: "tree-traversal",
    description: `Breadth-First Search explores all nodes at the current depth before moving to the next level. It uses a queue and is perfect for level-order traversal, finding shortest paths, and problems that require processing level by level.`,
    difficulty: "intermediate",
    timeToLearn: "45 mins",
    interviewFrequency: 85,
    companies: ["Google", "Amazon", "Meta", "Microsoft"],
    whenToUse: [
      "Level order traversal",
      "Shortest path in unweighted trees",
      "Connecting nodes at same level",
      "Zigzag level order",
    ],
    keyIndicators: [
      "Level by level processing",
      "Shortest path needed",
      "Breadth exploration",
    ],
    template: {
      python: `from collections import deque

def bfs_tree(root):
    """
    BFS Tree - Level Order Template
    Time: O(n), Space: O(w) where w = max width
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        current_level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(current_level)
    
    return result`,
      javascript: `function bfsTree(root) {
  /**
   * BFS Tree - Level Order Template
   * Time: O(n), Space: O(w)
   */
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(currentLevel);
  }
  
  return result;
}`,
      cpp: `vector<vector<int>> bfsTree(TreeNode* root) {
    /**
     * BFS Tree - Level Order Template
     * Time: O(n), Space: O(w)
     */
    vector<vector<int>> result;
    if (!root) return result;
    
    queue<TreeNode*> q;
    q.push(root);
    
    while (!q.empty()) {
        int levelSize = q.size();
        vector<int> currentLevel;
        
        for (int i = 0; i < levelSize; i++) {
            TreeNode* node = q.front();
            q.pop();
            currentLevel.push_back(node->val);
            
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        
        result.push_back(currentLevel);
    }
    
    return result;
}`,
    },
    complexity: {
      time: "O(n)",
      space: "O(w)",
    },
    relatedProblems: [],
    prerequisites: [],
  },

  // ========== BACKTRACKING ==========
  {
    id: "backtracking-combinations",
    name: "Backtracking (Combinations)",
    category: "backtracking",
    description: `Backtracking is an algorithmic technique that explores all potential solutions by building candidates incrementally and abandoning ("backtracking") those that fail to satisfy constraints. This template is for generating combinations.`,
    difficulty: "advanced",
    timeToLearn: "1.5 hours",
    interviewFrequency: 80,
    companies: ["Google", "Amazon", "Meta", "Microsoft", "Apple"],
    whenToUse: [
      "Generate all combinations",
      "Combination sum problems",
      "Select k items from n",
      "Subset problems with constraints",
    ],
    keyIndicators: [
      "Generate all possible...",
      "Find all combinations",
      "Select without repetition",
    ],
    template: {
      python: `def backtrack_combinations(candidates, target):
    """
    Backtracking - Combinations Template
    Time: O(2^n) or O(n!), Space: O(n) for recursion
    """
    result = []
    
    def backtrack(start, current, remaining):
        # Base case: Found valid combination
        if remaining == 0:
            result.append(current[:])  # Make a copy!
            return
        
        # Pruning: Invalid state
        if remaining < 0:
            return
        
        # Explore candidates
        for i in range(start, len(candidates)):
            # Skip duplicates (if candidates has duplicates)
            # if i > start and candidates[i] == candidates[i-1]:
            #     continue
            
            # Choose
            current.append(candidates[i])
            
            # Explore (use i+1 to avoid reusing, use i to allow reuse)
            backtrack(i + 1, current, remaining - candidates[i])
            
            # Unchoose (backtrack)
            current.pop()
    
    # Sort if handling duplicates
    # candidates.sort()
    backtrack(0, [], target)
    return result`,
      javascript: `function backtrackCombinations(candidates, target) {
  /**
   * Backtracking - Combinations Template
   * Time: O(2^n) or O(n!), Space: O(n)
   */
  const result = [];
  
  function backtrack(start, current, remaining) {
    // Base case: Found valid combination
    if (remaining === 0) {
      result.push([...current]); // Make a copy!
      return;
    }
    
    // Pruning: Invalid state
    if (remaining < 0) return;
    
    // Explore candidates
    for (let i = start; i < candidates.length; i++) {
      // Skip duplicates if needed
      // if (i > start && candidates[i] === candidates[i-1]) continue;
      
      // Choose
      current.push(candidates[i]);
      
      // Explore
      backtrack(i + 1, current, remaining - candidates[i]);
      
      // Unchoose
      current.pop();
    }
  }
  
  backtrack(0, [], target);
  return result;
}`,
      cpp: `vector<vector<int>> backtrackCombinations(vector<int>& candidates, int target) {
    /**
     * Backtracking - Combinations Template
     * Time: O(2^n), Space: O(n)
     */
    vector<vector<int>> result;
    vector<int> current;
    
    function<void(int, int)> backtrack = [&](int start, int remaining) {
        if (remaining == 0) {
            result.push_back(current);
            return;
        }
        if (remaining < 0) return;
        
        for (int i = start; i < candidates.size(); i++) {
            current.push_back(candidates[i]);
            backtrack(i + 1, remaining - candidates[i]);
            current.pop_back();
        }
    };
    
    backtrack(0, target);
    return result;
}`,
    },
    complexity: {
      time: "O(2^n)",
      space: "O(n)",
    },
    relatedProblems: [],
    prerequisites: [],
  },

  // ========== STACK ==========
  {
    id: "monotonic-stack",
    name: "Monotonic Stack",
    category: "stack-queue",
    description: `A monotonic stack maintains elements in a strictly increasing or decreasing order. It's used to find the next greater/smaller element efficiently. Elements are popped from the stack when they would break the monotonic property.`,
    difficulty: "advanced",
    timeToLearn: "1 hour",
    interviewFrequency: 70,
    companies: ["Google", "Amazon", "Meta", "Microsoft"],
    whenToUse: [
      "Next greater element",
      "Next smaller element",
      "Stock span problems",
      "Largest rectangle in histogram",
    ],
    keyIndicators: [
      "Next greater/smaller element",
      "Looking forward/backward for specific value",
      "Temperature/stock price patterns",
    ],
    template: {
      python: `def monotonic_stack(nums):
    """
    Monotonic Stack Template - Next Greater Element
    Time: O(n), Space: O(n)
    """
    n = len(nums)
    result = [-1] * n  # Default: no greater element
    stack = []  # Stores indices
    
    for i in range(n):
        # Pop elements smaller than current (maintaining decreasing stack)
        while stack and nums[stack[-1]] < nums[i]:
            idx = stack.pop()
            result[idx] = nums[i]  # Found next greater for idx
        
        stack.append(i)
    
    return result

# Variation: Next Smaller Element (maintain increasing stack)
def next_smaller(nums):
    n = len(nums)
    result = [-1] * n
    stack = []
    
    for i in range(n):
        while stack and nums[stack[-1]] > nums[i]:
            idx = stack.pop()
            result[idx] = nums[i]
        stack.append(i)
    
    return result`,
      javascript: `function monotonicStack(nums) {
  /**
   * Monotonic Stack - Next Greater Element
   * Time: O(n), Space: O(n)
   */
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack = []; // Stores indices
  
  for (let i = 0; i < n; i++) {
    // Pop elements smaller than current
    while (stack.length && nums[stack[stack.length - 1]] < nums[i]) {
      const idx = stack.pop();
      result[idx] = nums[i];
    }
    stack.push(i);
  }
  
  return result;
}`,
      cpp: `vector<int> monotonicStack(vector<int>& nums) {
    /**
     * Monotonic Stack - Next Greater Element
     * Time: O(n), Space: O(n)
     */
    int n = nums.size();
    vector<int> result(n, -1);
    stack<int> st; // Stores indices
    
    for (int i = 0; i < n; i++) {
        while (!st.empty() && nums[st.top()] < nums[i]) {
            int idx = st.top();
            st.pop();
            result[idx] = nums[i];
        }
        st.push(i);
    }
    
    return result;
}`,
    },
    complexity: {
      time: "O(n)",
      space: "O(n)",
    },
    relatedProblems: ["valid-parentheses"],
    prerequisites: ["stack-parentheses"],
  },
  {
    id: "stack-parentheses",
    name: "Stack for Parentheses",
    category: "stack-queue",
    description: `Using a stack to validate or process parentheses is a fundamental pattern. The stack helps match opening brackets with their corresponding closing brackets in the correct order.`,
    difficulty: "beginner",
    timeToLearn: "30 mins",
    interviewFrequency: 80,
    companies: ["Google", "Amazon", "Meta", "Microsoft", "Apple"],
    whenToUse: [
      "Validating parentheses",
      "Matching brackets",
      "Parsing expressions",
      "Calculator problems",
    ],
    keyIndicators: [
      "Brackets or parentheses",
      "Matching pairs",
      "LIFO processing needed",
    ],
    template: {
      python: `def valid_parentheses(s):
    """
    Stack - Parentheses Validation Template
    Time: O(n), Space: O(n)
    """
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in mapping:  # Closing bracket
            if not stack or stack[-1] != mapping[char]:
                return False
            stack.pop()
        else:  # Opening bracket
            stack.append(char)
    
    return len(stack) == 0`,
      javascript: `function validParentheses(s) {
  /**
   * Stack - Parentheses Validation Template
   * Time: O(n), Space: O(n)
   */
  const stack = [];
  const mapping = { ')': '(', '}': '{', ']': '[' };
  
  for (const char of s) {
    if (char in mapping) { // Closing bracket
      if (!stack.length || stack[stack.length - 1] !== mapping[char]) {
        return false;
      }
      stack.pop();
    } else { // Opening bracket
      stack.push(char);
    }
  }
  
  return stack.length === 0;
}`,
      cpp: `bool validParentheses(string s) {
    /**
     * Stack - Parentheses Validation Template
     * Time: O(n), Space: O(n)
     */
    stack<char> st;
    unordered_map<char, char> mapping = {
        {')', '('}, {'}', '{'}, {']', '['}
    };
    
    for (char c : s) {
        if (mapping.count(c)) { // Closing bracket
            if (st.empty() || st.top() != mapping[c]) {
                return false;
            }
            st.pop();
        } else { // Opening bracket
            st.push(c);
        }
    }
    
    return st.empty();
}`,
    },
    complexity: {
      time: "O(n)",
      space: "O(n)",
    },
    relatedProblems: ["valid-parentheses"],
    prerequisites: [],
  },

  // ========== DYNAMIC PROGRAMMING ==========
  {
    id: "dp-1d",
    name: "Dynamic Programming (1D)",
    category: "dynamic-programming",
    description: `1D Dynamic Programming uses a single array to store subproblem solutions. It's used when the problem can be broken down into overlapping subproblems where each state depends only on previous states in a single dimension.`,
    difficulty: "advanced",
    timeToLearn: "2 hours",
    interviewFrequency: 85,
    companies: ["Google", "Amazon", "Meta", "Microsoft", "Apple"],
    whenToUse: [
      "Fibonacci-like sequences",
      "Climbing stairs",
      "House robber problems",
      "Minimum cost path (1D)",
    ],
    keyIndicators: [
      "Optimal substructure",
      "Overlapping subproblems",
      "State depends on previous elements",
    ],
    template: {
      python: `def dp_1d(nums):
    """
    1D Dynamic Programming Template
    Time: O(n), Space: O(n) or O(1) with optimization
    """
    n = len(nums)
    if n == 0:
        return 0
    
    # Initialize DP array
    dp = [0] * n
    
    # Base cases
    dp[0] = nums[0]  # Adjust based on problem
    if n > 1:
        dp[1] = max(nums[0], nums[1])  # Example: house robber
    
    # Fill DP table
    for i in range(2, n):
        # Recurrence relation - adapt to your problem
        dp[i] = max(dp[i-1], dp[i-2] + nums[i])
    
    return dp[n-1]

# Space-optimized version (when only need last few states)
def dp_1d_optimized(nums):
    n = len(nums)
    if n == 0:
        return 0
    if n == 1:
        return nums[0]
    
    prev2 = nums[0]
    prev1 = max(nums[0], nums[1])
    
    for i in range(2, n):
        current = max(prev1, prev2 + nums[i])
        prev2 = prev1
        prev1 = current
    
    return prev1`,
      javascript: `function dp1D(nums) {
  /**
   * 1D Dynamic Programming Template
   * Time: O(n), Space: O(n) or O(1)
   */
  const n = nums.length;
  if (n === 0) return 0;
  
  const dp = new Array(n).fill(0);
  
  // Base cases
  dp[0] = nums[0];
  if (n > 1) dp[1] = Math.max(nums[0], nums[1]);
  
  // Fill DP table
  for (let i = 2; i < n; i++) {
    dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i]);
  }
  
  return dp[n-1];
}`,
      cpp: `int dp1D(vector<int>& nums) {
    /**
     * 1D Dynamic Programming Template
     * Time: O(n), Space: O(n)
     */
    int n = nums.size();
    if (n == 0) return 0;
    
    vector<int> dp(n, 0);
    
    dp[0] = nums[0];
    if (n > 1) dp[1] = max(nums[0], nums[1]);
    
    for (int i = 2; i < n; i++) {
        dp[i] = max(dp[i-1], dp[i-2] + nums[i]);
    }
    
    return dp[n-1];
}`,
    },
    complexity: {
      time: "O(n)",
      space: "O(n)",
    },
    relatedProblems: ["max-subarray"],
    prerequisites: [],
  },
];

// Helper functions
export const getPatternById = (id: string) => PATTERNS.find((p) => p.id === id);

export const getPatternsByCategory = (categoryId: string) =>
  PATTERNS.filter((p) => p.category === categoryId);

export const getCategoryById = (id: string) =>
  PATTERN_CATEGORIES.find((c) => c.id === id);

export const getAllPatternTags = () => {
  const tags = new Set<string>();
  PATTERNS.forEach((p) => {
    tags.add(p.category);
    p.companies.forEach((c) => tags.add(c));
  });
  return Array.from(tags);
};

export const getPatternsByCompany = (company: string) =>
  PATTERNS.filter((p) => p.companies.includes(company));

export const getHighFrequencyPatterns = () =>
  PATTERNS.filter((p) => p.interviewFrequency >= 80).sort(
    (a, b) => b.interviewFrequency - a.interviewFrequency
  );
