import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AlgoInfo, Q as QUEUE_INFO } from "./algoData-C-jPSavP.mjs";
function QueuePage() {
  const [queue, setQueue] = reactExports.useState([]);
  const [value, setValue] = reactExports.useState("");
  const [msg, setMsg] = reactExports.useState(null);
  function enqueue() {
    const v = Number(value);
    if (value === "" || Number.isNaN(v)) return;
    setQueue([...queue, v]);
    setValue("");
    setMsg(`Enqueued ${v}`);
  }
  function dequeue() {
    if (queue.length === 0) {
      setMsg("Queue is empty");
      return;
    }
    const front = queue[0];
    setQueue(queue.slice(1));
    setMsg(`Dequeued ${front}`);
  }
  function showFront() {
    if (queue.length === 0) {
      setMsg("Queue is empty");
      return;
    }
    setMsg(`Front: ${queue[0]}`);
  }
  function showRear() {
    if (queue.length === 0) {
      setMsg("Queue is empty");
      return;
    }
    setMsg(`Rear: ${queue[queue.length - 1]}`);
  }
  function clear() {
    setQueue([]);
    setMsg("Cleared");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "av-page-title", children: "🚶 Queue Visualizer" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "av-page-sub", children: "First In, First Out (FIFO) — enqueue at rear, dequeue from front." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-controls", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-control-group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Value" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "av-input", type: "number", value, onChange: (e) => setValue(e.target.value), placeholder: "Number" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "av-btn av-btn-green", onClick: enqueue, children: "Enqueue" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "av-btn av-btn-red", onClick: dequeue, children: "Dequeue" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "av-btn av-btn-ghost", onClick: showFront, children: "Front" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "av-btn av-btn-ghost", onClick: showRear, children: "Rear" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "av-btn av-btn-ghost", onClick: clear, children: "Clear" })
      ] }),
      msg && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "av-msg", children: msg })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "flex",
        justifyContent: "space-between",
        color: "var(--av-muted)",
        fontSize: 13,
        marginBottom: 6
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "← FRONT" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "REAR →" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-queue", children: [
        queue.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          color: "var(--av-muted)",
          margin: "auto"
        }, children: "Empty queue" }),
        queue.map((v, i) => {
          const isFront = i === 0;
          const isRear = i === queue.length - 1;
          const cls = `av-queue-item ${isFront ? "front" : ""} ${isRear ? "rear" : ""}`;
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cls, children: v }, i);
        })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlgoInfo, { ...QUEUE_INFO })
  ] });
}
export {
  QueuePage as component
};
