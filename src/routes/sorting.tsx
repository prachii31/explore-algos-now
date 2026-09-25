import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SORTERS, type Frame } from "@/utils/sortAlgos";
import { AlgoInfo } from "@/components/AlgoInfo";
import { SORTING_INFO } from "@/utils/algoData";

export const Route = createFileRoute("/sorting")({
  head: () => ({
    meta: [
      { title: "Sorting Algorithms – AlgoVision" },
      { name: "description", content: "Visualize Bubble, Selection, Insertion and Quick Sort step by step." },
    ],
  }),
  component: SortingPage,
});

type AlgoKey = "bubble" | "selection" | "insertion" | "quick";

function randomArray(n: number): number[] {
  const arr: number[] = [];
  for (let i = 0; i < n; i++) {
    arr.push(Math.floor(Math.random() * 99) + 1);
  }
  return arr;
}

function emptyFrame(array: number[]): Frame {
  return { array, sorted: new Set(), comparisons: 0, swaps: 0 };
}

function speedToDelay(speed: number): number {
  return Math.round(1500 * Math.pow(0.05, (speed - 1) / 99));
}

function SortingPage() {
  const [algo, setAlgo] = useState<AlgoKey>("bubble");
  const [size, setSize] = useState(15);
  const [speed, setSpeed] = useState(50);
  const [array, setArray] = useState<number[]>([]);
  const [customInput, setCustomInput] = useState("");
  const [frame, setFrame] = useState<Frame>(() => emptyFrame([]));
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const stopRef = useRef(false);
  const speedRef = useRef(speed);
  const logsRef = useRef<HTMLDivElement>(null);
  const runningRef = useRef(false);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  // Generate the initial array on the client only (avoids SSR hydration mismatch)
  useEffect(() => {
    setArray(randomArray(15));
  }, []);

  useEffect(() => {
    if (runningRef.current) return; // don't clobber the live animation frame
    setFrame(emptyFrame(array));
    setLogs([]);
  }, [array]);


  // Auto-scroll log panel to top whenever a new log is added (newest is at top)
  useEffect(() => {
    if (logsRef.current) logsRef.current.scrollTop = 0;
  }, [logs]);

  function handleSize(newSize: number) {
    setSize(newSize);
    if (!running) setArray(randomArray(newSize));
  }

  function handleRandom() {
    if (!running) setArray(randomArray(size));
  }

  function handleCustom() {
    const parts = customInput.split(/[\s,]+/);
    const numbers: number[] = [];
    for (const p of parts) {
      const n = Number(p);
      if (!Number.isNaN(n)) numbers.push(n);
    }
    if (numbers.length >= 2 && numbers.length <= 30) {
      setArray(numbers);
      setSize(numbers.length);
    }
  }

  function handleReset() {
    stopRef.current = true;
    setRunning(false);
    setFrame(emptyFrame(array));
    setLogs([]);
  }

  function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function pushLog(msg: string) {
    setLogs((prev) => {
      if (prev[0] === msg) return prev;
      const next = [msg, ...prev];
      if (next.length > 30) next.length = 30;
      return next;
    });
  }

  async function handleStart() {
    if (running) return;
    stopRef.current = false;
    setRunning(true);
    runningRef.current = true;
    setLogs([]);

    const steps = SORTERS[algo]([...array]);

    for (let i = 0; i < steps.length; i++) {
      if (stopRef.current) break;

      const f = steps[i];
      setFrame(f);
      if (f.message) pushLog(f.message);

      const delay = speedToDelay(speedRef.current);
      if (delay <= 0) {
        if (i % 16 === 0) await sleep(0);
        continue;
      }
      await sleep(delay);
    }

    setRunning(false);
    runningRef.current = false;
  }


  function classFor(index: number): string {
    if (frame.sorted.has(index)) return "av-box sorted";
    if (frame.current && frame.current.includes(index)) return "av-box current";
    if (frame.compare && frame.compare.includes(index)) return "av-box compare";
    if (frame.pivot === index) return "av-box pivot";
    return "av-box";
  }

  function labelFor(index: number): string {
    if (frame.sorted.has(index)) return `${index} (sorted)`;
    if (frame.current && frame.current.includes(index)) return `${index} (current)`;
    if (frame.compare && frame.compare.includes(index)) return `${index} (compare)`;
    if (frame.pivot === index) return `${index} (pivot)`;
    return `${index}`;
  }

  return (
    <div className="av-container">
      <h1 className="av-page-title">📊 Sorting Algorithms</h1>
      <p className="av-page-sub">Pick an algorithm and watch it sort with rectangular boxes.</p>

      <div className="av-panel">
        <div className="av-controls">
          <div className="av-control-group">
            <label>Algorithm</label>
            <select className="av-select" value={algo} disabled={running}
              onChange={(e) => setAlgo(e.target.value as AlgoKey)}>
              <option value="bubble">Bubble Sort</option>
              <option value="selection">Selection Sort</option>
              <option value="insertion">Insertion Sort</option>
              <option value="quick">Quick Sort</option>
            </select>
          </div>
          <div className="av-control-group">
            <label>Array Size: {size}</label>
            <input className="av-slider" type="range" min={5} max={25} value={size}
              disabled={running} onChange={(e) => handleSize(Number(e.target.value))} />
          </div>
          <div className="av-control-group">
            <label>Speed: {speed}%</label>
            <input className="av-slider" type="range" min={1} max={100} value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))} />
          </div>
          <div className="av-control-group" style={{ minWidth: 240, flex: 1 }}>
            <label>Custom Array (comma separated)</label>
            <input className="av-input" placeholder="e.g. 5, 2, 8, 1, 9"
              value={customInput} disabled={running}
              onChange={(e) => setCustomInput(e.target.value)} />
          </div>
        </div>

        <div className="av-controls" style={{ marginTop: 16 }}>
          <button className="av-btn av-btn-ghost" onClick={handleCustom} disabled={running}>Use Array</button>
          <button className="av-btn av-btn-ghost" onClick={handleRandom} disabled={running}>Generate Random Array</button>
          <button className="av-btn av-btn-green" onClick={handleStart} disabled={running}>
            {running ? "Sorting…" : "Start Sorting"}
          </button>
          <button className="av-btn av-btn-red" onClick={handleReset}>Reset</button>
        </div>
      </div>

      <div className="av-panel">
        <h2 className="av-section-title">Array Visualization</h2>
        <div className="av-boxes">
          {frame.array.map((value, index) => (
            <div key={index} className="av-box-wrap">
              <div className={classFor(index)}>{value}</div>
              <div className="av-box-label">{labelFor(index)}</div>
            </div>
          ))}
        </div>

        <div className="av-step">
          <div className="av-step-label">Current Step</div>
          <div className="av-legend">
            <span className="av-legend-item"><span className="av-dot current" /> Current element being inserted</span>
            <span className="av-legend-item"><span className="av-dot compare" /> Element being compared</span>
            <span className="av-legend-item"><span className="av-dot sorted" /> Sorted portion</span>
          </div>
          <div className="av-step-text">{frame.message || "Ready to sort"}</div>
        </div>
      </div>

      {/* Log Tracer panel */}
      <div className="av-panel">
        <div className="av-log-header">
          <h2 className="av-section-title" style={{ margin: 0 }}>Log Tracer</h2>
          <span className="av-log-count">{logs.length} step{logs.length === 1 ? "" : "s"}</span>
        </div>
        <div className="av-log-panel" ref={logsRef}>
          {logs.length === 0 ? (
            <div className="av-log-empty">Logs will appear here as the algorithm runs.</div>
          ) : (
            logs.map((line, i) => (
              <div key={logs.length - i} className={`av-log-line ${i === 0 ? "is-latest" : ""}`}>
                <span className="av-log-index">#{logs.length - i}</span>
                <span className="av-log-text">{line}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <AlgoInfo {...SORTING_INFO[algo]} />
    </div>
  );
}
