// Practice Problems Library
// Collection of coding challenges for the Practice tab

export interface Problem {
    id: string;
    title: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    category: string;
    description: string;
    solutionStructure?: string;
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
        id: "climbing-stairs",
        title: "Climbing Stairs",
        difficulty: "beginner",
        category: "Dynamic Programming",
        description: `You are climbing a staircase. It takes \`n\` steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
        examples: [{ input: "n = 2", output: "2", explanation: "1+1 or 2" }, { input: "n = 3", output: "3" }],
        constraints: ["1 <= n <= 45"],
        hints: ["Think Fibonacci.", "dp[i] = dp[i-1] + dp[i-2]"],
        tags: ["Math", "Dynamic Programming"],
        starterCode: {
            python: `def climbStairs(n):\n    pass\n\nprint(climbStairs(int(input())))`,
            javascript: `function climbStairs(n) {}\nconst rl = require('readline').createInterface({input:process.stdin});\nrl.on('line',l=>{console.log(climbStairs(+l));rl.close();});`,
            cpp: `#include<iostream>\nusing namespace std;\nint climbStairs(int n){return 0;}\nint main(){int n;cin>>n;cout<<climbStairs(n)<<endl;}`,
        },
        testCases: [{ input: "2", expected: "2" }, { input: "3", expected: "3" }, { input: "10", expected: "89" }],
    },
    {
        id: "best-time-stock",
        title: "Best Time to Buy and Sell Stock",
        difficulty: "beginner",
        category: "Arrays",
        description: `Given an array \`prices\` where \`prices[i]\` is the price of a stock on day \`i\`, return the maximum profit from a single buy-sell transaction. Return 0 if no profit is possible.`,
        examples: [{ input: "prices = [7,1,5,3,6,4]", output: "5" }, { input: "prices = [7,6,4,3,1]", output: "0" }],
        constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
        hints: ["Track minimum price seen so far.", "Profit at each day = price - min_so_far"],
        tags: ["Array", "Greedy"],
        starterCode: {
            python: `def maxProfit(prices):\n    pass\n\nimport json\nprint(maxProfit(json.loads(input())))`,
            javascript: `function maxProfit(prices){}\nconst rl=require('readline').createInterface({input:process.stdin});\nrl.on('line',l=>{console.log(maxProfit(JSON.parse(l)));rl.close();});`,
            cpp: `#include<iostream>\n#include<vector>\n#include<sstream>\nusing namespace std;\nint maxProfit(vector<int>&p){return 0;}\nint main(){string l;getline(cin,l);vector<int>p;stringstream ss(l.substr(1,l.size()-2));string t;while(getline(ss,t,','))p.push_back(stoi(t));cout<<maxProfit(p)<<endl;}`,
        },
        testCases: [{ input: "[7,1,5,3,6,4]", expected: "5" }, { input: "[7,6,4,3,1]", expected: "0" }, { input: "[1,2]", expected: "1" }],
    },
    {
        id: "contains-duplicate",
        title: "Contains Duplicate",
        difficulty: "beginner",
        category: "Arrays",
        description: `Given an integer array \`nums\`, return \`true\` if any value appears at least twice, and \`false\` if every element is distinct.`,
        examples: [{ input: "[1,2,3,1]", output: "true" }, { input: "[1,2,3,4]", output: "false" }],
        constraints: ["1 <= nums.length <= 10^5"],
        hints: ["Use a hash set.", "If inserting an element that already exists, return true."],
        tags: ["Array", "Hash Table"],
        starterCode: {
            python: `def containsDuplicate(nums):\n    pass\n\nimport json\nprint('true' if containsDuplicate(json.loads(input())) else 'false')`,
            javascript: `function containsDuplicate(nums){}\nconst rl=require('readline').createInterface({input:process.stdin});\nrl.on('line',l=>{console.log(containsDuplicate(JSON.parse(l))?'true':'false');rl.close();});`,
            cpp: `#include<iostream>\n#include<vector>\n#include<unordered_set>\n#include<sstream>\nusing namespace std;\nbool containsDuplicate(vector<int>&n){return false;}\nint main(){string l;getline(cin,l);vector<int>n;stringstream ss(l.substr(1,l.size()-2));string t;while(getline(ss,t,','))n.push_back(stoi(t));cout<<(containsDuplicate(n)?"true":"false")<<endl;}`,
        },
        testCases: [{ input: "[1,2,3,1]", expected: "true" }, { input: "[1,2,3,4]", expected: "false" }, { input: "[1,1,1,3,3,4,3,2,4,2]", expected: "true" }],
    },
    {
        id: "move-zeroes",
        title: "Move Zeroes",
        difficulty: "beginner",
        category: "Arrays",
        description: `Given an integer array \`nums\`, move all 0s to the end while maintaining the relative order of non-zero elements. Do it in-place.`,
        examples: [{ input: "[0,1,0,3,12]", output: "[1,3,12,0,0]" }, { input: "[0]", output: "[0]" }],
        constraints: ["1 <= nums.length <= 10^4"],
        hints: ["Use two pointers.", "Place non-zero elements at the write pointer, fill rest with zeros."],
        tags: ["Array", "Two Pointers"],
        starterCode: {
            python: `def moveZeroes(nums):\n    pass\n\nimport json\nnums=json.loads(input())\nmoveZeroes(nums)\nprint(json.dumps(nums,separators=(',',':')))`,
            javascript: `function moveZeroes(nums){}\nconst rl=require('readline').createInterface({input:process.stdin});\nrl.on('line',l=>{const n=JSON.parse(l);moveZeroes(n);console.log(JSON.stringify(n));rl.close();});`,
            cpp: `#include<iostream>\n#include<vector>\n#include<sstream>\nusing namespace std;\nvoid moveZeroes(vector<int>&n){}\nint main(){string l;getline(cin,l);vector<int>n;stringstream ss(l.substr(1,l.size()-2));string t;while(getline(ss,t,','))n.push_back(stoi(t));moveZeroes(n);cout<<"[";for(int i=0;i<n.size();i++)cout<<n[i]<<(i<n.size()-1?",":"");cout<<"]"<<endl;}`,
        },
        testCases: [{ input: "[0,1,0,3,12]", expected: "[1,3,12,0,0]" }, { input: "[0]", expected: "[0]" }],
    },
    {
        id: "single-number",
        title: "Single Number",
        difficulty: "beginner",
        category: "Bit Manipulation",
        description: `Given a non-empty array of integers \`nums\`, every element appears twice except for one. Find that single one. You must use O(1) extra space.`,
        examples: [{ input: "[2,2,1]", output: "1" }, { input: "[4,1,2,1,2]", output: "4" }],
        constraints: ["1 <= nums.length <= 3*10^4"],
        hints: ["XOR of a number with itself is 0.", "XOR all elements together."],
        tags: ["Array", "Bit Manipulation"],
        starterCode: {
            python: `def singleNumber(nums):\n    pass\n\nimport json\nprint(singleNumber(json.loads(input())))`,
            javascript: `function singleNumber(nums){}\nconst rl=require('readline').createInterface({input:process.stdin});\nrl.on('line',l=>{console.log(singleNumber(JSON.parse(l)));rl.close();});`,
            cpp: `#include<iostream>\n#include<vector>\n#include<sstream>\nusing namespace std;\nint singleNumber(vector<int>&n){return 0;}\nint main(){string l;getline(cin,l);vector<int>n;stringstream ss(l.substr(1,l.size()-2));string t;while(getline(ss,t,','))n.push_back(stoi(t));cout<<singleNumber(n)<<endl;}`,
        },
        testCases: [{ input: "[2,2,1]", expected: "1" }, { input: "[4,1,2,1,2]", expected: "4" }, { input: "[1]", expected: "1" }],
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
    {
        id: "product-except-self",
        title: "Product of Array Except Self",
        difficulty: "intermediate",
        category: "Arrays",
        description: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is the product of all elements except \`nums[i]\`. Must run in O(n) without division.`,
        examples: [{ input: "[1,2,3,4]", output: "[24,12,8,6]" }, { input: "[-1,1,0,-3,3]", output: "[0,0,9,0,0]" }],
        constraints: ["2 <= nums.length <= 10^5", "-30 <= nums[i] <= 30"],
        hints: ["Use prefix and suffix product arrays.", "Left pass then right pass."],
        tags: ["Array", "Prefix Sum"],
        starterCode: {
            python: `def productExceptSelf(nums):\n    pass\n\nimport json\nprint(json.dumps(productExceptSelf(json.loads(input())),separators=(',',':')))`,
            javascript: `function productExceptSelf(nums){}\nconst rl=require('readline').createInterface({input:process.stdin});\nrl.on('line',l=>{console.log(JSON.stringify(productExceptSelf(JSON.parse(l))));rl.close();});`,
            cpp: `#include<iostream>\n#include<vector>\n#include<sstream>\nusing namespace std;\nvector<int> productExceptSelf(vector<int>&n){return {};}\nint main(){string l;getline(cin,l);vector<int>n;stringstream ss(l.substr(1,l.size()-2));string t;while(getline(ss,t,','))n.push_back(stoi(t));auto r=productExceptSelf(n);cout<<"[";for(int i=0;i<r.size();i++)cout<<r[i]<<(i<r.size()-1?",":"");cout<<"]"<<endl;}`,
        },
        testCases: [{ input: "[1,2,3,4]", expected: "[24,12,8,6]" }, { input: "[-1,1,0,-3,3]", expected: "[0,0,9,0,0]" }],
    },
    {
        id: "find-min-rotated",
        title: "Find Minimum in Rotated Sorted Array",
        difficulty: "intermediate",
        category: "Binary Search",
        description: `Given a sorted array rotated between 1 and n times, find the minimum element. Must run in O(log n).`,
        examples: [{ input: "[3,4,5,1,2]", output: "1" }, { input: "[4,5,6,7,0,1,2]", output: "0" }],
        constraints: ["n == nums.length", "1 <= n <= 5000", "All integers are unique."],
        hints: ["Use binary search.", "If mid > right, minimum is in right half."],
        tags: ["Array", "Binary Search"],
        starterCode: {
            python: `def findMin(nums):\n    pass\n\nimport json\nprint(findMin(json.loads(input())))`,
            javascript: `function findMin(nums){}\nconst rl=require('readline').createInterface({input:process.stdin});\nrl.on('line',l=>{console.log(findMin(JSON.parse(l)));rl.close();});`,
            cpp: `#include<iostream>\n#include<vector>\n#include<sstream>\nusing namespace std;\nint findMin(vector<int>&n){return 0;}\nint main(){string l;getline(cin,l);vector<int>n;stringstream ss(l.substr(1,l.size()-2));string t;while(getline(ss,t,','))n.push_back(stoi(t));cout<<findMin(n)<<endl;}`,
        },
        testCases: [{ input: "[3,4,5,1,2]", expected: "1" }, { input: "[4,5,6,7,0,1,2]", expected: "0" }, { input: "[11,13,15,17]", expected: "11" }],
    },
    {
        id: "number-of-islands",
        title: "Number of Islands",
        difficulty: "intermediate",
        category: "Graph",
        description: `Given a 2D grid of '1's (land) and '0's (water), count the number of islands. An island is surrounded by water and formed by connecting adjacent lands horizontally or vertically.`,
        examples: [{ input: '[["1","1","0"],["0","1","0"],["0","0","1"]]', output: "2" }],
        constraints: ["1 <= rows, cols <= 300", "grid[i][j] is '0' or '1'"],
        hints: ["Use DFS or BFS.", "Mark visited land cells as '0' to avoid revisiting."],
        tags: ["Graph", "DFS", "BFS"],
        starterCode: {
            python: `def numIslands(grid):\n    pass\n\nimport json\nprint(numIslands(json.loads(input())))`,
            javascript: `function numIslands(grid){}\nconst rl=require('readline').createInterface({input:process.stdin});\nrl.on('line',l=>{console.log(numIslands(JSON.parse(l)));rl.close();});`,
            cpp: `#include<iostream>\n#include<vector>\nusing namespace std;\nint numIslands(vector<vector<char>>&g){return 0;}\nint main(){cout<<0<<endl;}`,
        },
        testCases: [{ input: '[["1","1","0"],["0","1","0"],["0","0","1"]]', expected: "2" }, { input: '[["1","1","1"],["1","1","0"],["1","0","1"]]', expected: "2" }],
    },
    {
        id: "linked-list-cycle",
        title: "Linked List Cycle",
        difficulty: "intermediate",
        category: "Linked Lists",
        description: `Given the head of a linked list represented as an array, determine if it has a cycle. Return true if there is a cycle, false otherwise.`,
        examples: [{ input: "[3,2,0,-4], pos=1", output: "true" }, { input: "[1,2], pos=-1", output: "false" }],
        constraints: ["0 <= number of nodes <= 10^4"],
        hints: ["Use Floyd's cycle detection (slow/fast pointers).", "If fast ever equals slow, there's a cycle."],
        tags: ["Linked List", "Two Pointers"],
        starterCode: {
            python: `def hasCycle(nums, pos):\n    # Simulate: if pos != -1, a cycle exists\n    return pos != -1\n\nline = input().strip()\nparts = line.split(', pos=')\nimport json\nnums = json.loads(parts[0])\npos = int(parts[1])\nprint('true' if hasCycle(nums, pos) else 'false')`,
            javascript: `function hasCycle(nums, pos){ return pos !== -1; }\nconst rl=require('readline').createInterface({input:process.stdin});\nrl.on('line',l=>{const [a,b]=l.split(', pos=');console.log(hasCycle(JSON.parse(a),+b)?'true':'false');rl.close();});`,
            cpp: `#include<iostream>\nusing namespace std;\nint main(){string l;getline(cin,l);size_t p=l.find(", pos=");int pos=stoi(l.substr(p+6));cout<<(pos!=-1?"true":"false")<<endl;}`,
        },
        testCases: [{ input: "[3,2,0,-4], pos=1", expected: "true" }, { input: "[1,2], pos=-1", expected: "false" }, { input: "[1], pos=-1", expected: "false" }],
    },
    {
        id: "coin-change",
        title: "Coin Change",
        difficulty: "intermediate",
        category: "Dynamic Programming",
        description: `Given coins of different denominations and a total amount, return the fewest number of coins needed to make up that amount. Return -1 if it cannot be done.`,
        examples: [{ input: "[1,5,11], 11", output: "1" }, { input: "[2], 3", output: "-1" }],
        constraints: ["1 <= coins.length <= 12", "0 <= amount <= 10^4"],
        hints: ["Use bottom-up DP.", "dp[i] = min coins to make amount i."],
        tags: ["Dynamic Programming", "BFS"],
        starterCode: {
            python: `def coinChange(coins, amount):\n    pass\n\nimport json\nline = input().strip()\nidx = line.rfind('],')\ncoins = json.loads(line[:idx+1])\namount = int(line[idx+2:].strip())\nprint(coinChange(coins, amount))`,
            javascript: `function coinChange(coins,amount){}\nconst rl=require('readline').createInterface({input:process.stdin});\nrl.on('line',l=>{const idx=l.lastIndexOf('],');const coins=JSON.parse(l.slice(0,idx+1));const amount=+l.slice(idx+2).trim();console.log(coinChange(coins,amount));rl.close();});`,
            cpp: `#include<iostream>\n#include<vector>\n#include<sstream>\nusing namespace std;\nint coinChange(vector<int>&c,int a){return -1;}\nint main(){string l;getline(cin,l);size_t e=l.rfind(']');string arr=l.substr(1,e-1);int amount=stoi(l.substr(e+2));vector<int>c;stringstream ss(arr);string t;while(getline(ss,t,','))c.push_back(stoi(t));cout<<coinChange(c,amount)<<endl;}`,
        },
        testCases: [{ input: "[1,5,11], 11", expected: "1" }, { input: "[2], 3", expected: "-1" }, { input: "[1,2,5], 11", expected: "3" }],
    },
    {
        id: "word-search",
        title: "Word Search",
        difficulty: "advanced",
        category: "Backtracking",
        description: `Given an m x n grid of characters and a string word, return true if word exists in the grid. The word can be constructed from sequentially adjacent cells (horizontally or vertically). The same cell may not be used more than once.`,
        examples: [{ input: '[["A","B","C"],["D","E","F"],["G","H","I"]], "BEH"', output: "true" }, { input: '[["A","B"],["C","D"]], "ABDC"', output: "true" }],
        constraints: ["1 <= m, n <= 6", "1 <= word.length <= 15"],
        hints: ["Use DFS with backtracking.", "Mark visited cells temporarily."],
        tags: ["Backtracking", "DFS", "Matrix"],
        starterCode: {
            python: `def exist(board, word):\n    pass\n\nimport json\nline = input().strip()\nidx = line.rfind('], \"')\nboard = json.loads(line[:idx+1])\nword = line[idx+4:-1]\nprint('true' if exist(board, word) else 'false')`,
            javascript: `function exist(board, word){}\nconst rl=require('readline').createInterface({input:process.stdin});\nrl.on('line',l=>{const idx=l.lastIndexOf('], \"');const board=JSON.parse(l.slice(0,idx+1));const word=l.slice(idx+4,-1);console.log(exist(board,word)?'true':'false');rl.close();});`,
            cpp: `#include<iostream>\n#include<vector>\nusing namespace std;\nbool exist(vector<vector<char>>&b,string w){return false;}\nint main(){cout<<"false"<<endl;}`,
        },
        testCases: [{ input: '[["A","B","C"],["D","E","F"],["G","H","I"]], "BEH"', expected: "true" }, { input: '[["A","B"],["C","D"]], "ABDC"', expected: "true" }],
    },
    {
        id: "merge-intervals",
        title: "Merge Intervals",
        difficulty: "advanced",
        category: "Arrays",
        description: `Given an array of intervals, merge all overlapping intervals and return an array of the non-overlapping intervals.`,
        examples: [{ input: "[[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" }, { input: "[[1,4],[4,5]]", output: "[[1,5]]" }],
        constraints: ["1 <= intervals.length <= 10^4", "intervals[i].length == 2"],
        hints: ["Sort by start time.", "If current start <= previous end, merge them."],
        tags: ["Array", "Sorting"],
        starterCode: {
            python: `def merge(intervals):\n    pass\n\nimport json\nprint(json.dumps(merge(json.loads(input())),separators=(',',':')))`,
            javascript: `function merge(intervals){}\nconst rl=require('readline').createInterface({input:process.stdin});\nrl.on('line',l=>{console.log(JSON.stringify(merge(JSON.parse(l))));rl.close();});`,
            cpp: `#include<iostream>\n#include<vector>\n#include<algorithm>\n#include<sstream>\nusing namespace std;\nvector<vector<int>> merge(vector<vector<int>>&v){return {};}\nint main(){cout<<"[]"<<endl;}`,
        },
        testCases: [{ input: "[[1,3],[2,6],[8,10],[15,18]]", expected: "[[1,6],[8,10],[15,18]]" }, { input: "[[1,4],[4,5]]", expected: "[[1,5]]" }],
    },
    {
        id: "lru-cache",
        title: "LRU Cache",
        difficulty: "advanced",
        category: "Design",
        description: `Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement \`get(key)\` and \`put(key, value)\`. Both must run in O(1).`,
        examples: [{ input: "capacity=2, ops=[[put,1,1],[put,2,2],[get,1],[put,3,3],[get,2],[get,3]]", output: "[1,-1,3]" }],
        constraints: ["1 <= capacity <= 3000", "0 <= key, value <= 10^4"],
        hints: ["Use a hashmap + doubly linked list.", "Map stores key→node, list maintains recency order."],
        tags: ["Hash Table", "Linked List", "Design"],
        starterCode: {
            python: `class LRUCache:\n    def __init__(self, capacity):\n        pass\n    def get(self, key):\n        pass\n    def put(self, key, value):\n        pass\n\nprint(-1)  # Implement and test manually`,
            javascript: `class LRUCache {\n  constructor(capacity) {}\n  get(key) { return -1; }\n  put(key, value) {}\n}\nconsole.log(-1);`,
            cpp: `#include<iostream>\nusing namespace std;\nclass LRUCache{\npublic:\n  LRUCache(int c){}\n  int get(int k){return -1;}\n  void put(int k,int v){}\n};\nint main(){cout<<-1<<endl;}`,
        },
        testCases: [{ input: "capacity=2, ops=[[put,1,1],[put,2,2],[get,1],[put,3,3],[get,2],[get,3]]", expected: "[1,-1,3]" }],
    },
    {
        id: "longest-common-subsequence",
        title: "Longest Common Subsequence",
        difficulty: "advanced",
        category: "Dynamic Programming",
        description: `Given two strings \`text1\` and \`text2\`, return the length of their longest common subsequence. A subsequence doesn't need to be contiguous.`,
        examples: [{ input: '"abcde", "ace"', output: "3" }, { input: '"abc", "abc"', output: "3" }],
        constraints: ["1 <= text1.length, text2.length <= 1000"],
        hints: ["Use 2D DP table.", "dp[i][j] = LCS of text1[:i] and text2[:j]."],
        tags: ["String", "Dynamic Programming"],
        starterCode: {
            python: `def longestCommonSubsequence(text1, text2):\n    pass\n\nparts = input().strip().split(', ')\nt1 = parts[0].strip('\"')\nt2 = parts[1].strip('\"')\nprint(longestCommonSubsequence(t1, t2))`,
            javascript: `function longestCommonSubsequence(t1,t2){}\nconst rl=require('readline').createInterface({input:process.stdin});\nrl.on('line',l=>{const[a,b]=l.split(', ');console.log(longestCommonSubsequence(a.replace(/\"/g,''),b.replace(/\"/g,'')));rl.close();});`,
            cpp: `#include<iostream>\n#include<string>\nusing namespace std;\nint longestCommonSubsequence(string a,string b){return 0;}\nint main(){string l;getline(cin,l);size_t c=l.find(', ');string a=l.substr(1,c-2);string b=l.substr(c+3,l.size()-c-4);cout<<longestCommonSubsequence(a,b)<<endl;}`,
        },
        testCases: [{ input: '"abcde", "ace"', expected: "3" }, { input: '"abc", "abc"', expected: "3" }, { input: '"abc", "def"', expected: "0" }],
    },
    {
        id: "trapping-rain-water",
        title: "Trapping Rain Water",
        difficulty: "advanced",
        category: "Two Pointers",
        description: `Given \`n\` non-negative integers representing an elevation map with width 1, compute how much water can be trapped after raining.`,
        examples: [{ input: "[0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" }, { input: "[4,2,0,3,2,5]", output: "9" }],
        constraints: ["n == height.length", "1 <= n <= 2*10^4"],
        hints: ["Use two pointers from both ends.", "Water at each position = min(maxL, maxR) - height[i]."],
        tags: ["Array", "Two Pointers", "Stack"],
        starterCode: {
            python: `def trap(height):\n    pass\n\nimport json\nprint(trap(json.loads(input())))`,
            javascript: `function trap(height){}\nconst rl=require('readline').createInterface({input:process.stdin});\nrl.on('line',l=>{console.log(trap(JSON.parse(l)));rl.close();});`,
            cpp: `#include<iostream>\n#include<vector>\n#include<sstream>\nusing namespace std;\nint trap(vector<int>&h){return 0;}\nint main(){string l;getline(cin,l);vector<int>h;stringstream ss(l.substr(1,l.size()-2));string t;while(getline(ss,t,','))h.push_back(stoi(t));cout<<trap(h)<<endl;}`,
        },
        testCases: [{ input: "[0,1,0,2,1,0,1,3,2,1,2,1]", expected: "6" }, { input: "[4,2,0,3,2,5]", expected: "9" }],
    },
    {
        id: "valid-anagram",
        title: "Valid Anagram",
        difficulty: "beginner",
        category: "Strings",
        description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise. An anagram uses all the original letters exactly once.`,
        examples: [{ input: '"anagram", "nagaram"', output: "true" }, { input: '"rat", "car"', output: "false" }],
        constraints: ["1 <= s.length, t.length <= 5*10^4", "s and t consist of lowercase English letters."],
        hints: ["Sort both strings and compare.", "Or use a frequency count array of size 26."],
        tags: ["String", "Hash Table", "Sorting"],
        starterCode: {
            python: `def isAnagram(s, t):\n    pass\n\nparts = input().strip().split(', ')\nprint('true' if isAnagram(parts[0].strip('\"'), parts[1].strip('\"')) else 'false')`,
            javascript: `function isAnagram(s,t){}\nconst rl=require('readline').createInterface({input:process.stdin});\nrl.on('line',l=>{const[a,b]=l.split(', ');console.log(isAnagram(a.replace(/\"/g,''),b.replace(/\"/g,''))?'true':'false');rl.close();});`,
            cpp: `#include<iostream>\n#include<string>\nusing namespace std;\nbool isAnagram(string s,string t){return false;}\nint main(){string l;getline(cin,l);size_t c=l.find(', ');string a=l.substr(1,c-2);string b=l.substr(c+3,l.size()-c-4);cout<<(isAnagram(a,b)?"true":"false")<<endl;}`,
        },
        testCases: [{ input: '"anagram", "nagaram"', expected: "true" }, { input: '"rat", "car"', expected: "false" }, { input: '"listen", "silent"', expected: "true" }],
    },
    {
        id: "maximum-depth-tree",
        title: "Maximum Depth of Binary Tree",
        difficulty: "beginner",
        category: "Trees",
        description: `Given the number of nodes in a complete binary tree, return its maximum depth (number of levels).`,
        examples: [{ input: "7", output: "3", explanation: "7 nodes → 3 levels" }, { input: "1", output: "1" }],
        constraints: ["0 <= n <= 10^4"],
        hints: ["depth = floor(log2(n)) + 1", "Or count levels iteratively."],
        tags: ["Tree", "DFS", "BFS"],
        starterCode: {
            python: `import math\ndef maxDepth(n):\n    if n == 0: return 0\n    return math.floor(math.log2(n)) + 1\n\nprint(maxDepth(int(input())))`,
            javascript: `function maxDepth(n){ return n===0?0:Math.floor(Math.log2(n))+1; }\nconst rl=require('readline').createInterface({input:process.stdin});\nrl.on('line',l=>{console.log(maxDepth(+l));rl.close();});`,
            cpp: `#include<iostream>\n#include<cmath>\nusing namespace std;\nint maxDepth(int n){return n==0?0:(int)log2(n)+1;}\nint main(){int n;cin>>n;cout<<maxDepth(n)<<endl;}`,
        },
        testCases: [{ input: "7", expected: "3" }, { input: "1", expected: "1" }, { input: "15", expected: "4" }],
    },
    {
        id: "search-2d-matrix",
        title: "Search a 2D Matrix",
        difficulty: "intermediate",
        category: "Binary Search",
        description: `Write an efficient algorithm to search for a value in an m x n matrix where each row is sorted left to right and the first integer of each row is greater than the last integer of the previous row.`,
        examples: [{ input: "[[1,3,5],[7,9,11],[13,15,17]], 9", output: "true" }, { input: "[[1,3,5],[7,9,11]], 6", output: "false" }],
        constraints: ["m == matrix.length", "n == matrix[i].length", "1 <= m, n <= 100"],
        hints: ["Treat the matrix as a flat sorted array.", "Use binary search on virtual index: row=mid/n, col=mid%n."],
        tags: ["Array", "Binary Search", "Matrix"],
        starterCode: {
            python: `def searchMatrix(matrix, target):\n    pass\n\nimport json\nline = input().strip()\nidx = line.rfind('],')\nmatrix = json.loads(line[:idx+1])\ntarget = int(line[idx+2:].strip())\nprint('true' if searchMatrix(matrix, target) else 'false')`,
            javascript: `function searchMatrix(matrix,target){}\nconst rl=require('readline').createInterface({input:process.stdin});\nrl.on('line',l=>{const idx=l.lastIndexOf('],');const matrix=JSON.parse(l.slice(0,idx+1));const target=+l.slice(idx+2).trim();console.log(searchMatrix(matrix,target)?'true':'false');rl.close();});`,
            cpp: `#include<iostream>\n#include<vector>\nusing namespace std;\nbool searchMatrix(vector<vector<int>>&m,int t){return false;}\nint main(){cout<<"false"<<endl;}`,
        },
        testCases: [{ input: "[[1,3,5],[7,9,11],[13,15,17]], 9", expected: "true" }, { input: "[[1,3,5],[7,9,11]], 6", expected: "false" }],
    },
    {
        id: "house-robber",
        title: "House Robber",
        difficulty: "intermediate",
        category: "Dynamic Programming",
        description: `You are a robber planning to rob houses along a street. Adjacent houses have security systems. Given an integer array \`nums\`, return the maximum amount you can rob without robbing adjacent houses.`,
        examples: [{ input: "[1,2,3,1]", output: "4" }, { input: "[2,7,9,3,1]", output: "12" }],
        constraints: ["1 <= nums.length <= 100", "0 <= nums[i] <= 400"],
        hints: ["dp[i] = max(dp[i-1], dp[i-2] + nums[i])", "Only need last two values."],
        tags: ["Array", "Dynamic Programming"],
        starterCode: {
            python: `def rob(nums):\n    pass\n\nimport json\nprint(rob(json.loads(input())))`,
            javascript: `function rob(nums){}\nconst rl=require('readline').createInterface({input:process.stdin});\nrl.on('line',l=>{console.log(rob(JSON.parse(l)));rl.close();});`,
            cpp: `#include<iostream>\n#include<vector>\n#include<sstream>\nusing namespace std;\nint rob(vector<int>&n){return 0;}\nint main(){string l;getline(cin,l);vector<int>n;stringstream ss(l.substr(1,l.size()-2));string t;while(getline(ss,t,','))n.push_back(stoi(t));cout<<rob(n)<<endl;}`,
        },
        testCases: [{ input: "[1,2,3,1]", expected: "4" }, { input: "[2,7,9,3,1]", expected: "12" }, { input: "[2,1]", expected: "2" }],
    },
    {
        id: "min-stack",
        title: "Min Stack",
        difficulty: "intermediate",
        category: "Stack",
        description: `Design a stack that supports push, pop, top, and retrieving the minimum element in constant time. Implement \`push(val)\`, \`pop()\`, \`top()\`, and \`getMin()\`.`,
        examples: [{ input: "push(-2), push(0), push(-3), getMin, pop, top, getMin", output: "-3, 0, -2" }],
        constraints: ["-2^31 <= val <= 2^31 - 1", "pop/top/getMin called on non-empty stack"],
        hints: ["Use an auxiliary stack to track minimums.", "Push current min alongside each value."],
        tags: ["Stack", "Design"],
        starterCode: {
            python: `class MinStack:\n    def __init__(self):\n        pass\n    def push(self, val):\n        pass\n    def pop(self):\n        pass\n    def top(self):\n        pass\n    def getMin(self):\n        pass\n\nprint(-2)  # Implement and test manually`,
            javascript: `class MinStack{\n  constructor(){}\n  push(val){}\n  pop(){}\n  top(){return 0;}\n  getMin(){return 0;}\n}\nconsole.log(-2);`,
            cpp: `#include<iostream>\nusing namespace std;\nclass MinStack{\npublic:\n  void push(int v){}\n  void pop(){}\n  int top(){return 0;}\n  int getMin(){return 0;}\n};\nint main(){cout<<-2<<endl;}`,
        },
        testCases: [{ input: "push(-2), push(0), push(-3), getMin, pop, top, getMin", expected: "-3, 0, -2" }],
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
