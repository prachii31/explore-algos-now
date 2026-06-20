import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AlgoInfo, S as STACK_INFO } from "./algoData-C-jPSavP.mjs";
function StackPage() {
  const [stack, setStack] = reactExports.useState([]);
  const [value, setValue] = reactExports.useState("");
  const [msg, setMsg] = reactExports.useState(null);
  function push() {
    const v = Number(value);
    if (value === "" || Number.isNaN(v)) return;
    setStack([...stack, v]);
    setValue("");
    setMsg(`Pushed ${v}`);
  }
  function pop() {
    if (stack.length === 0) {
      setMsg("Stack is empty");
      return;
    }
    const top = stack[stack.length - 1];
    setStack(stack.slice(0, -1));
    setMsg(`Popped ${top}`);
  }
  function peek() {
    if (stack.length === 0) {
      setMsg("Stack is empty");
      return;
    }
    setMsg(`Top element is ${stack[stack.length - 1]}`);
  }
  function clear() {
    setStack([]);
    setMsg("Cleared");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "av-page-title", children: "🥞 Stack Visualizer" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "av-page-sub", children: "Last In, First Out (LIFO) — operations happen at the top." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-controls", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-control-group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Value" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "av-input", type: "number", value, onChange: (e) => setValue(e.target.value), placeholder: "Number" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "av-btn av-btn-green", onClick: push, children: "Push" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "av-btn av-btn-red", onClick: pop, children: "Pop" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "av-btn av-btn-ghost", onClick: peek, children: "Peek" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "av-btn av-btn-ghost", onClick: clear, children: "Clear" })
      ] }),
      msg && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "av-msg", children: msg })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        textAlign: "center",
        color: "var(--av-muted)",
        marginBottom: 8,
        fontSize: 13
      }, children: "← TOP" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-stack", children: [
        stack.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          color: "var(--av-muted)"
        }, children: "Empty stack" }),
        stack.map((v, i) => {
          const isTop = i === stack.length - 1;
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `av-stack-item ${isTop ? "top" : ""}`, children: v }, i);
        })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlgoInfo, { ...STACK_INFO })
  ] });
}
export {
  StackPage as component
};
