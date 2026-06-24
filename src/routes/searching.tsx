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

interface LogEntry {
  text: string;
  kind: "info" | "compare" | "move" | "found" | "fail";
}

interface BinaryState {
  low: number | null;
  high: number | null;
  mid: number | null;
  // active: search is running — drives range/faded/mid box colours
  active: boolean;
  // frozen: search just finished — keeps i/mid/j labels visible but no range colouring
  frozen: boolean;
}

function randomArray(n: number): number[] {
  const arr: number[] = [];
  for (let i = 0; i < n; i++) {
    arr.push(Math.floor(Math.random() * 99) + 1);
  }
  return arr;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function SearchingPage() {
  const [algo, setAlgo] = useState<Algo>("linear");
  const [arraySize, setArraySize] = useState(12);
  const [array, setArray] = useState<number[]>(() => randomArray(12));
  const [customInput, setCustomInput] = useState("");
  const [target, setTarget] = useState<number>(0);
  const [speed, setSpeed] = useState(50);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [comparisons, setComparisons] = useState(0);
  const [running, setRunning] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // FIX 1: added `active` flag so we never apply range styling before a search starts,
  // even when low === 0 (which is falsy and caused all boxes to turn blue on load)
  const [binaryState, setBinaryState] = useState<BinaryState>({
    low: null, high: null, mid: null, active: false, frozen: false,
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const logRef = useRef<HTMLDivElement | null>(null);
  const stopRef = useRef(false);

  useEffect(() => {
    if (array.length > 0) {
      setTarget(array[Math.floor(Math.random() * array.length)]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to top on new log entries (newest entry renders first)
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = 0;
  }, [logs]);

  function pushLog(text: string, kind: LogEntry["kind"] = "info") {
    setLogs((prev) => [...prev, { text, kind }]);
  }

  function resetVisualization() {
    stopRef.current = true;
    setRunning(false);
    setActiveIndex(null);
    setFoundIndex(null);
    setComparisons(0);
    setMsg(null);
    setBinaryState({ low: null, high: null, mid: null, active: false, frozen: false });
    setLogs([]);
  }

  function handleRandom() {
    if (!running) { setArray(randomArray(arraySize)); resetVisualization(); }
  }

  function handleCustom() {
    const parts = customInput.split(/[\s,]+/);
    const numbers: number[] = [];
    for (const p of parts) {
      const n = Number(p);
      if (!Number.isNaN(n)) numbers.push(n);
    }
    if (numbers.length >= 2 && numbers.length <= 25) {
      setArray(numbers);
      resetVisualization();
    }
  }

  function stepDelay(): number {
    return 610 - speed * 6;
  }

  // ----- Linear Search -----
  async function runLinearSearch() {
    const arr = [...array];
    let count = 0;
    pushLog(`Starting linear search for target ${target}`, "info");

    for (let i = 0; i < arr.length; i++) {
      if (stopRef.current) return;
      setActiveIndex(i);
      count++;
      setComparisons(count);
      pushLog(`Checking index ${i}  →  value ${arr[i]}`, "compare");
      await sleep(stepDelay());
      if (stopRef.current) return;

      if (arr[i] === target) {
        setFoundIndex(i);
        setActiveIndex(null);
        setMsg({ text: `Found ${target} at index ${i}!`, type: "success" });
        pushLog(`Found target ${target} at index ${i}`, "found");
        return;
      } else {
        pushLog(`${arr[i]} ≠ ${target}, moving on`, "info");
      }
    }
    setMsg({ text: `${target} not found in array.`, type: "error" });
    pushLog(`${target} not found in array`, "fail");
  }

  // ----- Binary Search -----
  async function runBinarySearch() {
    const arr = [...array].sort((a, b) => a - b);
    setArray(arr);
    pushLog("Array auto-sorted for binary search", "info");

    let low = 0;
    let high = arr.length - 1;
    let count = 0;

    setBinaryState({ low, high, mid: null, active: true, frozen: false });
    pushLog(`Starting search range: index ${low} to ${high}`, "info");
    await sleep(stepDelay());
    if (stopRef.current) return;

    while (low <= high) {
      if (stopRef.current) return;

      const mid = Math.floor((low + high) / 2);
      setActiveIndex(mid);
      setBinaryState({ low, high, mid, active: true, frozen: false });
      count++;
      setComparisons(count);
      pushLog(`Checking middle element ${arr[mid]}  (index ${mid})`, "compare");
      await sleep(stepDelay());
      if (stopRef.current) return;

      if (arr[mid] === target) {
        setFoundIndex(mid);
        // Freeze: keep low/mid/high so pointer labels stay visible, but turn off
        // active so range/faded colouring clears — found cell gets its own green style
        setBinaryState({ low, high, mid, active: false, frozen: true });
        setActiveIndex(null);
        setMsg({ text: `Found ${target} at index ${mid}!`, type: "success" });
        pushLog(`Found target ${target} at index ${mid}`, "found");
        return;
      }

      if (arr[mid] < target) {
        pushLog(`${arr[mid]} < ${target}  →  target is in right half`, "info");
        low = mid + 1;
        pushLog(`Moving low pointer  i  →  index ${low}`, "move");
      } else {
        pushLog(`${arr[mid]} > ${target}  →  target is in left half`, "info");
        high = mid - 1;
        pushLog(`Moving high pointer  j  →  index ${high}`, "move");
      }

      if (low <= high) {
        pushLog(`New search range: index ${low} to ${high}`, "info");
        setBinaryState({ low, high, mid: null, active: true, frozen: false });
        await sleep(stepDelay());
        if (stopRef.current) return;
      }
    }

    setBinaryState({ low: null, high: null, mid: null, active: false, frozen: false });
    setMsg({ text: `${target} not found in array.`, type: "error" });
    pushLog(`${target} not found in array`, "fail");
  }

  async function handleStart() {
    if (running) return;
    resetVisualization();
    stopRef.current = false;
    setRunning(true);
    if (algo === "linear") {
      await runLinearSearch();
    } else {
      await runBinarySearch();
    }
    setRunning(false);
  }

  // FIX 1: gate on binaryState.active instead of checking low/high for null
  function classFor(index: number): string {
    const classes = ["av-box"];

    if (foundIndex === index) {
      classes.push("av-box-found");
      return classes.join(" ");
    }

    if (algo === "binary" && binaryState.active) {
      const { low, high, mid } = binaryState;
      const inRange = low !== null && high !== null && index >= low && index <= high;
      if (mid === index) {
        classes.push("av-box-mid");
      } else if (inRange) {
        classes.push("av-box-range");
      } else {
        classes.push("av-box-faded");
      }
      return classes.join(" ");
    }

    if (algo === "linear" && activeIndex === index) {
      classes.push("av-box-compare");
    }

    return classes.join(" ");
  }

  // Show pointer labels when active (search running) OR frozen (just found/finished)
  function pointersFor(index: number): string[] {
    if (algo !== "binary" || (!binaryState.active && !binaryState.frozen)) return [];
    const labels: string[] = [];
    const { low, high, mid } = binaryState;
    if (low === index) labels.push("start");
    if (mid === index) labels.push("mid");
    if (high === index) labels.push("end");
    return labels;
  }

  // Shared log panel renderer — used for both linear and binary
  function renderLogTracer() {
    return (
      <div className="av-panel">
        <div className="av-log-header">
          <h3 className="av-log-title">Log Tracer</h3>
          <span className="av-log-badge">{logs.length} steps</span>
        </div>
        <div className="av-log" ref={logRef}>
          {logs.length === 0 ? (
            <div className="av-log-empty">Run a search to see step-by-step details here.</div>
          ) : (
            [...logs].reverse().map((entry, i) => {
              const stepNumber = logs.length - i;
              const isLatest = i === 0;
              return (
                <div
                  key={stepNumber}
                  className={`av-log-line av-log-${entry.kind}${isLatest ? " av-log-latest" : ""}`}
                >
                  <span className="av-log-index">#{stepNumber}</span>
                  <span className="av-log-text">{entry.text}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="av-container">
      <h1 className="av-page-title">🔍 Searching Algorithms</h1>
      <p className="av-page-sub">Find a target value within an array.</p>

      {/* ── Controls panel ── */}
      <div className="av-panel">
        <div className="av-controls">
          <div className="av-control-group">
            <label>Algorithm</label>
            <select
              className="av-select"
              value={algo}
              disabled={running}
              onChange={(e) => { setAlgo(e.target.value as Algo); resetVisualization(); }}
            >
              <option value="linear">Linear Search</option>
              <option value="binary">Binary Search (auto-sorted)</option>
            </select>
          </div>
          <div className="av-control-group">
            <label>Array Size: {arraySize}</label>
            <input
              className="av-slider"
              type="range"
              min={5}
              max={20}
              value={arraySize}
              disabled={running}
              onChange={(e) => {
                const size = Number(e.target.value);
                setArraySize(size);
                setArray(randomArray(size));
                resetVisualization();
              }}
            />
          </div>
          <div className="av-control-group">
            <label>Speed: {speed}%</label>
            <input
              className="av-slider"
              type="range"
              min={1}
              max={100}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
          </div>
          <div className="av-control-group">
            <label>Target</label>
            <input
              className="av-input"
              type="number"
              value={target}
              disabled={running}
              onChange={(e) => setTarget(Number(e.target.value))}
            />
          </div>
          <div className="av-control-group" style={{ minWidth: 240, flex: 1 }}>
            <label>Custom Array</label>
            <input
              className="av-input"
              placeholder="e.g. 1, 3, 5, 7, 9"
              value={customInput}
              disabled={running}
              onChange={(e) => setCustomInput(e.target.value)}
            />
          </div>
        </div>
        <div className="av-controls" style={{ marginTop: 16 }}>
          <button className="av-btn av-btn-ghost" onClick={handleCustom} disabled={running}>Use Array</button>
          <button className="av-btn av-btn-ghost" onClick={handleRandom} disabled={running}>Random Array</button>
          <button className="av-btn av-btn-green" onClick={handleStart} disabled={running}>
            {running ? "Searching…" : "Search"}
          </button>
          <button className="av-btn av-btn-red" onClick={resetVisualization}>Reset</button>
        </div>
        <div className="av-stats">
          <div className="av-stat">Comparisons<strong>{comparisons}</strong></div>
        </div>
        {msg && <div className={`av-msg ${msg.type}`}>{msg.text}</div>}
      </div>

      {/* ── Visualization panel ── */}
      <div className="av-panel">
        <div className="av-boxes av-boxes-spaced">
          {array.map((value, index) => {
            const labels = pointersFor(index);
            return (
              <div key={index} className="av-box-col">
                <div className={classFor(index)}>{value}</div>
                <div className="av-pointer-row">
                  {labels.length > 0 ? (
                    labels.map((label) => (
                      <span key={label} className={`av-pointer-label av-pointer-${label}`}>{label}</span>
                    ))
                  ) : (
                    <span className="av-pointer-label av-pointer-empty">&nbsp;</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend: binary search only */}
        {algo === "binary" && (
          <div className="av-legend">
            <div className="av-legend-item"><span className="av-legend-swatch av-legend-range" />Search Range</div>
            <div className="av-legend-item"><span className="av-legend-swatch av-legend-mid" />Mid Element</div>
            <div className="av-legend-item"><span className="av-legend-swatch av-legend-found" />Found Element</div>
            <div className="av-legend-item"><span className="av-legend-pointer">start</span>Low Pointer</div>
            <div className="av-legend-item"><span className="av-legend-pointer">end</span>High Pointer</div>
          </div>
        )}

        {/* Legend: linear search */}
        {algo === "linear" && (
          <div className="av-legend">
            <div className="av-legend-item"><span className="av-legend-swatch av-legend-linear-active" />Current Element</div>
            <div className="av-legend-item"><span className="av-legend-swatch av-legend-found" />Found Element</div>
          </div>
        )}
      </div>

      {/* ── Log Tracer (both algorithms) ── */}
      {renderLogTracer()}

      <AlgoInfo {...SEARCHING_INFO[algo]} />
    </div>
  );
}
