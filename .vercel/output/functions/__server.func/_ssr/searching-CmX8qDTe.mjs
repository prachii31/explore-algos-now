import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AlgoInfo, b as SEARCHING_INFO } from "./algoData-C-jPSavP.mjs";
function randomArray(n) {
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(Math.floor(Math.random() * 99) + 1);
  }
  return arr;
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function SearchingPage() {
  const [algo, setAlgo] = reactExports.useState("linear");
  const [array, setArray] = reactExports.useState(() => randomArray(12));
  const [customInput, setCustomInput] = reactExports.useState("");
  const [target, setTarget] = reactExports.useState(0);
  const [speed, setSpeed] = reactExports.useState(50);
  const [activeIndex, setActiveIndex] = reactExports.useState(null);
  const [foundIndex, setFoundIndex] = reactExports.useState(null);
  const [comparisons, setComparisons] = reactExports.useState(0);
  const [running, setRunning] = reactExports.useState(false);
  const [stopRequested, setStopRequested] = reactExports.useState(false);
  const [msg, setMsg] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (array.length > 0) {
      setTarget(array[Math.floor(Math.random() * array.length)]);
    }
  }, []);
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
    const parts = customInput.split(/[\s,]+/);
    const numbers = [];
    for (const p of parts) {
      const n = Number(p);
      if (!Number.isNaN(n)) numbers.push(n);
    }
    if (numbers.length >= 2 && numbers.length <= 25) {
      setArray(numbers);
      resetVisualization();
    }
  }
  function stepDelay() {
    return 610 - speed * 6;
  }
  async function runLinearSearch() {
    const arr = [...array];
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
      if (stopRequested) return;
      setActiveIndex(i);
      count++;
      setComparisons(count);
      await sleep(stepDelay());
      if (arr[i] === target) {
        setFoundIndex(i);
        setMsg({
          text: `Found ${target} at index ${i}!`,
          type: "success"
        });
        return;
      }
    }
    setMsg({
      text: `${target} not found in array.`,
      type: "error"
    });
  }
  async function runBinarySearch() {
    const arr = [...array].sort((a, b) => a - b);
    setArray(arr);
    let low = 0;
    let high = arr.length - 1;
    let count = 0;
    while (low <= high) {
      if (stopRequested) return;
      const mid = Math.floor((low + high) / 2);
      setActiveIndex(mid);
      count++;
      setComparisons(count);
      await sleep(stepDelay());
      if (arr[mid] === target) {
        setFoundIndex(mid);
        setMsg({
          text: `Found ${target} at index ${mid}!`,
          type: "success"
        });
        return;
      }
      if (arr[mid] < target) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    setMsg({
      text: `${target} not found in array.`,
      type: "error"
    });
  }
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
  function classFor(index) {
    if (foundIndex === index) return "av-box sorted";
    if (activeIndex === index) return "av-box compare";
    return "av-box";
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "av-page-title", children: "🔍 Searching Algorithms" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "av-page-sub", children: "Find a target value within an array." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-controls", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-control-group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Algorithm" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "av-select", value: algo, disabled: running, onChange: (e) => setAlgo(e.target.value), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "linear", children: "Linear Search" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "binary", children: "Binary Search (auto-sorted)" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-control-group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Target" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "av-input", type: "number", value: target, disabled: running, onChange: (e) => setTarget(Number(e.target.value)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-control-group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Speed: ",
            speed,
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "av-slider", type: "range", min: 1, max: 100, value: speed, onChange: (e) => setSpeed(Number(e.target.value)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-control-group", style: {
          minWidth: 240,
          flex: 1
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Custom Array" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "av-input", placeholder: "e.g. 1, 3, 5, 7, 9", value: customInput, disabled: running, onChange: (e) => setCustomInput(e.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-controls", style: {
        marginTop: 16
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "av-btn av-btn-ghost", onClick: handleCustom, disabled: running, children: "Use Array" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "av-btn av-btn-ghost", onClick: handleRandom, disabled: running, children: "Random Array" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "av-btn av-btn-green", onClick: handleStart, disabled: running, children: running ? "Searching…" : "Search" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "av-btn av-btn-red", onClick: resetVisualization, children: "Reset" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "av-stats", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-stat", children: [
        "Comparisons",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: comparisons })
      ] }) }),
      msg && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `av-msg ${msg.type}`, children: msg.text })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "av-panel", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "av-boxes", children: array.map((value, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: classFor(index), children: value }, index)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlgoInfo, { ...SEARCHING_INFO[algo] })
  ] });
}
export {
  SearchingPage as component
};
