import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlgoInfo } from "@/components/AlgoInfo";
import { STACK_INFO } from "@/utils/algoData";

// Route configuration for the /stack page
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
  // The stack itself is a plain array. The last element is the "top".
  const [stack, setStack] = useState<number[]>([]);
  const [value, setValue] = useState("");      // text in the input box
  const [msg, setMsg] = useState<string | null>(null);

  // PUSH: add a new value to the top of the stack
  function push() {
    const v = Number(value);
    if (value === "" || Number.isNaN(v)) return;
    setStack([...stack, v]);
    setValue("");
    setMsg(`Pushed ${v}`);
  }

  // POP: remove and return the top element
  function pop() {
    if (stack.length === 0) {
      setMsg("Stack is empty");
      return;
    }
    const top = stack[stack.length - 1];
    setStack(stack.slice(0, -1));
    setMsg(`Popped ${top}`);
  }

  // PEEK: look at the top element without removing it
  function peek() {
    if (stack.length === 0) {
      setMsg("Stack is empty");
      return;
    }
    setMsg(`Top element is ${stack[stack.length - 1]}`);
  }

  // CLEAR: remove everything from the stack
  function clear() {
    setStack([]);
    setMsg("Cleared");
  }

  return (
    <div className="av-container">
      <h1 className="av-page-title">🥞 Stack Visualizer</h1>
      <p className="av-page-sub">Last In, First Out (LIFO) — operations happen at the top.</p>

      {/* Controls */}
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

      {/* Visualization */}
      <div className="av-panel">
        <div style={{ textAlign: "center", color: "var(--av-muted)", marginBottom: 8, fontSize: 13 }}>
          ← TOP
        </div>
        <div className="av-stack">
          {stack.length === 0 && (
            <div style={{ color: "var(--av-muted)" }}>Empty stack</div>
          )}
          {stack.map((v, i) => {
            // Highlight the last item as the "top"
            const isTop = i === stack.length - 1;
            return (
              <div key={i} className={`av-stack-item ${isTop ? "top" : ""}`}>{v}</div>
            );
          })}
        </div>
      </div>

      <AlgoInfo {...STACK_INFO} />
    </div>
  );
}
