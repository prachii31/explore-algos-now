import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SORTERS, type Frame } from "@/utils/sortAlgos";
import { AlgoInfo } from "@/components/AlgoInfo";
import { MergeTree } from "@/components/MergeTree";
import { SORTING_INFO } from "@/utils/algoData";

// Route configuration for the /sorting page
export const Route = createFileRoute("/sorting")({
  head: () => ({
    meta: [
      { title: "Sorting Algorithms – AlgoVision" },
      { name: "description", content: "Visualize Bubble, Selection, Insertion, Merge and Quick Sort step by step." },
    ],
  }),
  component: SortingPage,
});

// The list of algorithm keys our SORTERS map supports.
type AlgoKey = "bubble" | "selection" | "insertion" | "merge" | "quick";

// Generate a random array of size n with values from 1 to 99
function randomArray(n: number): number[] {
  const arr: number[] = [];
  for (let i = 0; i < n; i++) {
    arr.push(Math.floor(Math.random() * 99) + 1);
  }
  return arr;
}

// Empty frame used when we reset the visualization
function emptyFrame(array: number[]): Frame {
  return { array, sorted: new Set(), comparisons: 0, swaps: 0 };
}

// Convert the speed slider (1-100) into a delay in milliseconds.
// We use an exponential curve so the slider feels smooth across its range:
//  - speed   1  -> ~600ms  (very slow, easy to follow)
//  - speed  50  -> ~60ms   (medium)
//  - speed  99  -> ~6ms    (very fast)
//  - speed 100  -> 0       (instant - render only the final frame)
function speedToDelay(speed: number): number {
  if (speed >= 100) return 0; // Instant sort mode
  return Math.round(600 * Math.pow(0.05, (speed - 1) / 99));
}

function SortingPage() {
  // ----- State -----
  const [algo, setAlgo] = useState<AlgoKey>("bubble");
  const [size, setSize] = useState(15);
  const [speed, setSpeed] = useState(50);
  const [array, setArray] = useState<number[]>(() => randomArray(15));
  const [customInput, setCustomInput] = useState("");
  const [frame, setFrame] = useState<Frame>(() => emptyFrame(array));
  const [running, setRunning] = useState(false);

  // ----- Refs (avoid stale closures inside the async animation loop) -----
  const stopRef = useRef(false);   // set to true to cancel the running animation
  const speedRef = useRef(speed);  // live speed value the loop reads every frame

  // Keep the speed ref in sync so the running loop reacts immediately to slider changes
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  // Whenever the underlying array changes, reset the displayed frame
  useEffect(() => {
    setFrame(emptyFrame(array));
  }, [array]);

  // ----- Event handlers -----

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

  // Reset: immediately cancel the animation via the ref and clear the frame.
  function handleReset() {
    stopRef.current = true;
    setRunning(false);
    setFrame(emptyFrame(array));
  }

  // Sleep helper that wakes up early if the user resets.
  function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function handleStart() {
    if (running) return;
    stopRef.current = false;
    setRunning(true);

    // Generate every step up-front
    const steps = SORTERS[algo]([...array]);

    // Instant Sort: skip the animation and jump to the last frame
    if (speedRef.current >= 100) {
      setFrame(steps[steps.length - 1]);
      setRunning(false);
      return;
    }

    // Animation loop. We use the ref for cancellation so Reset works instantly,
    // and read speedRef each iteration so slider changes apply mid-animation.
    for (let i = 0; i < steps.length; i++) {
      if (stopRef.current) break;

      setFrame(steps[i]);

      // At very high speeds, skip the sleep entirely on most frames so React
      // is not overwhelmed by tiny timeouts. We still yield occasionally.
      const delay = speedToDelay(speedRef.current);
      if (delay <= 0) {
        // Yield to the browser every ~16 frames so the UI stays responsive
        if (i % 16 === 0) await sleep(0);
        continue;
      }
      await sleep(delay);
    }

    setRunning(false);
  }

  // CSS class for each box based on the current frame
  function classFor(index: number): string {
    if (frame.sorted.has(index)) return "av-box sorted";
    if (frame.current && frame.current.includes(index)) return "av-box current";
    if (frame.compare && frame.compare.includes(index)) return "av-box compare";
    if (frame.pivot === index) return "av-box pivot";
    return "av-box";
  }

  return (
    <div className="av-container">
      <h1 className="av-page-title">📊 Sorting Algorithms</h1>
      <p className="av-page-sub">Pick an algorithm and watch it sort with rectangular boxes.</p>

      {/* Controls panel */}
      <div className="av-panel">
        <div className="av-controls">
          <div className="av-control-group">
            <label>Algorithm</label>
            <select className="av-select" value={algo} disabled={running}
              onChange={(e) => setAlgo(e.target.value as AlgoKey)}>
              <option value="bubble">Bubble Sort</option>
              <option value="selection">Selection Sort</option>
              <option value="insertion">Insertion Sort</option>
              <option value="merge">Merge Sort</option>
              <option value="quick">Quick Sort</option>
            </select>
          </div>
          <div className="av-control-group">
            <label>Array Size: {size}</label>
            <input className="av-slider" type="range" min={5} max={25} value={size}
              disabled={running} onChange={(e) => handleSize(Number(e.target.value))} />
          </div>
          <div className="av-control-group">
            <label>Speed: {speed === 100 ? "Instant" : `${speed}%`}</label>
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

        {/* Action buttons */}
        <div className="av-controls" style={{ marginTop: 16 }}>
          <button className="av-btn av-btn-ghost" onClick={handleCustom} disabled={running}>Use Array</button>
          <button className="av-btn av-btn-ghost" onClick={handleRandom} disabled={running}>Generate Random Array</button>
          <button className="av-btn av-btn-green" onClick={handleStart} disabled={running}>
            {running ? "Sorting…" : speed === 100 ? "Instant Sort" : "Start Sorting"}
          </button>
          <button className="av-btn av-btn-red" onClick={handleReset}>Reset</button>
        </div>

        {/* Statistics */}
        <div className="av-stats">
          <div className="av-stat">Comparisons<strong>{frame.comparisons}</strong></div>
          <div className="av-stat">Swaps<strong>{frame.swaps}</strong></div>
        </div>
      </div>

      {/* The boxes that visualize the array */}
      <div className="av-panel">
        <div className="av-boxes">
          {frame.array.map((value, index) => (
            <div key={index} className={classFor(index)}>{value}</div>
          ))}
        </div>

        {/* Current Step explanation panel */}
        <div className="av-step">
          <div className="av-step-label">Current Step</div>
          <div className="av-step-text">{frame.message || "Ready to sort"}</div>
        </div>
      </div>

      {/* Merge Sort recursion tree (only when merge sort is selected) */}
      {algo === "merge" && (
        <MergeTree array={array} speed={speed} running={running} />
      )}

      {/* Educational info card */}
      <AlgoInfo {...SORTING_INFO[algo]} />
    </div>
  );
}
