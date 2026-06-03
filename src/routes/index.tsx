import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AlgoVision – Interactive Algorithm Visualizer" },
      { name: "description", content: "Learn algorithms visually: sorting, searching, stacks, queues, linked lists, and binary search trees." },
    ],
  }),
  component: Home,
});

const CARDS: Array<{ to: string; icon: string; title: string; desc: string }> = [
  { to: "/searching", icon: "🔍", title: "Searching Algorithms", desc: "Visualize Linear and Binary Search step-by-step." },
  { to: "/sorting", icon: "📊", title: "Sorting Algorithms", desc: "Bubble, Selection, Insertion, Merge & Quick Sort." },
  { to: "/stack", icon: "🥞", title: "Stack", desc: "LIFO data structure with Push, Pop and Peek." },
  { to: "/queue", icon: "🚶", title: "Queue", desc: "FIFO data structure with Enqueue and Dequeue." },
  { to: "/linked-list", icon: "🔗", title: "Linked List", desc: "Insert, delete and search nodes with pointers." },
  { to: "/bst", icon: "🌳", title: "Binary Search Tree", desc: "Insert, delete and search in a BST." },
];

function Home() {
  return (
    <>
      <header className="av-hero">
        <h1>AlgoVision</h1>
        <p>An interactive playground to learn how classic algorithms and data structures actually work — visualize every comparison, swap, and pointer in real time.</p>
      </header>
      <div className="av-container">
        <div className="av-grid">
          {CARDS.map((c) => (
            <Link key={c.to} to={c.to as "/"} className="av-card">
              <div className="av-card-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
