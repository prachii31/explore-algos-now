import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AlgoInfo, L as LL_INFO } from "./algoData-C-jPSavP.mjs";
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function LinkedListPage() {
  const [list, setList] = reactExports.useState([10, 20, 30]);
  const [value, setValue] = reactExports.useState("");
  const [highlight, setHighlight] = reactExports.useState(null);
  const [found, setFound] = reactExports.useState(null);
  const [msg, setMsg] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState(false);
  function clearHighlights() {
    setHighlight(null);
    setFound(null);
  }
  function insertHead() {
    const v = Number(value);
    if (value === "" || Number.isNaN(v)) return;
    clearHighlights();
    setList([v, ...list]);
    setValue("");
    setMsg(`Inserted ${v} at beginning`);
  }
  function insertTail() {
    const v = Number(value);
    if (value === "" || Number.isNaN(v)) return;
    clearHighlights();
    setList([...list, v]);
    setValue("");
    setMsg(`Inserted ${v} at end`);
  }
  function deleteNode() {
    const v = Number(value);
    if (value === "" || Number.isNaN(v)) return;
    const idx = list.indexOf(v);
    if (idx === -1) {
      setMsg(`${v} not found`);
      return;
    }
    clearHighlights();
    const newList = list.filter((_, i) => i !== idx);
    setList(newList);
    setValue("");
    setMsg(`Deleted ${v}`);
  }
  async function search() {
    const v = Number(value);
    if (value === "" || Number.isNaN(v) || busy) return;
    setBusy(true);
    clearHighlights();
    setMsg(`Searching for ${v}…`);
    for (let i = 0; i < list.length; i++) {
      setHighlight(i);
      await sleep(500);
      if (list[i] === v) {
        setFound(i);
        setHighlight(null);
        setMsg(`Found ${v} at position ${i}`);
        setBusy(false);
        return;
      }
    }
    setHighlight(null);
    setMsg(`${v} not found`);
    setBusy(false);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "av-page-title", children: "🔗 Linked List Visualizer" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "av-page-sub", children: "Nodes connected by pointers, traversed one link at a time." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-controls", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-control-group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Value" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "av-input", type: "number", value, onChange: (e) => setValue(e.target.value), placeholder: "Number" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "av-btn av-btn-green", onClick: insertHead, children: "Insert at Beginning" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "av-btn av-btn-green", onClick: insertTail, children: "Insert at End" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "av-btn av-btn-red", onClick: deleteNode, children: "Delete Node" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "av-btn", onClick: search, children: "Search Node" })
      ] }),
      msg && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "av-msg", children: msg })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "av-panel", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-ll", children: [
      list.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        color: "var(--av-muted)"
      }, children: "Empty list" }),
      list.map((v, i) => {
        const isHighlighted = highlight === i;
        const isFound = found === i;
        const cls = `av-ll-box ${isHighlighted ? "highlight" : ""} ${isFound ? "found" : ""}`;
        const isLast = i === list.length - 1;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-ll-node", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cls, children: v }),
          isLast ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "av-ll-arrow", children: "→" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "av-ll-null", children: "NULL" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "av-ll-arrow", children: "→" })
        ] }, i);
      })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlgoInfo, { ...LL_INFO })
  ] });
}
export {
  LinkedListPage as component
};
