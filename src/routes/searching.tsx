import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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

  // Pick a random target the first time the page loads
  useEffect(() => {
    if (array.length > 0) {
      setTarget(array[Math.floor(Math.random() * array.length)]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clear all the visualization state
  function resetVisualization() {
    setStopRequested(true);
    setRunning(false);
    setActiveIndex(null);
    setFoundIndex(null);
    setComparisons(0);
    setMsg(null);
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

    for (let i = 0; i < arr.length; i++) {
      if (stopRequested) return;

      // Highlight the element we are about to check
      setActiveIndex(i);
      count++;
      setComparisons(count);
      await sleep(stepDelay());

      // Compare current element with target
      if (arr[i] === target) {
        setFoundIndex(i);
        setMsg({ text: `Found ${target} at index ${i}!`, type: "success" });
        return;
      }
    }
    setMsg({ text: `${target} not found in array.`, type: "error" });
  }

  // ----- Binary Search -----
  // Requires a sorted array. We repeatedly look at the middle element and
  // throw away the half that cannot contain the target.
  async function runBinarySearch() {
    // Binary search needs a sorted array, so sort first
    const arr = [...array].sort((a, b) => a - b);
    setArray(arr);

    let low = 0;
    let high = arr.length - 1;
    let count = 0;

    while (low <= high) {
      if (stopRequested) return;

      // Look at the middle element
      const mid = Math.floor((low + high) / 2);
      setActiveIndex(mid);
      count++;
      setComparisons(count);
      await sleep(stepDelay());

      if (arr[mid] === target) {
        // Found it!
        setFoundIndex(mid);
        setMsg({ text: `Found ${target} at index ${mid}!`, type: "success" });
        return;
      }

      // Decide which half to keep searching
      if (arr[mid] < target) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    setMsg({ text: `${target} not found in array.`, type: "error" });
  }

  // Start the chosen search
  async function handleStart() {
    if (running) return;
    resetVisualization();
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
    if (foundIndex === index) return "av-box sorted";
    if (activeIndex === index) return "av-box compare";
    return "av-box";
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
              onChange={(e) => setAlgo(e.target.value as Algo)}>
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
        <div className="av-boxes">
          {array.map((value, index) => (
            <div key={index} className={classFor(index)}>{value}</div>
          ))}
        </div>
      </div>

      <AlgoInfo {...SEARCHING_INFO[algo]} />
    </div>
  );
}
