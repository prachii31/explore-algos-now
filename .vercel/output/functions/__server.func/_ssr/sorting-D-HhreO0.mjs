import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AlgoInfo, a as SORTING_INFO } from "./algoData-C-jPSavP.mjs";
function saveFrame(array, sorted, comparisons, swaps, highlight = {}) {
  return {
    array: [...array],
    sorted: new Set(sorted),
    comparisons,
    swaps,
    ...highlight
  };
}
function swap(array, i, j) {
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}
function bubbleSort(input) {
  const array = [...input];
  const frames = [];
  const sorted = /* @__PURE__ */ new Set();
  let comparisons = 0;
  let swaps = 0;
  frames.push(saveFrame(
    array,
    sorted,
    comparisons,
    swaps,
    { message: "Starting Bubble Sort" }
  ));
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      comparisons++;
      frames.push(saveFrame(array, sorted, comparisons, swaps, {
        compare: [j, j + 1],
        message: `Comparing ${array[j]} and ${array[j + 1]}`
      }));
      if (array[j] > array[j + 1]) {
        const a = array[j];
        const b = array[j + 1];
        swap(array, j, j + 1);
        swaps++;
        frames.push(saveFrame(array, sorted, comparisons, swaps, {
          current: [j, j + 1],
          message: `Swapping ${a} and ${b}`
        }));
      }
    }
    const finalIdx = array.length - i - 1;
    sorted.add(finalIdx);
    frames.push(saveFrame(array, sorted, comparisons, swaps, {
      message: `${array[finalIdx]} is now in its final sorted position`
    }));
  }
  sorted.add(0);
  frames.push(saveFrame(
    array,
    sorted,
    comparisons,
    swaps,
    { message: "Array is fully sorted ✅" }
  ));
  return frames;
}
function selectionSort(input) {
  const array = [...input];
  const frames = [];
  const sorted = /* @__PURE__ */ new Set();
  let comparisons = 0;
  let swaps = 0;
  frames.push(saveFrame(
    array,
    sorted,
    comparisons,
    swaps,
    { message: "Starting Selection Sort" }
  ));
  for (let i = 0; i < array.length; i++) {
    let minIndex = i;
    frames.push(saveFrame(array, sorted, comparisons, swaps, {
      current: [i],
      message: `Searching for the minimum element from index ${i}`
    }));
    for (let j = i + 1; j < array.length; j++) {
      comparisons++;
      frames.push(saveFrame(array, sorted, comparisons, swaps, {
        compare: [minIndex, j],
        current: [i],
        message: `Comparing ${array[j]} with current minimum ${array[minIndex]}`
      }));
      if (array[j] < array[minIndex]) {
        minIndex = j;
        frames.push(saveFrame(array, sorted, comparisons, swaps, {
          compare: [minIndex],
          current: [i],
          message: `New minimum found: ${array[minIndex]}`
        }));
      }
    }
    if (minIndex !== i) {
      const minVal = array[minIndex];
      swap(array, i, minIndex);
      swaps++;
      frames.push(saveFrame(array, sorted, comparisons, swaps, {
        current: [i, minIndex],
        message: `Placing ${minVal} into its final position`
      }));
    }
    sorted.add(i);
    frames.push(saveFrame(array, sorted, comparisons, swaps, {
      message: `${array[i]} is now in its final sorted position`
    }));
  }
  frames.push(saveFrame(
    array,
    sorted,
    comparisons,
    swaps,
    { message: "Array is fully sorted ✅" }
  ));
  return frames;
}
function insertionSort(input) {
  const array = [...input];
  const frames = [];
  const sorted = /* @__PURE__ */ new Set([0]);
  let comparisons = 0;
  let swaps = 0;
  frames.push(saveFrame(
    array,
    sorted,
    comparisons,
    swaps,
    { message: "Starting Insertion Sort" }
  ));
  for (let i = 1; i < array.length; i++) {
    const inserting = array[i];
    frames.push(saveFrame(array, sorted, comparisons, swaps, {
      current: [i],
      message: `Inserting ${inserting} into the sorted portion`
    }));
    let j = i;
    while (j > 0) {
      comparisons++;
      frames.push(saveFrame(array, sorted, comparisons, swaps, {
        compare: [j - 1, j],
        message: `Comparing ${inserting} with ${array[j - 1]}`
      }));
      if (array[j - 1] > array[j]) {
        const moved = array[j - 1];
        swap(array, j - 1, j);
        swaps++;
        frames.push(saveFrame(array, sorted, comparisons, swaps, {
          current: [j - 1, j],
          message: `Shifting ${moved} to the right`
        }));
        j--;
      } else {
        break;
      }
    }
    sorted.add(i);
    frames.push(saveFrame(array, sorted, comparisons, swaps, {
      message: `Inserted ${inserting} into its correct position`
    }));
  }
  for (let k = 0; k < array.length; k++) sorted.add(k);
  frames.push(saveFrame(
    array,
    sorted,
    comparisons,
    swaps,
    { message: "Array is fully sorted ✅" }
  ));
  return frames;
}
function mergeSort(input) {
  const array = [...input];
  const frames = [];
  const sorted = /* @__PURE__ */ new Set();
  let comparisons = 0;
  let swaps = 0;
  frames.push(saveFrame(
    array,
    sorted,
    comparisons,
    swaps,
    { message: "Starting Merge Sort" }
  ));
  function merge(left, mid, right) {
    const leftPart = array.slice(left, mid + 1);
    const rightPart = array.slice(mid + 1, right + 1);
    frames.push(saveFrame(array, sorted, comparisons, swaps, {
      message: `Merging [${leftPart.join(", ")}] and [${rightPart.join(", ")}]`
    }));
    let i = 0, j = 0, k = left;
    while (i < leftPart.length && j < rightPart.length) {
      comparisons++;
      frames.push(saveFrame(array, sorted, comparisons, swaps, {
        compare: [left + i, mid + 1 + j],
        message: `Comparing ${leftPart[i]} and ${rightPart[j]}`
      }));
      if (leftPart[i] <= rightPart[j]) {
        array[k] = leftPart[i];
        frames.push(saveFrame(array, sorted, comparisons, swaps, {
          current: [k],
          message: `Taking ${leftPart[i]} from the left half`
        }));
        i++;
      } else {
        array[k] = rightPart[j];
        swaps++;
        frames.push(saveFrame(array, sorted, comparisons, swaps, {
          current: [k],
          message: `Taking ${rightPart[j]} from the right half`
        }));
        j++;
      }
      k++;
    }
    while (i < leftPart.length) {
      array[k] = leftPart[i];
      frames.push(saveFrame(array, sorted, comparisons, swaps, {
        current: [k],
        message: `Copying remaining ${leftPart[i]} from the left half`
      }));
      i++;
      k++;
    }
    while (j < rightPart.length) {
      array[k] = rightPart[j];
      frames.push(saveFrame(array, sorted, comparisons, swaps, {
        current: [k],
        message: `Copying remaining ${rightPart[j]} from the right half`
      }));
      j++;
      k++;
    }
    frames.push(saveFrame(array, sorted, comparisons, swaps, {
      message: `Merged subarray: [${array.slice(left, right + 1).join(", ")}]`
    }));
  }
  function sort(left, right) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      frames.push(saveFrame(array, sorted, comparisons, swaps, {
        message: `Splitting [${array.slice(left, right + 1).join(", ")}] into left and right halves`
      }));
      sort(left, mid);
      sort(mid + 1, right);
      merge(left, mid, right);
    }
  }
  sort(0, array.length - 1);
  for (let k = 0; k < array.length; k++) sorted.add(k);
  frames.push(saveFrame(
    array,
    sorted,
    comparisons,
    swaps,
    { message: "Array is fully sorted ✅" }
  ));
  return frames;
}
function quickSort(input) {
  const array = [...input];
  const frames = [];
  const sorted = /* @__PURE__ */ new Set();
  let comparisons = 0;
  let swaps = 0;
  frames.push(saveFrame(
    array,
    sorted,
    comparisons,
    swaps,
    { message: "Starting Quick Sort" }
  ));
  function partition(low, high) {
    const pivotValue = array[high];
    let i = low - 1;
    frames.push(saveFrame(array, sorted, comparisons, swaps, {
      pivot: high,
      message: `Selected pivot ${pivotValue}`
    }));
    for (let j = low; j < high; j++) {
      comparisons++;
      frames.push(saveFrame(array, sorted, comparisons, swaps, {
        compare: [j],
        pivot: high,
        message: `Comparing ${array[j]} with pivot ${pivotValue}`
      }));
      if (array[j] < pivotValue) {
        i++;
        const moved = array[j];
        swap(array, i, j);
        swaps++;
        frames.push(saveFrame(array, sorted, comparisons, swaps, {
          current: [i, j],
          pivot: high,
          message: `Moving ${moved} to the left partition`
        }));
      }
    }
    swap(array, i + 1, high);
    swaps++;
    frames.push(saveFrame(array, sorted, comparisons, swaps, {
      current: [i + 1],
      message: `Placing pivot ${pivotValue} into its final position`
    }));
    return i + 1;
  }
  function quick(low, high) {
    if (low < high) {
      const pivotIndex = partition(low, high);
      sorted.add(pivotIndex);
      quick(low, pivotIndex - 1);
      quick(pivotIndex + 1, high);
    } else if (low === high) {
      sorted.add(low);
    }
  }
  quick(0, array.length - 1);
  for (let k = 0; k < array.length; k++) sorted.add(k);
  frames.push(saveFrame(
    array,
    sorted,
    comparisons,
    swaps,
    { message: "Array is fully sorted ✅" }
  ));
  return frames;
}
const SORTERS = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  merge: mergeSort,
  quick: quickSort
};
function buildSteps(input) {
  const steps = [];
  function recurse(arr, level) {
    steps.push({ type: "split", level, array: [...arr] });
    if (arr.length <= 1) {
      steps.push({ type: "merge", level, array: [...arr] });
      return arr;
    }
    const mid = Math.floor(arr.length / 2);
    const left = recurse(arr.slice(0, mid), level + 1);
    const right = recurse(arr.slice(mid), level + 1);
    const merged = [];
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
function MergeTree({ array, speed, running }) {
  const steps = reactExports.useMemo(() => buildSteps(array), [array]);
  const [shown, setShown] = reactExports.useState(0);
  reactExports.useEffect(() => {
    setShown(0);
  }, [array]);
  reactExports.useEffect(() => {
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
  const visible = steps.slice(0, shown || steps.length);
  const splitRows = [];
  const mergeRows = [];
  for (const step of visible) {
    const target = step.type === "split" ? splitRows : mergeRows;
    if (!target[step.level]) target[step.level] = [];
    target[step.level].push(step);
  }
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-panel", style: { marginTop: 16 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { margin: "0 0 8px", fontSize: 18 }, children: "🌳 Merge Sort Recursion Tree" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { margin: "0 0 16px", color: "#9ca3af", fontSize: 14 }, children: [
      "Top half shows how the array is ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "split" }),
      " in half repeatedly. Bottom half shows how the sorted pieces are ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "merged" }),
      " back together."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-label", children: "Split Phase ↓" }),
      splitRows.filter(Boolean).map((row, level) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-row", children: row.map((step, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-node mt-split", children: [
        "[",
        step.array.join(", "),
        "]"
      ] }, idx)) }, `s-${level}`))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-section", style: { marginTop: 16 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-label", children: "Merge Phase ↑" }),
      [...mergeRows].reverse().filter(Boolean).map((row, level) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-row", children: row.map((step, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-node mt-merge", children: [
        "[",
        step.array.join(", "),
        "]"
      ] }, idx)) }, `m-${level}`))
    ] })
  ] });
}
function randomArray(n) {
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(Math.floor(Math.random() * 99) + 1);
  }
  return arr;
}
function emptyFrame(array) {
  return {
    array,
    sorted: /* @__PURE__ */ new Set(),
    comparisons: 0,
    swaps: 0
  };
}
function speedToDelay(speed) {
  if (speed >= 100) return 0;
  return Math.round(1500 * Math.pow(0.05, (speed - 1) / 99));
}
function SortingPage() {
  const [algo, setAlgo] = reactExports.useState("bubble");
  const [size, setSize] = reactExports.useState(15);
  const [speed, setSpeed] = reactExports.useState(50);
  const [array, setArray] = reactExports.useState([]);
  const [customInput, setCustomInput] = reactExports.useState("");
  const [frame, setFrame] = reactExports.useState(() => emptyFrame([]));
  const [running, setRunning] = reactExports.useState(false);
  const [paused, setPaused] = reactExports.useState(false);
  const [logs, setLogs] = reactExports.useState([]);
  const stopRef = reactExports.useRef(false);
  const pauseRef = reactExports.useRef(false);
  const speedRef = reactExports.useRef(speed);
  const logsRef = reactExports.useRef(null);
  const runningRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    speedRef.current = speed;
  }, [speed]);
  reactExports.useEffect(() => {
    setArray(randomArray(15));
  }, []);
  reactExports.useEffect(() => {
    if (runningRef.current) return;
    setFrame(emptyFrame(array));
    setLogs([]);
  }, [array]);
  reactExports.useEffect(() => {
    if (logsRef.current) logsRef.current.scrollTop = 0;
  }, [logs]);
  function handleSize(newSize) {
    setSize(newSize);
    if (!running) setArray(randomArray(newSize));
  }
  function handleRandom() {
    if (!running) setArray(randomArray(size));
  }
  function handleCustom() {
    const parts = customInput.split(/[\s,]+/);
    const numbers = [];
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
    pauseRef.current = false;
    setRunning(false);
    setPaused(false);
    setFrame(emptyFrame(array));
    setLogs([]);
  }
  function handlePause() {
    if (!running || paused) return;
    pauseRef.current = true;
    setPaused(true);
  }
  function handleResume() {
    if (!paused) return;
    pauseRef.current = false;
    setPaused(false);
  }
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function pushLog(msg) {
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
    pauseRef.current = false;
    setPaused(false);
    setRunning(true);
    runningRef.current = true;
    setLogs([]);
    const steps = SORTERS[algo]([...array]);
    if (speedRef.current >= 100) {
      setFrame(steps[steps.length - 1]);
      pushLog("Sort completed (instant)");
      setRunning(false);
      runningRef.current = false;
      return;
    }
    for (let i = 0; i < steps.length; i++) {
      if (stopRef.current) break;
      while (pauseRef.current && !stopRef.current) {
        await sleep(80);
      }
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
    setPaused(false);
    runningRef.current = false;
  }
  function classFor(index) {
    if (frame.sorted.has(index)) return "av-box sorted";
    if (frame.current && frame.current.includes(index)) return "av-box current";
    if (frame.compare && frame.compare.includes(index)) return "av-box compare";
    if (frame.pivot === index) return "av-box pivot";
    return "av-box";
  }
  function labelFor(index) {
    if (frame.sorted.has(index)) return `${index} (sorted)`;
    if (frame.current && frame.current.includes(index)) return `${index} (current)`;
    if (frame.compare && frame.compare.includes(index)) return `${index} (compare)`;
    if (frame.pivot === index) return `${index} (pivot)`;
    return `${index}`;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "av-page-title", children: "📊 Sorting Algorithms" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "av-page-sub", children: "Pick an algorithm and watch it sort with rectangular boxes." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-controls", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-control-group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Algorithm" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "av-select", value: algo, disabled: running, onChange: (e) => setAlgo(e.target.value), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "bubble", children: "Bubble Sort" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "selection", children: "Selection Sort" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "insertion", children: "Insertion Sort" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "merge", children: "Merge Sort" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "quick", children: "Quick Sort" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-control-group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Array Size: ",
            size
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "av-slider", type: "range", min: 5, max: 25, value: size, disabled: running, onChange: (e) => handleSize(Number(e.target.value)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-control-group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Speed: ",
            speed === 100 ? "Instant" : `${speed}%`
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "av-slider", type: "range", min: 1, max: 100, value: speed, onChange: (e) => setSpeed(Number(e.target.value)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-control-group", style: {
          minWidth: 240,
          flex: 1
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Custom Array (comma separated)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "av-input", placeholder: "e.g. 5, 2, 8, 1, 9", value: customInput, disabled: running, onChange: (e) => setCustomInput(e.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-controls", style: {
        marginTop: 16
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "av-btn av-btn-ghost", onClick: handleCustom, disabled: running, children: "Use Array" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "av-btn av-btn-ghost", onClick: handleRandom, disabled: running, children: "Generate Random Array" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "av-btn av-btn-green", onClick: handleStart, disabled: running, children: running ? "Sorting…" : speed === 100 ? "Instant Sort" : "Start Sorting" }),
        paused ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "av-btn av-btn-green", onClick: handleResume, children: "Resume" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "av-btn av-btn-ghost", onClick: handlePause, disabled: !running, children: "Pause" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "av-btn av-btn-red", onClick: handleReset, children: "Reset" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-stats", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-stat", children: [
          "Comparisons",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: frame.comparisons })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-stat", children: [
          "Swaps",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: frame.swaps })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-stat", children: [
          "Status",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: paused ? "Paused" : running ? "Running" : "Idle" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "av-section-title", children: "Array Visualization" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "av-boxes", children: frame.array.map((value, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-box-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: classFor(index), children: value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "av-box-label", children: labelFor(index) })
      ] }, index)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-step", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "av-step-label", children: "Current Step" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-legend", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "av-legend-item", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "av-dot current" }),
            " Current element being inserted"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "av-legend-item", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "av-dot compare" }),
            " Element being compared"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "av-legend-item", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "av-dot sorted" }),
            " Sorted portion"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "av-step-text", children: frame.message || "Ready to sort" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-log-header", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "av-section-title", style: {
          margin: 0
        }, children: "Log Tracer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "av-log-count", children: [
          logs.length,
          " step",
          logs.length === 1 ? "" : "s"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "av-log-panel", ref: logsRef, children: logs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "av-log-empty", children: "Logs will appear here as the algorithm runs." }) : logs.map((line, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `av-log-line ${i === 0 ? "is-latest" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "av-log-index", children: [
          "#",
          logs.length - i
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "av-log-text", children: line })
      ] }, logs.length - i)) })
    ] }),
    algo === "merge" && /* @__PURE__ */ jsxRuntimeExports.jsx(MergeTree, { array, speed, running }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlgoInfo, { ...SORTING_INFO[algo] })
  ] });
}
export {
  SortingPage as component
};
