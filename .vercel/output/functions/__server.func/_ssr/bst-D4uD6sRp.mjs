import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { A as AlgoInfo, B as BST_INFO } from "./algoData-C-jPSavP.mjs";
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function insert(node, value) {
  if (node === null) {
    return {
      val: value,
      left: null,
      right: null
    };
  }
  if (value < node.val) {
    node.left = insert(node.left, value);
  } else if (value > node.val) {
    node.right = insert(node.right, value);
  }
  return node;
}
function findMin(node) {
  let current = node;
  while (current.left !== null) {
    current = current.left;
  }
  return current;
}
function remove(node, value) {
  if (node === null) return null;
  if (value < node.val) {
    node.left = remove(node.left, value);
  } else if (value > node.val) {
    node.right = remove(node.right, value);
  } else {
    if (node.left === null) return node.right;
    if (node.right === null) return node.left;
    const min = findMin(node.right);
    node.val = min.val;
    node.right = remove(node.right, min.val);
  }
  return node;
}
function cloneTree(node) {
  if (node === null) return null;
  return {
    val: node.val,
    left: cloneTree(node.left),
    right: cloneTree(node.right)
  };
}
function layoutTree(root) {
  const horizontalGap = 50;
  const verticalGap = 70;
  const nodes = [];
  let counter = 0;
  function visit(node, depth, parent) {
    if (node === null) return null;
    const left = visit(node.left, depth + 1);
    const me = {
      val: node.val,
      x: counter * horizontalGap + 30,
      y: depth * verticalGap + 40
    };
    counter++;
    nodes.push(me);
    const right = visit(node.right, depth + 1);
    if (left) left.parent = {
      x: me.x,
      y: me.y
    };
    if (right) right.parent = {
      x: me.x,
      y: me.y
    };
    return me;
  }
  visit(root, 0);
  let maxY = 0;
  for (const n of nodes) {
    if (n.y > maxY) maxY = n.y;
  }
  return {
    nodes,
    width: Math.max(counter * horizontalGap + 60, 400),
    height: maxY + 60
  };
}
function BSTPage() {
  const [root, setRoot] = reactExports.useState(() => {
    let tree = null;
    const initial = [50, 30, 70, 20, 40, 60, 80];
    for (const v of initial) {
      tree = insert(tree, v);
    }
    return tree;
  });
  const [value, setValue] = reactExports.useState("");
  const [path, setPath] = reactExports.useState([]);
  const [found, setFound] = reactExports.useState(null);
  const [msg, setMsg] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState(false);
  function handleInsert() {
    const v = Number(value);
    if (value === "" || Number.isNaN(v)) return;
    setRoot(insert(cloneTree(root), v));
    setValue("");
    setMsg(`Inserted ${v}`);
    setPath([]);
    setFound(null);
  }
  function handleDelete() {
    const v = Number(value);
    if (value === "" || Number.isNaN(v)) return;
    setRoot(remove(cloneTree(root), v));
    setValue("");
    setMsg(`Deleted ${v}`);
    setPath([]);
    setFound(null);
  }
  async function handleSearch() {
    const v = Number(value);
    if (value === "" || Number.isNaN(v) || busy) return;
    setBusy(true);
    setPath([]);
    setFound(null);
    setMsg(`Searching for ${v}…`);
    let current = root;
    const trail = [];
    while (current !== null) {
      trail.push(current.val);
      setPath([...trail]);
      await sleep(500);
      if (current.val === v) {
        setFound(v);
        setMsg(`Found ${v}`);
        setBusy(false);
        return;
      }
      if (v < current.val) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    setMsg(`${v} not found`);
    setBusy(false);
  }
  function handleClear() {
    setRoot(null);
    setMsg("Cleared");
    setPath([]);
    setFound(null);
  }
  const {
    nodes,
    width,
    height
  } = reactExports.useMemo(() => layoutTree(root), [root]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "av-page-title", children: "🌳 Binary Search Tree" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "av-page-sub", children: "Left children < node < right children. Search highlights the traversal path." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-controls", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-control-group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Value" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "av-input", type: "number", value, onChange: (e) => setValue(e.target.value), placeholder: "Number" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "av-btn av-btn-green", onClick: handleInsert, children: "Insert" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "av-btn av-btn-red", onClick: handleDelete, children: "Delete" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "av-btn", onClick: handleSearch, children: "Search" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "av-btn av-btn-ghost", onClick: handleClear, children: "Clear" })
      ] }),
      msg && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "av-msg", children: msg })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "av-panel", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "av-tree", children: nodes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      textAlign: "center",
      color: "var(--av-muted)",
      padding: 40
    }, children: "Empty tree" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width, height, children: [
      nodes.map((n, i) => n.parent ? /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: n.parent.x, y1: n.parent.y, x2: n.x, y2: n.y, stroke: "#555", strokeWidth: 2 }, `l${i}`) : null),
      nodes.map((n, i) => {
        let fill = "#2563EB";
        if (found === n.val) fill = "#10B981";
        else if (path.includes(n.val)) fill = "#F59E0B";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: n.x, cy: n.y, r: 20, fill, stroke: "#1E1E1E", strokeWidth: 2 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: n.x, y: n.y + 5, textAnchor: "middle", fill: "#fff", fontWeight: 700, fontSize: 13, children: n.val })
        ] }, `n${i}`);
      })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlgoInfo, { ...BST_INFO })
  ] });
}
export {
  BSTPage as component
};
