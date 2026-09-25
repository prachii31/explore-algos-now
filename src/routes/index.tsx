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
  { to: "/sorting", icon: "📊", title: "Sorting Algorithms", desc: "Bubble, Selection, Insertion & Quick Sort." },
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


        {/* Built to Teach */}
        <section className="av-section">
          <h2 className="av-section-title">Built to Teach</h2>

          <div className="av-grid">
            <div className="av-card">
              <div className="av-card-icon">✨</div>
              <h3>Step-by-step Animation</h3>
              <p>
                Watch every comparison, swap and pointer movement in real time.
              </p>
            </div>

            <div className="av-card">
              <div className="av-card-icon">⚡</div>
              <h3>Speed & Size Controls</h3>
              <p>
                Slow down to understand concepts or speed up execution
                instantly.
              </p>
            </div>

            <div className="av-card">
              <div className="av-card-icon">📊</div>
              <h3>Complexity Analysis</h3>
              <p>
                View time and space complexity for each algorithm and data
                structure.
              </p>
            </div>

            <div className="av-card">
              <div className="av-card-icon">📚</div>
              <h3>Built for Learners</h3>
              <p>
                Understand concepts visually instead of memorizing theory.
              </p>
            </div>
          </div>
        </section>

        {/* About AlgoVision */}
        <section className="av-section">
          <div className="av-panel">
            <h2 className="av-section-title">About AlgoVision</h2>

            <p className="av-about-text">
              AlgoVision is an interactive algorithm visualizer designed to help
              students, interview candidates, and aspiring software engineers
              understand algorithms and data structures through real-time
              animations.
              <br />
              <br />
              The platform includes Sorting Algorithms, Searching Algorithms,
              Stacks, Queues, Linked Lists, and Binary Search Trees with
              step-by-step execution, speed controls, complexity analysis, and
              operation logs.
              <br />
              <br />
              Instead of memorizing concepts, users can visualize how each
              algorithm works internally, making learning more intuitive,
              engaging, and practical.
            </p>
          </div>
        </section>



      
      
      </div>
    </>
  );
}
