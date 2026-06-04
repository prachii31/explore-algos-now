import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlgoInfo } from "@/components/AlgoInfo";
import { LL_INFO } from "@/utils/algoData";

// Route configuration for the /linked-list page
export const Route = createFileRoute("/linked-list")({
  head: () => ({
    meta: [
      { title: "Linked List Visualizer – AlgoVision" },
      { name: "description", content: "Visualize singly linked list operations: insert at head, tail, delete, search." },
    ],
  }),
  component: LinkedListPage,
});

// Helper used inside the search loop to pause between steps
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function LinkedListPage() {
  // We represent the linked list as a plain array of numbers.
  // Index 0 is the HEAD and the last index is the TAIL.
  const [list, setList] = useState<number[]>([10, 20, 30]);
  const [value, setValue] = useState("");                       // input text
  const [highlight, setHighlight] = useState<number | null>(null); // node being visited
  const [found, setFound] = useState<number | null>(null);      // node that matched search
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);                      // true while search is running

  // Clear highlight/found markers
  function clearHighlights() {
    setHighlight(null);
    setFound(null);
  }

  // INSERT AT HEAD: add a new node at the beginning
  function insertHead() {
    const v = Number(value);
    if (value === "" || Number.isNaN(v)) return;
    clearHighlights();
    setList([v, ...list]);
    setValue("");
    setMsg(`Inserted ${v} at beginning`);
  }

  // INSERT AT TAIL: add a new node at the end
  function insertTail() {
    const v = Number(value);
    if (value === "" || Number.isNaN(v)) return;
    clearHighlights();
    setList([...list, v]);
    setValue("");
    setMsg(`Inserted ${v} at end`);
  }

  // DELETE: remove the first node with the given value
  function deleteNode() {
    const v = Number(value);
    if (value === "" || Number.isNaN(v)) return;
    const idx = list.indexOf(v);
    if (idx === -1) {
      setMsg(`${v} not found`);
      return;
    }
    clearHighlights();
    const newList = list.filter((_, i) => i !== idx);
    setList(newList);
    setValue("");
    setMsg(`Deleted ${v}`);
  }

  // SEARCH: walk through the list one node at a time
  async function search() {
    const v = Number(value);
    if (value === "" || Number.isNaN(v) || busy) return;

    setBusy(true);
    clearHighlights();
    setMsg(`Searching for ${v}…`);

    for (let i = 0; i < list.length; i++) {
      // Highlight the current node and pause so the user can see it
      setHighlight(i);
      await sleep(500);

      // Compare this node's value with what we're looking for
      if (list[i] === v) {
        setFound(i);
        setHighlight(null);
        setMsg(`Found ${v} at position ${i}`);
        setBusy(false);
        return;
      }
    }

    // Loop finished without finding the value
    setHighlight(null);
    setMsg(`${v} not found`);
    setBusy(false);
  }

  return (
    <div className="av-container">
      <h1 className="av-page-title">🔗 Linked List Visualizer</h1>
      <p className="av-page-sub">Nodes connected by pointers, traversed one link at a time.</p>

      {/* Controls */}
      <div className="av-panel">
        <div className="av-controls">
          <div className="av-control-group">
            <label>Value</label>
            <input className="av-input" type="number" value={value}
              onChange={(e) => setValue(e.target.value)} placeholder="Number" />
          </div>
          <button className="av-btn av-btn-green" onClick={insertHead}>Insert at Beginning</button>
          <button className="av-btn av-btn-green" onClick={insertTail}>Insert at End</button>
          <button className="av-btn av-btn-red" onClick={deleteNode}>Delete Node</button>
          <button className="av-btn" onClick={search}>Search Node</button>
        </div>
        {msg && <div className="av-msg">{msg}</div>}
      </div>

      {/* Visualization: nodes connected by arrows, NULL at the end */}
      <div className="av-panel">
        <div className="av-ll">
          {list.length === 0 && <div style={{ color: "var(--av-muted)" }}>Empty list</div>}
          {list.map((v, i) => {
            const isHighlighted = highlight === i;
            const isFound = found === i;
            const cls = `av-ll-box ${isHighlighted ? "highlight" : ""} ${isFound ? "found" : ""}`;
            const isLast = i === list.length - 1;
            return (
              <div key={i} className="av-ll-node">
                <div className={cls}>{v}</div>
                {/* Arrow pointing to the next node, or to NULL at the end */}
                {isLast ? (
                  <>
                    <span className="av-ll-arrow">→</span>
                    <span className="av-ll-null">NULL</span>
                  </>
                ) : (
                  <span className="av-ll-arrow">→</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <AlgoInfo {...LL_INFO} />
    </div>
  );
}
