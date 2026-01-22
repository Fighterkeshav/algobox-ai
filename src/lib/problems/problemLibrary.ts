// Practice Problems Library
// Collection of coding challenges for the Practice tab

export interface Problem {
    id: string;
    title: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    category: string;
    description: string;
    examples: {
        input: string;
        output: string;
        explanation?: string;
    }[];
    constraints: string[];
    hints: string[];
    tags: string[];
    starterCode: {
        python: string;
        javascript: string;
        cpp: string;
    };
    testCases: {
        input: string;
        expected: string;
    }[];
}

export const PROBLEMS: Problem[] = [
    // ========== BEGINNER ==========
    {
        id: "two-sum",
        title: "Two Sum",
        difficulty: "beginner",
        category: "Arrays",
        description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
        examples: [
            { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
            { input: "nums = [3,2,4], target = 6", output: "[1,2]", explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]." },
        ],
        constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "Only one valid answer exists."],
        hints: ["Try using a hash map to store values you've seen.", "For each element, check if target - element exists in the hash map."],
        tags: ["Array", "Hash Table"],
        starterCode: {
            python: `def twoSum(nums, target):
    # Your solution here
    pass

# Input parsing
import json
line = input().strip()
idx = line.rfind('],')
nums = json.loads(line[:idx+1])
target = int(line[idx+2:].strip())
result = twoSum(nums, target)
print(json.dumps(result, separators=(',', ':')))`,
            javascript: `function twoSum(nums, target) {
    // Your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    const idx = line.lastIndexOf('],');
    const nums = JSON.parse(line.slice(0, idx + 1));
    const target = parseInt(line.slice(idx + 2).trim());
    console.log(JSON.stringify(twoSum(nums, target)));
    rl.close();
});`,
            cpp: `#include <iostream>
#include <vector>
#include <sstream>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Your solution here
    return {};
}

int main() {
    string line; getline(cin, line);
    size_t end = line.rfind(']');
    string arr = line.substr(1, end - 1);
    int target = stoi(line.substr(end + 2));
    vector<int> nums;
    stringstream ss(arr); string t;
    while (getline(ss, t, ',')) nums.push_back(stoi(t));
    auto r = twoSum(nums, target);
    cout << "[" << r[0] << "," << r[1] << "]" << endl;
}`,
        },
        testCases: [
            { input: "[2,7,11,15], 9", expected: "[0,1]" },
            { input: "[3,2,4], 6", expected: "[1,2]" },
            { input: "[3,3], 6", expected: "[0,1]" },
        ],
    },
    {
        id: "reverse-string",
        title: "Reverse String",
        difficulty: "beginner",
        category: "Strings",
        description: `Write a function that reverses a string. The input string is given as an array of characters \`s\`.

You must do this by modifying the input array in-place with O(1) extra memory.`,
        examples: [
            { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
            { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' },
        ],
        constraints: ["1 <= s.length <= 10^5", "s[i] is a printable ascii character."],
        hints: ["Use two pointers, one at start and one at end.", "Swap characters and move pointers towards center."],
        tags: ["String", "Two Pointers"],
        starterCode: {
            python: `def reverseString(s):
    # Your solution here - modify s in-place
    pass

import json
s = json.loads(input().strip())
reverseString(s)
print(json.dumps(s, separators=(',', ':')))`,
            javascript: `function reverseString(s) {
    // Your solution here - modify s in-place
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    const s = JSON.parse(line);
    reverseString(s);
    console.log(JSON.stringify(s));
    rl.close();
});`,
            cpp: `#include <iostream>
#include <vector>
#include <sstream>
using namespace std;

void reverseString(vector<char>& s) {
    // Your solution here
}

int main() {
    string line; getline(cin, line);
    vector<char> s;
    for (int i = 2; i < line.size() - 1; i += 4) s.push_back(line[i]);
    reverseString(s);
    cout << "[";
    for (int i = 0; i < s.size(); i++) cout << "\\"" << s[i] << "\\"" << (i < s.size()-1 ? "," : "");
    cout << "]" << endl;
}`,
        },
        testCases: [
            { input: '["h","e","l","l","o"]', expected: '["o","l","l","e","h"]' },
            { input: '["H","a","n","n","a","h"]', expected: '["h","a","n","n","a","H"]' },
        ],
    },
    {
        id: "palindrome-number",
        title: "Palindrome Number",
        difficulty: "beginner",
        category: "Math",
        description: `Given an integer \`x\`, return \`true\` if \`x\` is a palindrome, and \`false\` otherwise.

An integer is a palindrome when it reads the same forward and backward.`,
        examples: [
            { input: "x = 121", output: "true", explanation: "121 reads as 121 from left to right and from right to left." },
            { input: "x = -121", output: "false", explanation: "From left to right, it reads -121. From right to left, it becomes 121-." },
            { input: "x = 10", output: "false", explanation: "Reads 01 from right to left." },
        ],
        constraints: ["-2^31 <= x <= 2^31 - 1"],
        hints: ["Negative numbers are not palindromes.", "Try reversing half of the number."],
        tags: ["Math"],
        starterCode: {
            python: `def isPalindrome(x):
    # Your solution here
    pass

x = int(input().strip())
print("true" if isPalindrome(x) else "false")`,
            javascript: `function isPalindrome(x) {
    // Your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    console.log(isPalindrome(parseInt(line)) ? "true" : "false");
    rl.close();
});`,
            cpp: `#include <iostream>
using namespace std;

bool isPalindrome(int x) {
    // Your solution here
    return false;
}

int main() {
    int x; cin >> x;
    cout << (isPalindrome(x) ? "true" : "false") << endl;
}`,
        },
        testCases: [
            { input: "121", expected: "true" },
            { input: "-121", expected: "false" },
            { input: "10", expected: "false" },
        ],
    },
    {
        id: "fizzbuzz",
        title: "FizzBuzz",
        difficulty: "beginner",
        category: "Simulation",
        description: `Given an integer \`n\`, return a string array \`answer\` (1-indexed) where:
- answer[i] == "FizzBuzz" if i is divisible by 3 and 5.
- answer[i] == "Fizz" if i is divisible by 3.
- answer[i] == "Buzz" if i is divisible by 5.
- answer[i] == i (as a string) if none of the above conditions are true.`,
        examples: [
            { input: "n = 3", output: '["1","2","Fizz"]' },
            { input: "n = 5", output: '["1","2","Fizz","4","Buzz"]' },
        ],
        constraints: ["1 <= n <= 10^4"],
        hints: ["Check divisibility by 15 first, then 3, then 5."],
        tags: ["Math", "String", "Simulation"],
        starterCode: {
            python: `def fizzBuzz(n):
    # Your solution here
    pass

import json
n = int(input().strip())
print(json.dumps(fizzBuzz(n), separators=(',', ':')))`,
            javascript: `function fizzBuzz(n) {
    // Your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    console.log(JSON.stringify(fizzBuzz(parseInt(line))));
    rl.close();
});`,
            cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

vector<string> fizzBuzz(int n) {
    // Your solution here
    return {};
}

int main() {
    int n; cin >> n;
    auto r = fizzBuzz(n);
    cout << "[";
    for (int i = 0; i < r.size(); i++) cout << "\\"" << r[i] << "\\"" << (i < r.size()-1 ? "," : "");
    cout << "]" << endl;
}`,
        },
        testCases: [
            { input: "3", expected: '["1","2","Fizz"]' },
            { input: "5", expected: '["1","2","Fizz","4","Buzz"]' },
            { input: "15", expected: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]' },
        ],
    },

    // ========== INTERMEDIATE ==========
    {
        id: "valid-parentheses",
        title: "Valid Parentheses",
        difficulty: "intermediate",
        category: "Stack",
        description: `Given a string \`s\` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
        examples: [
            { input: 's = "()"', output: "true" },
            { input: 's = "()[]{}"', output: "true" },
            { input: 's = "(]"', output: "false" },
        ],
        constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'."],
        hints: ["Use a stack to keep track of opening brackets.", "When you see a closing bracket, check if it matches the top of the stack."],
        tags: ["String", "Stack"],
        starterCode: {
            python: `def isValid(s):
    # Your solution here
    pass

s = input().strip()
print("true" if isValid(s) else "false")`,
            javascript: `function isValid(s) {
    // Your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    console.log(isValid(line) ? "true" : "false");
    rl.close();
});`,
            cpp: `#include <iostream>
#include <stack>
using namespace std;

bool isValid(string s) {
    // Your solution here
    return false;
}

int main() {
    string s; getline(cin, s);
    cout << (isValid(s) ? "true" : "false") << endl;
}`,
        },
        testCases: [
            { input: "()", expected: "true" },
            { input: "()[]{}", expected: "true" },
            { input: "(]", expected: "false" },
            { input: "([)]", expected: "false" },
            { input: "{[]}", expected: "true" },
        ],
    },
    {
        id: "max-subarray",
        title: "Maximum Subarray",
        difficulty: "intermediate",
        category: "Dynamic Programming",
        description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.

A subarray is a contiguous non-empty sequence of elements within an array.`,
        examples: [
            { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
            { input: "nums = [1]", output: "1" },
            { input: "nums = [5,4,-1,7,8]", output: "23" },
        ],
        constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
        hints: ["Kadane's algorithm can solve this in O(n).", "At each position, decide: start new subarray or extend current one."],
        tags: ["Array", "Dynamic Programming", "Divide and Conquer"],
        starterCode: {
            python: `def maxSubArray(nums):
    # Your solution here
    pass

import json
nums = json.loads(input().strip())
print(maxSubArray(nums))`,
            javascript: `function maxSubArray(nums) {
    // Your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    console.log(maxSubArray(JSON.parse(line)));
    rl.close();
});`,
            cpp: `#include <iostream>
#include <vector>
#include <sstream>
using namespace std;

int maxSubArray(vector<int>& nums) {
    // Your solution here
    return 0;
}

int main() {
    string line; getline(cin, line);
    vector<int> nums;
    stringstream ss(line.substr(1, line.size()-2));
    string t;
    while (getline(ss, t, ',')) nums.push_back(stoi(t));
    cout << maxSubArray(nums) << endl;
}`,
        },
        testCases: [
            { input: "[-2,1,-3,4,-1,2,1,-5,4]", expected: "6" },
            { input: "[1]", expected: "1" },
            { input: "[5,4,-1,7,8]", expected: "23" },
        ],
    },
    {
        id: "merge-sorted-arrays",
        title: "Merge Two Sorted Lists",
        difficulty: "intermediate",
        category: "Linked Lists",
        description: `You are given two integer arrays \`nums1\` and \`nums2\`, sorted in non-decreasing order, and two integers \`m\` and \`n\`, representing the number of elements in \`nums1\` and \`nums2\` respectively.

Merge \`nums1\` and \`nums2\` into a single array sorted in non-decreasing order.

The final sorted array should not be returned by the function, but instead be stored inside the array \`nums1\`.`,
        examples: [
            { input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3", output: "[1,2,2,3,5,6]" },
            { input: "nums1 = [1], m = 1, nums2 = [], n = 0", output: "[1]" },
        ],
        constraints: ["nums1.length == m + n", "nums2.length == n", "0 <= m, n <= 200"],
        hints: ["Start from the end of both arrays.", "Compare and place the larger element at the end of nums1."],
        tags: ["Array", "Two Pointers", "Sorting"],
        starterCode: {
            python: `def merge(nums1, m, nums2, n):
    # Your solution here - modify nums1 in-place
    pass

import json
line = input().strip()
# Parse: "[1,2,3,0,0,0], 3, [2,5,6], 3"
parts = line.split('], ')
nums1 = json.loads(parts[0] + ']')
rest = parts[1].split(', [')
m = int(rest[0])
nums2 = json.loads('[' + rest[1].split('], ')[0] + ']')
n = int(rest[1].split('], ')[1])
merge(nums1, m, nums2, n)
print(json.dumps(nums1, separators=(',', ':')))`,
            javascript: `function merge(nums1, m, nums2, n) {
    // Your solution here - modify nums1 in-place
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    // Parse: "[1,2,3,0,0,0], 3, [2,5,6], 3"
    const match = line.match(/\\[([^\\]]*)\\], (\\d+), \\[([^\\]]*)\\], (\\d+)/);
    const nums1 = match[1] ? match[1].split(',').map(Number) : [];
    const m = parseInt(match[2]);
    const nums2 = match[3] ? match[3].split(',').map(Number) : [];
    const n = parseInt(match[4]);
    merge(nums1, m, nums2, n);
    console.log(JSON.stringify(nums1));
    rl.close();
});`,
            cpp: `#include <iostream>
#include <vector>
using namespace std;

void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
    // Your solution here
}

int main() {
    // Simplified: just two arrays
    vector<int> nums1 = {1,2,3,0,0,0};
    vector<int> nums2 = {2,5,6};
    merge(nums1, 3, nums2, 3);
    cout << "[";
    for (int i = 0; i < nums1.size(); i++) cout << nums1[i] << (i < nums1.size()-1 ? "," : "");
    cout << "]" << endl;
}`,
        },
        testCases: [
            { input: "[1,2,3,0,0,0], 3, [2,5,6], 3", expected: "[1,2,2,3,5,6]" },
            { input: "[1], 1, [], 0", expected: "[1]" },
        ],
    },
    {
        id: "binary-search",
        title: "Binary Search",
        difficulty: "intermediate",
        category: "Binary Search",
        description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with O(log n) runtime complexity.`,
        examples: [
            { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" },
            { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1" },
        ],
        constraints: ["1 <= nums.length <= 10^4", "-10^4 < nums[i], target < 10^4", "All integers in nums are unique.", "nums is sorted in ascending order."],
        hints: ["Use two pointers: left and right.", "Calculate mid and compare nums[mid] with target."],
        tags: ["Array", "Binary Search"],
        starterCode: {
            python: `def search(nums, target):
    # Your solution here
    pass

import json
line = input().strip()
idx = line.rfind('],')
nums = json.loads(line[:idx+1])
target = int(line[idx+2:].strip())
print(search(nums, target))`,
            javascript: `function search(nums, target) {
    // Your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    const idx = line.lastIndexOf('],');
    const nums = JSON.parse(line.slice(0, idx + 1));
    const target = parseInt(line.slice(idx + 2).trim());
    console.log(search(nums, target));
    rl.close();
});`,
            cpp: `#include <iostream>
#include <vector>
#include <sstream>
using namespace std;

int search(vector<int>& nums, int target) {
    // Your solution here
    return -1;
}

int main() {
    string line; getline(cin, line);
    size_t end = line.rfind(']');
    string arr = line.substr(1, end - 1);
    int target = stoi(line.substr(end + 2));
    vector<int> nums;
    stringstream ss(arr);
    string t;
    while (getline(ss, t, ',')) nums.push_back(stoi(t));
    cout << search(nums, target) << endl;
}`,
        },
        testCases: [
            { input: "[-1,0,3,5,9,12], 9", expected: "4" },
            { input: "[-1,0,3,5,9,12], 2", expected: "-1" },
        ],
    },

    // ========== ADVANCED ==========
    {
        id: "longest-substring",
        title: "Longest Substring Without Repeating Characters",
        difficulty: "advanced",
        category: "Sliding Window",
        description: `Given a string \`s\`, find the length of the longest substring without repeating characters.`,
        examples: [
            { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with the length of 3.' },
            { input: 's = "bbbbb"', output: "1", explanation: 'The answer is "b", with the length of 1.' },
            { input: 's = "pwwkew"', output: "3", explanation: 'The answer is "wke", with the length of 3.' },
        ],
        constraints: ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces."],
        hints: ["Use sliding window technique.", "Keep track of character positions with a hash map."],
        tags: ["Hash Table", "String", "Sliding Window"],
        starterCode: {
            python: `def lengthOfLongestSubstring(s):
    # Your solution here
    pass

s = input().strip()
print(lengthOfLongestSubstring(s))`,
            javascript: `function lengthOfLongestSubstring(s) {
    // Your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    console.log(lengthOfLongestSubstring(line));
    rl.close();
});`,
            cpp: `#include <iostream>
#include <string>
using namespace std;

int lengthOfLongestSubstring(string s) {
    // Your solution here
    return 0;
}

int main() {
    string s; getline(cin, s);
    cout << lengthOfLongestSubstring(s) << endl;
}`,
        },
        testCases: [
            { input: "abcabcbb", expected: "3" },
            { input: "bbbbb", expected: "1" },
            { input: "pwwkew", expected: "3" },
        ],
    },
    {
        id: "container-water",
        title: "Container With Most Water",
        difficulty: "advanced",
        category: "Two Pointers",
        description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i\`-th line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.`,
        examples: [
            { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49", explanation: "The max area is between indices 1 and 8." },
            { input: "height = [1,1]", output: "1" },
        ],
        constraints: ["n == height.length", "2 <= n <= 10^5", "0 <= height[i] <= 10^4"],
        hints: ["Use two pointers, one at start and one at end.", "Move the pointer with smaller height inward."],
        tags: ["Array", "Two Pointers", "Greedy"],
        starterCode: {
            python: `def maxArea(height):
    # Your solution here
    pass

import json
height = json.loads(input().strip())
print(maxArea(height))`,
            javascript: `function maxArea(height) {
    // Your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    console.log(maxArea(JSON.parse(line)));
    rl.close();
});`,
            cpp: `#include <iostream>
#include <vector>
#include <sstream>
using namespace std;

int maxArea(vector<int>& height) {
    // Your solution here
    return 0;
}

int main() {
    string line; getline(cin, line);
    vector<int> h;
    stringstream ss(line.substr(1, line.size()-2));
    string t;
    while (getline(ss, t, ',')) h.push_back(stoi(t));
    cout << maxArea(h) << endl;
}`,
        },
        testCases: [
            { input: "[1,8,6,2,5,4,8,3,7]", expected: "49" },
            { input: "[1,1]", expected: "1" },
        ],
    },
    {
        id: "three-sum",
        title: "3Sum",
        difficulty: "advanced",
        category: "Arrays",
        description: `Given an integer array nums, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets.`,
        examples: [
            { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" },
            { input: "nums = [0,1,1]", output: "[]" },
            { input: "nums = [0,0,0]", output: "[[0,0,0]]" },
        ],
        constraints: ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],
        hints: ["Sort the array first.", "Fix one element and use two pointers for the remaining two."],
        tags: ["Array", "Two Pointers", "Sorting"],
        starterCode: {
            python: `def threeSum(nums):
    # Your solution here
    pass

import json
nums = json.loads(input().strip())
result = threeSum(nums)
print(json.dumps(result, separators=(',', ':')))`,
            javascript: `function threeSum(nums) {
    // Your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    console.log(JSON.stringify(threeSum(JSON.parse(line))));
    rl.close();
});`,
            cpp: `#include <iostream>
#include <vector>
#include <algorithm>
#include <sstream>
using namespace std;

vector<vector<int>> threeSum(vector<int>& nums) {
    // Your solution here
    return {};
}

int main() {
    string line; getline(cin, line);
    vector<int> nums;
    stringstream ss(line.substr(1, line.size()-2));
    string t;
    while (getline(ss, t, ',')) nums.push_back(stoi(t));
    auto r = threeSum(nums);
    cout << "[";
    for (int i = 0; i < r.size(); i++) {
        cout << "[" << r[i][0] << "," << r[i][1] << "," << r[i][2] << "]";
        if (i < r.size()-1) cout << ",";
    }
    cout << "]" << endl;
}`,
        },
        testCases: [
            { input: "[-1,0,1,2,-1,-4]", expected: "[[-1,-1,2],[-1,0,1]]" },
            { input: "[0,1,1]", expected: "[]" },
            { input: "[0,0,0]", expected: "[[0,0,0]]" },
        ],
    },
];

// Helper function to get problems by difficulty
export const getProblemsByDifficulty = (difficulty: string) =>
    PROBLEMS.filter((p) => p.difficulty === difficulty);

// Helper function to get problems by category
export const getProblemsByCategory = (category: string) =>
    PROBLEMS.filter((p) => p.category === category);

// Get unique categories
export const getCategories = () => [...new Set(PROBLEMS.map((p) => p.category))];
