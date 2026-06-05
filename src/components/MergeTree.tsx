import { useEffect, useMemo, useState } from "react";

// One step in the recursion tree visualization
interface TreeStep {
  type: "split" | "merge";
  level: number;     // depth in the tree (0 = root)
  array: number[];   // subarray at this node
}

// Build the list of split + merge steps using a simple recursive walk.
// Splits are recorded top-down, merges are recorded bottom-up — exactly
// like the real merge sort algorithm.
function buildSteps(input: number[]): TreeStep[] {
  const steps: TreeStep[] = [];

  function recurse(arr: number[], level: number): number[] {
    // Record this split
    steps.push({ type: "split", level, array: [...arr] });

    // Base case: single element is already "sorted"
    if (arr.length <= 1) {
      steps.push({ type: "merge", level, array: [...arr] });
      return arr;
    }

    // Divide
    const mid = Math.floor(arr.length / 2);
    const left = recurse(arr.slice(0, mid), level + 1);
    const right = recurse(arr.slice(mid), level + 1);

    // Merge two sorted halves
    const merged: number[] = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) merged.push(left[i++]);
      else merged.push(right[j++]);
    }
    while (i < left.length) merged.push(left[i++]);
    while (j < right.length) merged.push(right[j++]);

    steps.push({ type: "merge", level, array: merged });
    return merged;
  }

  recurse(input, 0);
  return steps;
}

interface Props {
  array: number[];
  speed: number;   // 1-100
  running: boolean;
}

export function MergeTree({ array, speed, running }: Props) {
  // Pre-compute every split/merge step for the current array
  const steps = useMemo(() => buildSteps(array), [array]);

  // How many steps to show so far (animated reveal)
  const [shown, setShown] = useState(0);

  // Reset whenever the array changes
  useEffect(() => {
    setShown(0);
  }, [array]);

  // When sorting starts, reveal steps one by one
  useEffect(() => {
    if (!running) return;
    setShown(0);
    const delay = 510 - speed * 5;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(i);
      if (i >= steps.length) clearInterval(id);
    }, delay);
    return () => clearInterval(id);
  }, [running, steps, speed]);

  // Group the shown steps by recursion level so we can render rows
  const visible = steps.slice(0, shown || steps.length);
  const splitRows: TreeStep[][] = [];
  const mergeRows: TreeStep[][] = [];
  for (const step of visible) {
    const target = step.type === "split" ? splitRows : mergeRows;
    if (!target[step.level]) target[step.level] = [];
    target[step.level].push(step);
  }

  // Reveal all steps when not running (so the tree is visible by default)
  const showAll = shown === 0 && !running;
  if (showAll) {
    splitRows.length = 0;
    mergeRows.length = 0;
    for (const step of steps) {
      const target = step.type === "split" ? splitRows : mergeRows;
      if (!target[step.level]) target[step.level] = [];
      target[step.level].push(step);
    }
  }

  return (
    <div className="av-panel" style={{ marginTop: 16 }}>
      <h2 style={{ margin: "0 0 8px", fontSize: 18 }}>🌳 Merge Sort Recursion Tree</h2>
      <p style={{ margin: "0 0 16px", color: "#9ca3af", fontSize: 14 }}>
        Top half shows how the array is <strong>split</strong> in half repeatedly.
        Bottom half shows how the sorted pieces are <strong>merged</strong> back together.
      </p>

      {/* SPLIT PHASE */}
      <div className="mt-section">
        <div className="mt-label">Split Phase ↓</div>
        {splitRows.map((row, level) => (
          <div className="mt-row" key={`s-${level}`}>
            {row.map((step, idx) => (
              <div className="mt-node mt-split" key={idx}>
                [{step.array.join(", ")}]
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* MERGE PHASE */}
      <div className="mt-section" style={{ marginTop: 16 }}>
        <div className="mt-label">Merge Phase ↑</div>
        {[...mergeRows].reverse().map((row, level) => (
          <div className="mt-row" key={`m-${level}`}>
            {row.map((step, idx) => (
              <div className="mt-node mt-merge" key={idx}>
                [{step.array.join(", ")}]
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
