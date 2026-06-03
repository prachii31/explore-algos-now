import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SORTERS, type Frame } from "@/utils/sortAlgos";
import { AlgoInfo } from "@/components/AlgoInfo";
import { SORTING_INFO } from "@/utils/algoData";

export const Route = createFileRoute("/sorting")({
  head: () => ({
    meta: [
      { title: "Sorting Algorithms – AlgoVision" },
      { name: "description", content: "Visualize Bubble, Selection, Insertion, Merge and Quick Sort step by step." },
    ],
  }),
  component: SortingPage,
});

type AlgoKey = keyof typeof SORTERS;

const randomArray = (n: number) =>
  Array.from({ length: n }, () => Math.floor(Math.random() * 99) + 1);

function SortingPage() {
  const [algo, setAlgo] = useState<AlgoKey>("bubble");
  const [size, setSize] = useState(15);
  const [speed, setSpeed] = useState(50);
  const [array, setArray] = useState<number[]>(() => randomArray(15));
  const [customInput, setCustomInput] = useState("");
  const [frame, setFrame] = useState<Frame>({
    array: array, sorted: new Set(), comparisons: 0, swaps: 0,
  });
  const [running, setRunning] = useState(false);
  const stopRef = useRef(false);

  useEffect(() => {
    setFrame({ array, sorted: new Set(), comparisons: 0, swaps: 0 });
  }, [array]);

  const handleSize = (n: number) => {
    setSize(n);
    if (!running) setArray(randomArray(n));
  };

  const handleRandom = () => { if (!running) setArray(randomArray(size)); };

  const handleCustom = () => {
    const parsed = customInput.split(/[\s,]+/).map(Number).filter((x) => !Number.isNaN(x));
    if (parsed.length >= 2 && parsed.length <= 30) { setArray(parsed); setSize(parsed.length); }
  };

  const handleReset = () => {
    stopRef.current = true;
    setRunning(false);
    setFrame({ array, sorted: new Set(), comparisons: 0, swaps: 0 });
  };

  const handleStart = async () => {
    if (running) return;
    stopRef.current = false;
    setRunning(true);
    const gen = SORTERS[algo]([...array]);
    const delay = 510 - speed * 5;
    for (const f of gen) {
      if (stopRef.current) break;
      setFrame(f);
      await new Promise((r) => setTimeout(r, delay));
    }
    setRunning(false);
  };

  const classFor = (i: number) => {
    if (frame.sorted.has(i)) return "av-box sorted";
    if (frame.current?.includes(i)) return "av-box current";
    if (frame.compare?.includes(i)) return "av-box compare";
    if (frame.pivot === i) return "av-box pivot";
    return "av-box";
  };

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
              <option value="merge">Merge Sort</option>
              <option value="quick">Quick Sort</option>
            </select>
          </div>
          <div className="av-control-group">
            <label>Array Size: {size}</label>
            <input className="av-slider" type="range" min={5} max={25} value={size}
              disabled={running} onChange={(e) => handleSize(+e.target.value)} />
          </div>
          <div className="av-control-group">
            <label>Speed: {speed}%</label>
            <input className="av-slider" type="range" min={1} max={100} value={speed}
              onChange={(e) => setSpeed(+e.target.value)} />
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
        <div className="av-stats">
          <div className="av-stat">Comparisons<strong>{frame.comparisons}</strong></div>
          <div className="av-stat">Swaps<strong>{frame.swaps}</strong></div>
        </div>
      </div>

      <div className="av-panel">
        <div className="av-boxes">
          {frame.array.map((v, i) => (
            <div key={i} className={classFor(i)}>{v}</div>
          ))}
        </div>
      </div>

      <AlgoInfo {...SORTING_INFO[algo]} />
    </div>
  );
}
