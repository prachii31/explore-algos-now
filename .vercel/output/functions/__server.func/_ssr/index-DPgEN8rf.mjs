import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const CARDS = [{
  to: "/searching",
  icon: "🔍",
  title: "Searching Algorithms",
  desc: "Visualize Linear and Binary Search step-by-step."
}, {
  to: "/sorting",
  icon: "📊",
  title: "Sorting Algorithms",
  desc: "Bubble, Selection, Insertion, Merge & Quick Sort."
}, {
  to: "/stack",
  icon: "🥞",
  title: "Stack",
  desc: "LIFO data structure with Push, Pop and Peek."
}, {
  to: "/queue",
  icon: "🚶",
  title: "Queue",
  desc: "FIFO data structure with Enqueue and Dequeue."
}, {
  to: "/linked-list",
  icon: "🔗",
  title: "Linked List",
  desc: "Insert, delete and search nodes with pointers."
}, {
  to: "/bst",
  icon: "🌳",
  title: "Binary Search Tree",
  desc: "Insert, delete and search in a BST."
}];
function Home() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "av-hero", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "AlgoVision" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "An interactive playground to learn how classic algorithms and data structures actually work — visualize every comparison, swap, and pointer in real time." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "av-container", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "av-grid", children: CARDS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: c.to, className: "av-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "av-card-icon", children: c.icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: c.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: c.desc })
    ] }, c.to)) }) })
  ] });
}
export {
  Home as component
};
