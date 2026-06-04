import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlgoInfo } from "@/components/AlgoInfo";
import { QUEUE_INFO } from "@/utils/algoData";

// Route configuration for the /queue page
export const Route = createFileRoute("/queue")({
  head: () => ({
    meta: [
      { title: "Queue Visualizer – AlgoVision" },
      { name: "description", content: "Visualize Queue operations: enqueue, dequeue, front, rear." },
    ],
  }),
  component: QueuePage,
});

function QueuePage() {
  // The queue is a plain array. Index 0 is the FRONT, last index is the REAR.
  const [queue, setQueue] = useState<number[]>([]);
  const [value, setValue] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  // ENQUEUE: add a new value at the rear
  function enqueue() {
    const v = Number(value);
    if (value === "" || Number.isNaN(v)) return;
    setQueue([...queue, v]);
    setValue("");
    setMsg(`Enqueued ${v}`);
  }

  // DEQUEUE: remove the value at the front
  function dequeue() {
    if (queue.length === 0) {
      setMsg("Queue is empty");
      return;
    }
    const front = queue[0];
    setQueue(queue.slice(1));
    setMsg(`Dequeued ${front}`);
  }

  // FRONT: peek at the first element
  function showFront() {
    if (queue.length === 0) {
      setMsg("Queue is empty");
      return;
    }
    setMsg(`Front: ${queue[0]}`);
  }

  // REAR: peek at the last element
  function showRear() {
    if (queue.length === 0) {
      setMsg("Queue is empty");
      return;
    }
    setMsg(`Rear: ${queue[queue.length - 1]}`);
  }

  // CLEAR: remove all elements
  function clear() {
    setQueue([]);
    setMsg("Cleared");
  }

  return (
    <div className="av-container">
      <h1 className="av-page-title">🚶 Queue Visualizer</h1>
      <p className="av-page-sub">First In, First Out (FIFO) — enqueue at rear, dequeue from front.</p>

      {/* Controls */}
      <div className="av-panel">
        <div className="av-controls">
          <div className="av-control-group">
            <label>Value</label>
            <input className="av-input" type="number" value={value}
              onChange={(e) => setValue(e.target.value)} placeholder="Number" />
          </div>
          <button className="av-btn av-btn-green" onClick={enqueue}>Enqueue</button>
          <button className="av-btn av-btn-red" onClick={dequeue}>Dequeue</button>
          <button className="av-btn av-btn-ghost" onClick={showFront}>Front</button>
          <button className="av-btn av-btn-ghost" onClick={showRear}>Rear</button>
          <button className="av-btn av-btn-ghost" onClick={clear}>Clear</button>
        </div>
        {msg && <div className="av-msg">{msg}</div>}
      </div>

      {/* Visualization */}
      <div className="av-panel">
        <div style={{ display: "flex", justifyContent: "space-between", color: "var(--av-muted)", fontSize: 13, marginBottom: 6 }}>
          <span>← FRONT</span><span>REAR →</span>
        </div>
        <div className="av-queue">
          {queue.length === 0 && <div style={{ color: "var(--av-muted)", margin: "auto" }}>Empty queue</div>}
          {queue.map((v, i) => {
            // Mark the first and last items so the CSS can highlight them
            const isFront = i === 0;
            const isRear = i === queue.length - 1;
            const cls = `av-queue-item ${isFront ? "front" : ""} ${isRear ? "rear" : ""}`;
            return <div key={i} className={cls}>{v}</div>;
          })}
        </div>
      </div>

      <AlgoInfo {...QUEUE_INFO} />
    </div>
  );
}
