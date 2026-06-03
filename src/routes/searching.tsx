import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AlgoInfo } from "@/components/AlgoInfo";
import { SEARCHING_INFO } from "@/utils/algoData";

export const Route = createFileRoute("/searching")({
  head: () => ({
    meta: [
      { title: "Searching Algorithms – AlgoVision" },
      { name: "description", content: "Visualize Linear and Binary Search step by step." },
    ],
  }),
  component: SearchingPage,
});

type Algo = "linear" | "binary";

const randomArray = (n: number) =>
  Array.from({ length: n }, () => Math.floor(Math.random() * 99) + 1);

function SearchingPage() {
  const [algo, setAlgo] = useState<Algo>("linear");
  const [array, setArray] = useState<number[]>(() => randomArray(12));
  const [customInput, setCustomInput] = useState("");
  const [target, setTarget] = useState<number>(0);
  const [speed, setSpeed] = useState(50);
  const [active, setActive] = useState<number[]>([]);
  const [found, setFound] = useState<number | null>(null);
  const [comparisons, setComparisons] = useState(0);
  const [running, setRunning] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const stopRef = useRef(false);

  useEffect(() => {
    if (array.length) setTarget(array[Math.floor(Math.random() * array.length)]);
  }, []);

  const reset = () => {
    stopRef.current = true; setRunning(false);
    setActive([]); setFound(null); setComparisons(0); setMsg(null);
  };

  const handleRandom = () => { if (!running) { setArray(randomArray(12)); reset(); } };
  const handleCustom = () => {
    const parsed = customInput.split(/[\s,]+/).map(Number).filter((x) => !Number.isNaN(x));
    if (parsed.length >= 2 && parsed.length <= 25) { setArray(parsed); reset(); }
  };

  const wait = () => new Promise((r) => setTimeout(r, 610 - speed * 6));

  const runLinear = async () => {
    const arr = [...array]; let count = 0;
    for (let i = 0; i < arr.length; i++) {
      if (stopRef.current) return;
      setActive([i]); count++; setComparisons(count);
      await wait();
      if (arr[i] === target) { setFound(i); setMsg({ text: `Found ${target} at index ${i}!`, type: "success" }); return; }
    }
    setMsg({ text: `${target} not found in array.`, type: "error" });
  };

  const runBinary = async () => {
    const arr = [...array].sort((a, b) => a - b);
    setArray(arr);
    let lo = 0, hi = arr.length - 1, count = 0;
    while (lo <= hi) {
      if (stopRef.current) return;
      const mid = Math.floor((lo + hi) / 2);
      setActive([mid]); count++; setComparisons(count);
      await wait();
      if (arr[mid] === target) { setFound(mid); setMsg({ text: `Found ${target} at index ${mid}!`, type: "success" }); return; }
      if (arr[mid] < target) lo = mid + 1; else hi = mid - 1;
    }
    setMsg({ text: `${target} not found in array.`, type: "error" });
  };

  const handleStart = async () => {
    if (running) return;
    reset(); stopRef.current = false; setRunning(true);
    if (algo === "linear") await runLinear(); else await runBinary();
    setRunning(false);
  };

  const classFor = (i: number) => {
    if (found === i) return "av-box sorted";
    if (active.includes(i)) return "av-box compare";
    return "av-box";
  };

  return (
    <div className="av-container">
      <h1 className="av-page-title">🔍 Searching Algorithms</h1>
      <p className="av-page-sub">Find a target value within an array.</p>

      <div className="av-panel">
        <div className="av-controls">
          <div className="av-control-group">
            <label>Algorithm</label>
            <select className="av-select" value={algo} disabled={running}
              onChange={(e) => setAlgo(e.target.value as Algo)}>
              <option value="linear">Linear Search</option>
              <option value="binary">Binary Search (auto-sorted)</option>
            </select>
          </div>
          <div className="av-control-group">
            <label>Target</label>
            <input className="av-input" type="number" value={target} disabled={running}
              onChange={(e) => setTarget(+e.target.value)} />
          </div>
          <div className="av-control-group">
            <label>Speed: {speed}%</label>
            <input className="av-slider" type="range" min={1} max={100} value={speed}
              onChange={(e) => setSpeed(+e.target.value)} />
          </div>
          <div className="av-control-group" style={{ minWidth: 240, flex: 1 }}>
            <label>Custom Array</label>
            <input className="av-input" placeholder="e.g. 1, 3, 5, 7, 9"
              value={customInput} disabled={running}
              onChange={(e) => setCustomInput(e.target.value)} />
          </div>
        </div>
        <div className="av-controls" style={{ marginTop: 16 }}>
          <button className="av-btn av-btn-ghost" onClick={handleCustom} disabled={running}>Use Array</button>
          <button className="av-btn av-btn-ghost" onClick={handleRandom} disabled={running}>Random Array</button>
          <button className="av-btn av-btn-green" onClick={handleStart} disabled={running}>
            {running ? "Searching…" : "Search"}
          </button>
          <button className="av-btn av-btn-red" onClick={reset}>Reset</button>
        </div>
        <div className="av-stats">
          <div className="av-stat">Comparisons<strong>{comparisons}</strong></div>
        </div>
        {msg && <div className={`av-msg ${msg.type}`}>{msg.text}</div>}
      </div>

      <div className="av-panel">
        <div className="av-boxes">
          {array.map((v, i) => (
            <div key={i} className={classFor(i)}>{v}</div>
          ))}
        </div>
      </div>

      <AlgoInfo {...SEARCHING_INFO[algo]} />
    </div>
  );
}
