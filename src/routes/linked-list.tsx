import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { AlgoInfo } from "@/components/AlgoInfo";
import { LL_INFO } from "@/utils/algoData";

export const Route = createFileRoute("/linked-list")({
  head: () => ({
    meta: [
      { title: "Linked List Visualizer – AlgoVision" },
      { name: "description", content: "Visualize singly linked list operations: insert at head, tail, delete, search." },
    ],
  }),
  component: LLPage,
});

function LLPage() {
  const [list, setList] = useState<number[]>([10, 20, 30]);
  const [value, setValue] = useState("");
  const [highlight, setHighlight] = useState<number | null>(null);
  const [found, setFound] = useState<number | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const busyRef = useRef(false);

  const reset = () => { setHighlight(null); setFound(null); };

  const insertHead = () => {
    const v = Number(value); if (!value || Number.isNaN(v)) return;
    reset(); setList((l) => [v, ...l]); setValue(""); setMsg(`Inserted ${v} at beginning`);
  };
  const insertTail = () => {
    const v = Number(value); if (!value || Number.isNaN(v)) return;
    reset(); setList((l) => [...l, v]); setValue(""); setMsg(`Inserted ${v} at end`);
  };
  const deleteNode = () => {
    const v = Number(value); if (!value || Number.isNaN(v)) return;
    const idx = list.indexOf(v);
    if (idx === -1) return setMsg(`${v} not found`);
    reset(); setList((l) => l.filter((_, i) => i !== idx)); setValue(""); setMsg(`Deleted ${v}`);
  };
  const search = async () => {
    const v = Number(value); if (!value || Number.isNaN(v) || busyRef.current) return;
    busyRef.current = true; reset(); setMsg(`Searching for ${v}…`);
    for (let i = 0; i < list.length; i++) {
      setHighlight(i);
      await new Promise((r) => setTimeout(r, 500));
      if (list[i] === v) {
        setFound(i); setHighlight(null);
        setMsg(`Found ${v} at position ${i}`); busyRef.current = false; return;
      }
    }
    setHighlight(null); setMsg(`${v} not found`); busyRef.current = false;
  };

  return (
    <div className="av-container">
      <h1 className="av-page-title">🔗 Linked List Visualizer</h1>
      <p className="av-page-sub">Nodes connected by pointers, traversed one link at a time.</p>

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

      <div className="av-panel">
        <div className="av-ll">
          {list.length === 0 && <div style={{ color: "var(--av-muted)" }}>Empty list</div>}
          {list.map((v, i) => {
            const cls = `av-ll-box ${highlight === i ? "highlight" : ""} ${found === i ? "found" : ""}`;
            return (
              <div key={i} className="av-ll-node">
                <div className={cls}>{v}</div>
                {i < list.length - 1 ? <span className="av-ll-arrow">→</span> : <>
                  <span className="av-ll-arrow">→</span>
                  <span className="av-ll-null">NULL</span>
                </>}
              </div>
            );
          })}
        </div>
      </div>

      <AlgoInfo {...LL_INFO} />
    </div>
  );
}
