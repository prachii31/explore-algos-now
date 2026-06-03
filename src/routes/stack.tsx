import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlgoInfo } from "@/components/AlgoInfo";
import { STACK_INFO } from "@/utils/algoData";

export const Route = createFileRoute("/stack")({
  head: () => ({
    meta: [
      { title: "Stack Visualizer – AlgoVision" },
      { name: "description", content: "Visualize Stack operations: push, pop, peek." },
    ],
  }),
  component: StackPage,
});

function StackPage() {
  const [stack, setStack] = useState<number[]>([]);
  const [value, setValue] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const push = () => {
    const v = Number(value);
    if (!value || Number.isNaN(v)) return;
    setStack((s) => [...s, v]); setValue(""); setMsg(`Pushed ${v}`);
  };
  const pop = () => {
    if (!stack.length) return setMsg("Stack is empty");
    const top = stack[stack.length - 1];
    setStack((s) => s.slice(0, -1)); setMsg(`Popped ${top}`);
  };
  const peek = () => {
    if (!stack.length) return setMsg("Stack is empty");
    setMsg(`Top element is ${stack[stack.length - 1]}`);
  };
  const clear = () => { setStack([]); setMsg("Cleared"); };

  return (
    <div className="av-container">
      <h1 className="av-page-title">🥞 Stack Visualizer</h1>
      <p className="av-page-sub">Last In, First Out (LIFO) — operations happen at the top.</p>

      <div className="av-panel">
        <div className="av-controls">
          <div className="av-control-group">
            <label>Value</label>
            <input className="av-input" type="number" value={value}
              onChange={(e) => setValue(e.target.value)} placeholder="Number" />
          </div>
          <button className="av-btn av-btn-green" onClick={push}>Push</button>
          <button className="av-btn av-btn-red" onClick={pop}>Pop</button>
          <button className="av-btn av-btn-ghost" onClick={peek}>Peek</button>
          <button className="av-btn av-btn-ghost" onClick={clear}>Clear</button>
        </div>
        {msg && <div className="av-msg">{msg}</div>}
      </div>

      <div className="av-panel">
        <div style={{ textAlign: "center", color: "var(--av-muted)", marginBottom: 8, fontSize: 13 }}>
          ← TOP
        </div>
        <div className="av-stack">
          {stack.length === 0 && (
            <div style={{ color: "var(--av-muted)" }}>Empty stack</div>
          )}
          {stack.map((v, i) => (
            <div key={i} className={`av-stack-item ${i === stack.length - 1 ? "top" : ""}`}>{v}</div>
          ))}
        </div>
      </div>

      <AlgoInfo {...STACK_INFO} />
    </div>
  );
}
