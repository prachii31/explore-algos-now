import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { AlgoInfo } from "@/components/AlgoInfo";
import { BST_INFO } from "@/utils/algoData";

export const Route = createFileRoute("/bst")({
  head: () => ({
    meta: [
      { title: "Binary Search Tree Visualizer – AlgoVision" },
      { name: "description", content: "Visualize BST insert, delete and search with traversal highlighting." },
    ],
  }),
  component: BSTPage,
});

type Node = { val: number; left: Node | null; right: Node | null };

const insert = (n: Node | null, x: number): Node => {
  if (!n) return { val: x, left: null, right: null };
  if (x < n.val) n.left = insert(n.left, x);
  else if (x > n.val) n.right = insert(n.right, x);
  return n;
};

const minNode = (n: Node): Node => (n.left ? minNode(n.left) : n);

const remove = (n: Node | null, x: number): Node | null => {
  if (!n) return null;
  if (x < n.val) n.left = remove(n.left, x);
  else if (x > n.val) n.right = remove(n.right, x);
  else {
    if (!n.left) return n.right;
    if (!n.right) return n.left;
    const m = minNode(n.right);
    n.val = m.val;
    n.right = remove(n.right, m.val);
  }
  return n;
};

const clone = (n: Node | null): Node | null => n ? { val: n.val, left: clone(n.left), right: clone(n.right) } : null;

type Layout = { val: number; x: number; y: number; parent?: { x: number; y: number } };

const layout = (root: Node | null): { nodes: Layout[]; w: number; h: number } => {
  const nodes: Layout[] = [];
  const dx = 50, dy = 70;
  let nextX = 0;
  const walk = (n: Node | null, depth: number, parent?: { x: number; y: number }): number => {
    if (!n) return 0;
    const lx = walk(n.left, depth + 1, undefined);
    const x = nextX++ * dx + 30;
    const y = depth * dy + 40;
    nodes.push({ val: n.val, x, y, parent });
    walk(n.right, depth + 1, undefined);
    // fix parent linkage after positions are known: handled below
    return lx;
  };
  // Two-pass: compute positions, then set parent coords
  const positions: Layout[] = [];
  let counter = 0;
  const inorder = (n: Node | null, depth: number): Layout | null => {
    if (!n) return null;
    const left = inorder(n.left, depth + 1);
    const me: Layout = { val: n.val, x: counter++ * dx + 30, y: depth * dy + 40 };
    positions.push(me);
    const right = inorder(n.right, depth + 1);
    if (left) (left as Layout).parent = { x: me.x, y: me.y };
    if (right) (right as Layout).parent = { x: me.x, y: me.y };
    return me;
  };
  inorder(root, 0);
  return {
    nodes: positions,
    w: Math.max(counter * dx + 60, 400),
    h: positions.reduce((m, n) => Math.max(m, n.y), 0) + 60,
  };
};

function BSTPage() {
  const [root, setRoot] = useState<Node | null>(() => {
    let r: Node | null = null;
    [50, 30, 70, 20, 40, 60, 80].forEach((v) => { r = insert(r, v); });
    return r;
  });
  const [value, setValue] = useState("");
  const [path, setPath] = useState<number[]>([]);
  const [found, setFound] = useState<number | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const busy = useRef(false);

  const doInsert = () => {
    const v = Number(value); if (!value || Number.isNaN(v)) return;
    setRoot((r) => insert(clone(r), v));
    setValue(""); setMsg(`Inserted ${v}`); setPath([]); setFound(null);
  };
  const doDelete = () => {
    const v = Number(value); if (!value || Number.isNaN(v)) return;
    setRoot((r) => remove(clone(r), v));
    setValue(""); setMsg(`Deleted ${v}`); setPath([]); setFound(null);
  };
  const doSearch = async () => {
    const v = Number(value); if (!value || Number.isNaN(v) || busy.current) return;
    busy.current = true; setPath([]); setFound(null); setMsg(`Searching for ${v}…`);
    let cur = root; const trail: number[] = [];
    while (cur) {
      trail.push(cur.val); setPath([...trail]);
      await new Promise((r) => setTimeout(r, 500));
      if (cur.val === v) { setFound(v); setMsg(`Found ${v}`); busy.current = false; return; }
      cur = v < cur.val ? cur.left : cur.right;
    }
    setMsg(`${v} not found`); busy.current = false;
  };

  const { nodes, w, h } = useMemo(() => layout(root), [root]);

  return (
    <div className="av-container">
      <h1 className="av-page-title">🌳 Binary Search Tree</h1>
      <p className="av-page-sub">Left children &lt; node &lt; right children. Search highlights the traversal path.</p>

      <div className="av-panel">
        <div className="av-controls">
          <div className="av-control-group">
            <label>Value</label>
            <input className="av-input" type="number" value={value}
              onChange={(e) => setValue(e.target.value)} placeholder="Number" />
          </div>
          <button className="av-btn av-btn-green" onClick={doInsert}>Insert</button>
          <button className="av-btn av-btn-red" onClick={doDelete}>Delete</button>
          <button className="av-btn" onClick={doSearch}>Search</button>
          <button className="av-btn av-btn-ghost" onClick={() => { setRoot(null); setMsg("Cleared"); setPath([]); setFound(null); }}>Clear</button>
        </div>
        {msg && <div className="av-msg">{msg}</div>}
      </div>

      <div className="av-panel">
        <div className="av-tree">
          {nodes.length === 0 ? (
            <div style={{ textAlign: "center", color: "var(--av-muted)", padding: 40 }}>Empty tree</div>
          ) : (
            <svg width={w} height={h}>
              {nodes.map((n, i) => n.parent && (
                <line key={`l${i}`} x1={n.parent.x} y1={n.parent.y} x2={n.x} y2={n.y}
                  stroke="#555" strokeWidth={2} />
              ))}
              {nodes.map((n, i) => {
                const fill = found === n.val ? "#10B981"
                  : path.includes(n.val) ? "#F59E0B"
                  : "#2563EB";
                return (
                  <g key={`n${i}`}>
                    <circle cx={n.x} cy={n.y} r={20} fill={fill} stroke="#1E1E1E" strokeWidth={2} />
                    <text x={n.x} y={n.y + 5} textAnchor="middle" fill="#fff" fontWeight={700} fontSize={13}>{n.val}</text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>
      </div>

      <AlgoInfo {...BST_INFO} />
    </div>
  );
}
