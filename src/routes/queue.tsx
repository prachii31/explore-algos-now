import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlgoInfo } from "@/components/AlgoInfo";
import { QUEUE_INFO } from "@/utils/algoData";

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
  const [queue, setQueue] = useState<number[]>([]);
  const [value, setValue] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const enqueue = () => {
    const v = Number(value);
    if (!value || Number.isNaN(v)) return;
    setQueue((q) => [...q, v]); setValue(""); setMsg(`Enqueued ${v}`);
  };
  const dequeue = () => {
    if (!queue.length) return setMsg("Queue is empty");
    setMsg(`Dequeued ${queue[0]}`); setQueue((q) => q.slice(1));
  };
  const showFront = () => setMsg(queue.length ? `Front: ${queue[0]}` : "Queue is empty");
  const showRear = () => setMsg(queue.length ? `Rear: ${queue[queue.length - 1]}` : "Queue is empty");
  const clear = () => { setQueue([]); setMsg("Cleared"); };

  return (
    <div className="av-container">
      <h1 className="av-page-title">🚶 Queue Visualizer</h1>
      <p className="av-page-sub">First In, First Out (FIFO) — enqueue at rear, dequeue from front.</p>

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

      <div className="av-panel">
        <div style={{ display: "flex", justifyContent: "space-between", color: "var(--av-muted)", fontSize: 13, marginBottom: 6 }}>
          <span>← FRONT</span><span>REAR →</span>
        </div>
        <div className="av-queue">
          {queue.length === 0 && <div style={{ color: "var(--av-muted)", margin: "auto" }}>Empty queue</div>}
          {queue.map((v, i) => {
            const cls = `av-queue-item ${i === 0 ? "front" : ""} ${i === queue.length - 1 ? "rear" : ""}`;
            return <div key={i} className={cls}>{v}</div>;
          })}
        </div>
      </div>

      <AlgoInfo {...QUEUE_INFO} />
    </div>
  );
}
