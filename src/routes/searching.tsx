import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AlgoInfo } from "@/components/AlgoInfo";
import { SEARCHING_INFO } from "@/utils/algoData";

// Route configuration for the /searching page
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

// A single line in the step log panel
interface LogEntry {
  text: string;
  kind: "info" | "compare" | "move" | "found" | "fail";
}

// Snapshot of the binary search pointers at a moment in time, used to drive the visuals
interface BinaryState {
  low: number | null;
  high: number | null;
  mid: number | null;
}

// Generate a random array of size n with numbers from 1 to 99
function randomArray(n: number): number[] {
  const arr: number[] = [];
  for (let i = 0; i < n; i++) {
    arr.push(Math.floor(Math.random() * 99) + 1);
  }
  return arr;
}

// Small helper so async code can pause between steps
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function SearchingPage() {
  // ----- State -----
  const [algo, setAlgo] = useState<Algo>("linear");
  const [array, setArray] = useState<number[]>(() => randomArray(12));
  const [customInput, setCustomInput] = useState("");
  const [target, setTarget] = useState<number>(0);             // value we are looking for
  const [speed, setSpeed] = useState(50);                      // animation speed
  const [activeIndex, setActiveIndex] = useState<number | null>(null); // currently checked index
  const [foundIndex, setFoundIndex] = useState<number | null>(null);   // position of match
  const [comparisons, setComparisons] = useState(0);
  const [running, setRunning] = useState(false);
  const [stopRequested, setStopRequested] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Binary search specific visualization state
  const [binaryState, setBinaryState] = useState<BinaryState>({ low: null, high: null, mid: null });
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const logRef = useRef<HTMLDivElement | null>(null);
  const stopRef = useRef(false); // mirrors stopRequested but readable inside the async loop instantly

  // Pick a random target the first time the page loads
  useEffect(() => {
    if (array.length > 0) {
      setTarget(array[Math.floor(Math.random() * array.length)]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll the step log to the top whenever a new line is added,
  // since newest entries render first (matches Log Tracer style on Sorting page)
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = 0;
    }
  }, [logs]);

  function pushLog(text: string, kind: LogEntry["kind"] = "info") {
    setLogs((prev) => [...prev, { text, kind }]);
  }

  // Clear all the visualization state
  function resetVisualization() {
    stopRef.current = true;
    setStopRequested(true);
    setRunning(false);
    setActiveIndex(null);
    setFoundIndex(null);
    setComparisons(0);
    setMsg(null);
    setBinaryState({ low: null, high: null, mid: null });
    setLogs([]);
  }

  function handleRandom() {
    if (!running) {
      setArray(randomArray(12));
      resetVisualization();
    }
  }

  function handleCustom() {
    // Parse comma/space separated numbers from the input box
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

  // Delay between two animation steps
  function stepDelay(): number {
    return 610 - speed * 6;
  }

  // ----- Linear Search -----
  // Check every element from left to right until we find the target.
  async function runLinearSearch() {
    const arr = [...array];
    let count = 0;

    pushLog(`Starting linear search for target ${target}`, "info");

    for (let i = 0; i < arr.length; i++) {
      if (stopRef.current) return;

      // Highlight the element we are about to check
      setActiveIndex(i);
      count++;
      setComparisons(count);
      pushLog(`Checking index ${i} (value ${arr[i]})`, "compare");
      await sleep(stepDelay());
      if (stopRef.current) return;

      // Compare current element with target
      if (arr[i] === target) {
        setFoundIndex(i);
        setMsg({ text: `Found ${target} at index ${i}!`, type: "success" });
        pushLog(`Found target at index ${i}`, "found");
        return;
      }
    }
    setMsg({ text: `${target} not found in array.`, type: "error" });
    pushLog(`${target} not found in array`, "fail");
  }

  // ----- Binary Search -----
  // Requires a sorted array. We repeatedly look at the middle element and
  // throw away the half that cannot contain the target.
  async function runBinarySearch() {
    // Binary search needs a sorted array, so sort first
    const arr = [...array].sort((a, b) => a - b);
    setArray(arr);
    pushLog("Array auto-sorted for binary search", "info");

    let low = 0;
    let high = arr.length - 1;
    let count = 0;

    setBinaryState({ low, high, mid: null });
    pushLog(`Starting search range: ${low} to ${high}`, "info");
    await sleep(stepDelay());
    if (stopRef.current) return;

    while (low <= high) {
      if (stopRef.current) return;

      // Look at the middle element
      const mid = Math.floor((low + high) / 2);
      setActiveIndex(mid);
      setBinaryState({ low, high, mid });
      count++;
      setComparisons(count);
      pushLog(`Checking middle element ${arr[mid]} (index ${mid})`, "compare");
      await sleep(stepDelay());
      if (stopRef.current) return;

      if (arr[mid] === target) {
        // Found it!
        setFoundIndex(mid);
        setMsg({ text: `Found ${target} at index ${mid}!`, type: "success" });
        pushLog(`Found target at index ${mid}`, "found");
        return;
      }

      // Decide which half to keep searching
      if (arr[mid] < target) {
        pushLog(`Target is greater than ${arr[mid]}`, "info");
        low = mid + 1;
        pushLog(`Moving low pointer to index ${low}`, "move");
      } else {
        pushLog(`Target is less than ${arr[mid]}`, "info");
        high = mid - 1;
        pushLog(`Moving high pointer to index ${high}`, "move");
      }

      if (low <= high) {
        pushLog(`New search range: ${low} to ${high}`, "info");
        setBinaryState({ low, high, mid: null });
        await sleep(stepDelay());
        if (stopRef.current) return;
      }
    }
    setBinaryState({ low: null, high: null, mid: null });
    setMsg({ text: `${target} not found in array.`, type: "error" });
    pushLog(`${target} not found in array`, "fail");
  }

  // Start the chosen search
  async function handleStart() {
    if (running) return;
    resetVisualization();
    stopRef.current = false;
    setStopRequested(false);
    setRunning(true);

    if (algo === "linear") {
      await runLinearSearch();
    } else {
      await runBinarySearch();
    }

    setRunning(false);
  }

  // Decide the CSS class for each box based on what we're showing
  function classFor(index: number): string {
    const classes = ["av-box"];

    if (foundIndex === index) {
      classes.push("sorted"); // keep original "found" styling hook for linear search compatibility
      classes.push("av-box-found");
      return classes.join(" ");
    }

    if (algo === "binary" && (binaryState.low !== null || binaryState.high !== null)) {
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

    if (activeIndex === index) {
      classes.push("compare");
      classes.push("av-box-range");
    }

    return classes.join(" ");
  }

  // Which pointer labels (i / j / mid) sit under a given index, for binary search only
  function pointersFor(index: number): string[] {
    if (algo !== "binary") return [];
    const labels: string[] = [];
    const { low, high, mid } = binaryState;
    if (low === index) labels.push("i");
    if (mid === index) labels.push("mid");
    if (high === index) labels.push("j");
    return labels;
  }

  return (
    <div className="av-container">
      <h1 className="av-page-title">🔍 Searching Algorithms</h1>
      <p className="av-page-sub">Find a target value within an array.</p>

      <div className="av-panel">
        <div className="av-controls">
          <div className="av-control-group">
            <label>Algorithm</label>
            <select className="av-select" value={algo} disabled={running}
              onChange={(e) => { setAlgo(e.target.value as Algo); resetVisualization(); }}>
              <option value="linear">Linear Search</option>
              <option value="binary">Binary Search (auto-sorted)</option>
            </select>
          </div>
          <div className="av-control-group">
            <label>Target</label>
            <input className="av-input" type="number" value={target} disabled={running}
              onChange={(e) => setTarget(Number(e.target.value))} />
          </div>
          <div className="av-control-group">
            <label>Speed: {speed}%</label>
            <input className="av-slider" type="range" min={1} max={100} value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))} />
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
          <button className="av-btn av-btn-red" onClick={resetVisualization}>Reset</button>
        </div>
        <div className="av-stats">
          <div className="av-stat">Comparisons<strong>{comparisons}</strong></div>
        </div>
        {msg && <div className={`av-msg ${msg.type}`}>{msg.text}</div>}
      </div>

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

        {algo === "binary" && (
          <div className="av-legend">
            <div className="av-legend-item"><span className="av-legend-swatch av-legend-range" /> Search Range</div>
            <div className="av-legend-item"><span className="av-legend-swatch av-legend-mid" /> Mid Element</div>
            <div className="av-legend-item"><span className="av-legend-swatch av-legend-found" /> Found Element</div>
            <div className="av-legend-item"><span className="av-legend-pointer">i</span> Low Pointer</div>
            <div className="av-legend-item"><span className="av-legend-pointer">j</span> High Pointer</div>
          </div>
        )}
      </div>

      {algo === "binary" && (
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
      )}

      <AlgoInfo {...SEARCHING_INFO[algo]} />
    </div>
  );
}
