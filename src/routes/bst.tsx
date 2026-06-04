import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AlgoInfo } from "@/components/AlgoInfo";
import { BST_INFO } from "@/utils/algoData";

// Route configuration for the /bst page
export const Route = createFileRoute("/bst")({
  head: () => ({
    meta: [
      { title: "Binary Search Tree Visualizer – AlgoVision" },
      { name: "description", content: "Visualize BST insert, delete and search with traversal highlighting." },
    ],
  }),
  component: BSTPage,
});

// ---------------------------------------------------------------------
// A Binary Search Tree node has a value, a left child and a right child.
// Left children are smaller than the node; right children are larger.
// ---------------------------------------------------------------------
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

// Helper used to pause between search steps so the user can watch
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// INSERT: place a value in the correct spot in the tree
function insert(node: TreeNode | null, value: number): TreeNode {
  // If the spot is empty, create a new node here
  if (node === null) {
    return { val: value, left: null, right: null };
  }
  // Otherwise decide whether to go left or right
  if (value < node.val) {
    node.left = insert(node.left, value);
  } else if (value > node.val) {
    node.right = insert(node.right, value);
  }
  // Duplicate values are ignored
  return node;
}

// Find the smallest node in a subtree (used when deleting)
function findMin(node: TreeNode): TreeNode {
  let current = node;
  while (current.left !== null) {
    current = current.left;
  }
  return current;
}

// DELETE: remove a value from the tree if it exists
function remove(node: TreeNode | null, value: number): TreeNode | null {
  if (node === null) return null;

  if (value < node.val) {
    node.left = remove(node.left, value);
  } else if (value > node.val) {
    node.right = remove(node.right, value);
  } else {
    // Found the node to delete
    if (node.left === null) return node.right;   // case 1: no left child
    if (node.right === null) return node.left;   // case 2: no right child
    // case 3: two children -> replace with smallest from right subtree
    const min = findMin(node.right);
    node.val = min.val;
    node.right = remove(node.right, min.val);
  }
  return node;
}

// Make a deep copy of the tree so React notices the change
function cloneTree(node: TreeNode | null): TreeNode | null {
  if (node === null) return null;
  return {
    val: node.val,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
  };
}

// ---------------------------------------------------------------------
// Layout: figure out (x, y) coordinates for every node so we can draw it.
// We walk the tree in-order so nodes appear left-to-right just like they
// would on paper.
// ---------------------------------------------------------------------
interface LayoutNode {
  val: number;
  x: number;
  y: number;
  parent?: { x: number; y: number };
}

function layoutTree(root: TreeNode | null): { nodes: LayoutNode[]; width: number; height: number } {
  const horizontalGap = 50;
  const verticalGap = 70;
  const nodes: LayoutNode[] = [];
  let counter = 0;

  // Recursive in-order walk; each visit gets the next horizontal slot
  function visit(node: TreeNode | null, depth: number, parent: LayoutNode | null): LayoutNode | null {
    if (node === null) return null;

    const left = visit(node.left, depth + 1, null);

    const me: LayoutNode = {
      val: node.val,
      x: counter * horizontalGap + 30,
      y: depth * verticalGap + 40,
    };
    counter++;
    nodes.push(me);

    const right = visit(node.right, depth + 1, null);

    // Tell the children where their parent is so we can draw connecting lines
    if (left) left.parent = { x: me.x, y: me.y };
    if (right) right.parent = { x: me.x, y: me.y };

    return me;
  }

  visit(root, 0, null);

  // Figure out the size of the SVG canvas
  let maxY = 0;
  for (const n of nodes) {
    if (n.y > maxY) maxY = n.y;
  }

  return {
    nodes,
    width: Math.max(counter * horizontalGap + 60, 400),
    height: maxY + 60,
  };
}

function BSTPage() {
  // Build an initial tree with a few values so the page is not empty
  const [root, setRoot] = useState<TreeNode | null>(() => {
    let tree: TreeNode | null = null;
    const initial = [50, 30, 70, 20, 40, 60, 80];
    for (const v of initial) {
      tree = insert(tree, v);
    }
    return tree;
  });

  const [value, setValue] = useState("");                  // input text
  const [path, setPath] = useState<number[]>([]);          // values visited while searching
  const [found, setFound] = useState<number | null>(null); // node that matched
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);                 // true while search is animating

  // INSERT button handler
  function handleInsert() {
    const v = Number(value);
    if (value === "" || Number.isNaN(v)) return;
    setRoot(insert(cloneTree(root), v));
    setValue("");
    setMsg(`Inserted ${v}`);
    setPath([]);
    setFound(null);
  }

  // DELETE button handler
  function handleDelete() {
    const v = Number(value);
    if (value === "" || Number.isNaN(v)) return;
    setRoot(remove(cloneTree(root), v));
    setValue("");
    setMsg(`Deleted ${v}`);
    setPath([]);
    setFound(null);
  }

  // SEARCH button handler – walk the tree comparing the value at each step
  async function handleSearch() {
    const v = Number(value);
    if (value === "" || Number.isNaN(v) || busy) return;

    setBusy(true);
    setPath([]);
    setFound(null);
    setMsg(`Searching for ${v}…`);

    let current = root;
    const trail: number[] = [];

    while (current !== null) {
      // Record and highlight the current node
      trail.push(current.val);
      setPath([...trail]);
      await sleep(500);

      if (current.val === v) {
        setFound(v);
        setMsg(`Found ${v}`);
        setBusy(false);
        return;
      }

      // Decide which side to go to
      if (v < current.val) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    setMsg(`${v} not found`);
    setBusy(false);
  }

  // Clear the whole tree
  function handleClear() {
    setRoot(null);
    setMsg("Cleared");
    setPath([]);
    setFound(null);
  }

  // Recompute the layout whenever the tree changes
  const { nodes, width, height } = useMemo(() => layoutTree(root), [root]);

  return (
    <div className="av-container">
      <h1 className="av-page-title">🌳 Binary Search Tree</h1>
      <p className="av-page-sub">Left children &lt; node &lt; right children. Search highlights the traversal path.</p>

      {/* Controls */}
      <div className="av-panel">
        <div className="av-controls">
          <div className="av-control-group">
            <label>Value</label>
            <input className="av-input" type="number" value={value}
              onChange={(e) => setValue(e.target.value)} placeholder="Number" />
          </div>
          <button className="av-btn av-btn-green" onClick={handleInsert}>Insert</button>
          <button className="av-btn av-btn-red" onClick={handleDelete}>Delete</button>
          <button className="av-btn" onClick={handleSearch}>Search</button>
          <button className="av-btn av-btn-ghost" onClick={handleClear}>Clear</button>
        </div>
        {msg && <div className="av-msg">{msg}</div>}
      </div>

      {/* Tree drawing using SVG */}
      <div className="av-panel">
        <div className="av-tree">
          {nodes.length === 0 ? (
            <div style={{ textAlign: "center", color: "var(--av-muted)", padding: 40 }}>Empty tree</div>
          ) : (
            <svg width={width} height={height}>
              {/* First draw the lines from each node to its parent */}
              {nodes.map((n, i) =>
                n.parent ? (
                  <line key={`l${i}`}
                    x1={n.parent.x} y1={n.parent.y}
                    x2={n.x} y2={n.y}
                    stroke="#555" strokeWidth={2} />
                ) : null
              )}
              {/* Then draw the circles for each node, on top of the lines */}
              {nodes.map((n, i) => {
                // Pick a colour: green if found, orange if on the path, blue otherwise
                let fill = "#2563EB";
                if (found === n.val) fill = "#10B981";
                else if (path.includes(n.val)) fill = "#F59E0B";
                return (
                  <g key={`n${i}`}>
                    <circle cx={n.x} cy={n.y} r={20} fill={fill} stroke="#1E1E1E" strokeWidth={2} />
                    <text x={n.x} y={n.y + 5} textAnchor="middle" fill="#fff" fontWeight={700} fontSize={13}>
                      {n.val}
                    </text>
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
