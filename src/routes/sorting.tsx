import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SORTERS, type Frame } from "@/utils/sortAlgos";
import { AlgoInfo } from "@/components/AlgoInfo";
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

function SortingPage() {
  // ----- State -----
  const [algo, setAlgo] = useState<AlgoKey>("bubble");        // chosen algorithm
  const [size, setSize] = useState(15);                       // array size
  const [speed, setSpeed] = useState(50);                     // animation speed (1-100)
  const [array, setArray] = useState<number[]>(() => randomArray(15));
  const [customInput, setCustomInput] = useState("");         // text in the custom array input
  const [frame, setFrame] = useState<Frame>(() => emptyFrame(array));
  const [running, setRunning] = useState(false);              // is the animation playing?
  const [stopRequested, setStopRequested] = useState(false);  // signal to stop the animation

  // Whenever the underlying array changes, reset the displayed frame
  useEffect(() => {
    setFrame(emptyFrame(array));
  }, [array]);

  // ----- Event handlers -----

  // Change the array size (and generate a new random array)
  function handleSize(newSize: number) {
    setSize(newSize);
    if (!running) setArray(randomArray(newSize));
  }

  // Generate a new random array
  function handleRandom() {
    if (!running) setArray(randomArray(size));
  }

  // Use the numbers typed into the custom array input
  function handleCustom() {
    // Split on spaces or commas, convert to numbers, drop invalid entries
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

  // Stop any running animation and reset stats
  function handleReset() {
    setStopRequested(true);
    setRunning(false);
    setFrame(emptyFrame(array));
  }

  // Start sorting: ask the chosen algorithm for steps, then play them
  async function handleStart() {
    if (running) return;
    setStopRequested(false);
    setRunning(true);

    // Generate all the steps up-front (simple to understand)
    const steps = SORTERS[algo]([...array]);

    // Higher speed -> smaller delay between frames
    const delay = 510 - speed * 5;

    for (let i = 0; i < steps.length; i++) {
      // The user clicked Reset, so stop the loop
      if (stopRequested) break;
      setFrame(steps[i]);
      // Wait before showing the next frame
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    setRunning(false);
  }

  // Decide which CSS class to use for each box based on the current frame
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

        {/* Action buttons */}
        <div className="av-controls" style={{ marginTop: 16 }}>
          <button className="av-btn av-btn-ghost" onClick={handleCustom} disabled={running}>Use Array</button>
          <button className="av-btn av-btn-ghost" onClick={handleRandom} disabled={running}>Generate Random Array</button>
          <button className="av-btn av-btn-green" onClick={handleStart} disabled={running}>
            {running ? "Sorting…" : "Start Sorting"}
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
      </div>

      {/* Educational info card */}
      <AlgoInfo {...SORTING_INFO[algo]} />
    </div>
  );
}
