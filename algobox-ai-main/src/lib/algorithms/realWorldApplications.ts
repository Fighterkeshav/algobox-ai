import {
    Database,
    Navigation,
    ShoppingCart,
    GitBranch,
    Globe,
    Users,
    Gamepad2,
    Truck,
    Calendar,
    Lock,
    Cpu,
    Binary,
    Search,
    Network,
    Route,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface RealWorldApplication {
    title: string;
    description: string;
    industry: string;
    example: string;
    icon: LucideIcon;
}

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

export const REAL_WORLD_APPLICATIONS: Record<AlgorithmId, RealWorldApplication[]> = {
    "bubble-sort": [
        {
            title: "Educational Tools",
            description: "Bubble sort is widely used in computer science education to teach sorting fundamentals due to its simple, intuitive swapping mechanism.",
            industry: "Education",
            example: "Platforms like Khan Academy and Coursera use bubble sort visualizations to introduce algorithm concepts.",
            icon: Cpu,
        },
        {
            title: "Embedded Systems",
            description: "In memory-constrained embedded systems with very small datasets, bubble sort's minimal memory footprint makes it practical.",
            industry: "IoT / Hardware",
            example: "Simple microcontrollers sorting sensor readings (e.g., 5-10 temperature values) in smart home devices.",
            icon: Binary,
        },
    ],
    "quick-sort": [
        {
            title: "Database Indexing",
            description: "Quick sort is used internally by many database systems for sorting query results and building indexes efficiently.",
            industry: "Databases",
            example: "PostgreSQL and MySQL use variations of quick sort for ORDER BY operations on large result sets.",
            icon: Database,
        },
        {
            title: "E-commerce Product Listings",
            description: "Online marketplaces use quick sort to display products sorted by price, rating, or relevance in real-time.",
            industry: "E-commerce",
            example: "Amazon sorts millions of products when you filter by 'Price: Low to High' using optimized quick sort.",
            icon: ShoppingCart,
        },
        {
            title: "File System Operations",
            description: "Operating systems use quick sort for directory listings and file management operations.",
            industry: "Operating Systems",
            example: "The Unix 'sort' command and Windows Explorer both use quick sort variants for file listing.",
            icon: Binary,
        },
    ],
    "merge-sort": [
        {
            title: "External Sorting (Big Data)",
            description: "When data doesn't fit in memory, merge sort's divide-and-conquer approach allows sorting data stored on disk.",
            industry: "Big Data",
            example: "Hadoop MapReduce uses merge sort to sort terabytes of log files across distributed storage systems.",
            icon: Database,
        },
        {
            title: "Git Merge Operations",
            description: "Version control systems use merge sort principles when combining branches and resolving file conflicts.",
            industry: "Developer Tools",
            example: "Git's merge algorithm uses concepts from merge sort to combine changes from different branches.",
            icon: GitBranch,
        },
        {
            title: "Inversion Counting",
            description: "Modified merge sort efficiently counts inversions, useful for measuring dataset disorder or recommendation similarity.",
            industry: "Analytics",
            example: "Spotify uses inversion counting (via merge sort) to measure similarity between playlist rankings.",
            icon: Users,
        },
    ],
    "insertion-sort": [
        {
            title: "Real-Time Stream Processing",
            description: "When data arrives incrementally and must stay sorted, insertion sort efficiently maintains order.",
            industry: "Real-Time Systems",
            example: "Trading platforms insert new stock prices into sorted lists for live leaderboards.",
            icon: Network,
        },
        {
            title: "Card Game Hand Management",
            description: "Mimics how humans naturally sort playing cards by inserting each card into its correct position.",
            industry: "Gaming",
            example: "Digital card games like Hearthstone use insertion-like logic when adding cards to a sorted hand.",
            icon: Gamepad2,
        },
    ],
    "selection-sort": [
        {
            title: "Memory-Constrained Ranking",
            description: "When finding top-K elements from small lists with minimal memory, selection sort's approach is effective.",
            industry: "Embedded Systems",
            example: "Wearable devices ranking top 3 daily activities from limited sensor data.",
            icon: Cpu,
        },
        {
            title: "Simple Leaderboard Systems",
            description: "For small-scale leaderboards where simplicity outweighs performance needs.",
            industry: "Gaming",
            example: "Arcade machines displaying top 10 high scores using straightforward selection-based ranking.",
            icon: Gamepad2,
        },
    ],
    "binary-search": [
        {
            title: "Database Index Lookups",
            description: "B-trees in databases use binary search principles for O(log n) lookups in sorted indexes.",
            industry: "Databases",
            example: "Every SQL SELECT query on an indexed column uses binary search internally for fast lookups.",
            icon: Database,
        },
        {
            title: "Dictionary & Autocomplete",
            description: "Spell checkers and autocomplete systems use binary search to quickly find word suggestions.",
            industry: "Search & NLP",
            example: "Your phone's keyboard uses binary search to find matching words as you type.",
            icon: Search,
        },
        {
            title: "IP Routing Tables",
            description: "Network routers use binary search on sorted IP ranges to determine packet destinations.",
            industry: "Networking",
            example: "Every internet packet is routed using binary search on IP address ranges in router tables.",
            icon: Network,
        },
    ],
    "dijkstra": [
        {
            title: "GPS Navigation",
            description: "Finding the shortest route between locations using road networks modeled as weighted graphs.",
            industry: "Transportation",
            example: "Google Maps calculates driving directions using Dijkstra's algorithm on road networks.",
            icon: Navigation,
        },
        {
            title: "Network Routing (OSPF)",
            description: "Internet routers use Dijkstra's algorithm in the OSPF protocol to find optimal data paths.",
            industry: "Telecommunications",
            example: "Your data packets travel through the internet via routes calculated by Dijkstra's algorithm.",
            icon: Globe,
        },
        {
            title: "Social Network Connections",
            description: "Finding shortest connection paths between users in social networks.",
            industry: "Social Media",
            example: "LinkedIn's 'Degrees of Connection' feature uses graph shortest-path algorithms.",
            icon: Users,
        },
    ],
    "a-star": [
        {
            title: "Video Game AI",
            description: "NPCs use A* to navigate game worlds, finding optimal paths around obstacles.",
            industry: "Gaming",
            example: "Games like The Sims, StarCraft, and Age of Empires use A* for character movement.",
            icon: Gamepad2,
        },
        {
            title: "Robotics & Autonomous Vehicles",
            description: "Self-driving cars and warehouse robots use A* for obstacle avoidance and path planning.",
            industry: "Robotics",
            example: "Amazon warehouse robots use A* to navigate between shelves without collisions.",
            icon: Truck,
        },
        {
            title: "Logistics Route Optimization",
            description: "Delivery companies optimize routes considering distance, traffic, and delivery windows.",
            industry: "Logistics",
            example: "UPS uses A* variants in their ORION system to plan delivery routes daily.",
            icon: Route,
        },
    ],
    "bfs": [
        {
            title: "Friend Suggestions",
            description: "Finding friends-of-friends by exploring the social graph level by level.",
            industry: "Social Media",
            example: "Facebook's 'People You May Know' uses BFS to find users within 2-3 connection levels.",
            icon: Users,
        },
        {
            title: "Web Crawlers",
            description: "Search engines use BFS to systematically discover and index web pages.",
            industry: "Search Engines",
            example: "Google's web crawler uses BFS to explore links and discover new pages across the internet.",
            icon: Globe,
        },
        {
            title: "Shortest Path in Unweighted Graphs",
            description: "Finding the minimum number of steps/hops between nodes in networks.",
            industry: "Networking",
            example: "Finding the fewest router hops between two computers on a network.",
            icon: Network,
        },
    ],
    "n-queen": [
        {
            title: "Constraint Satisfaction Problems",
            description: "The N-Queens problem is a classic example of constraint satisfaction, with techniques applicable to many domains.",
            industry: "AI / Operations Research",
            example: "SAT solvers and constraint programming libraries use N-Queens as a benchmark problem.",
            icon: Cpu,
        },
        {
            title: "Scheduling & Timetabling",
            description: "University course scheduling follows similar constraint patterns - no two classes can conflict.",
            industry: "Education / Enterprise",
            example: "University exam scheduling ensures no student has overlapping exams, similar to N-Queens constraints.",
            icon: Calendar,
        },
        {
            title: "VLSI Chip Design",
            description: "Placing components on circuit boards without electrical interference mirrors the non-attacking queen placement.",
            industry: "Hardware Engineering",
            example: "Chip manufacturers use constraint-solving techniques from N-Queens for component placement.",
            icon: Binary,
        },
    ],
    "sieve": [
        {
            title: "Cryptographic Key Generation",
            description: "Generating large prime numbers is essential for RSA and other public-key encryption algorithms.",
            industry: "Cybersecurity",
            example: "When you visit HTTPS websites, the SSL certificates use prime numbers found via sieve methods.",
            icon: Lock,
        },
        {
            title: "Hash Table Size Selection",
            description: "Hash tables often use prime-sized buckets for better distribution. The sieve finds optimal sizes.",
            industry: "Software Engineering",
            example: "Java's HashMap internally uses prime-related sizing for optimal hash distribution.",
            icon: Database,
        },
        {
            title: "Random Number Generators",
            description: "Cryptographically secure RNGs often rely on prime number properties for unpredictability.",
            industry: "Security",
            example: "Lottery systems and online casinos use prime-based algorithms for fair random selections.",
            icon: Lock,
        },
    ],
};
