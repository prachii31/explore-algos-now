import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
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
const appCss = "/assets/styles-Bn1siODs.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
const NAV = [
  { to: "/", label: "Home", exact: true },
  { to: "/sorting", label: "Sorting" },
  { to: "/searching", label: "Searching" },
  { to: "/stack", label: "Stack" },
  { to: "/queue", label: "Queue" },
  { to: "/linked-list", label: "Linked List" },
  { to: "/bst", label: "BST" }
];
function Nav() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "av-nav", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "av-nav-brand", children: "⚡ AlgoVision" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "av-nav-links", children: NAV.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: n.to,
        className: "av-nav-link",
        activeOptions: { exact: !!n.exact },
        children: n.label
      },
      n.to
    )) })
  ] });
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-app", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-container", style: { textAlign: "center", paddingTop: 80 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontSize: 72, margin: 0 }, children: "404" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "av-page-sub", children: "Page not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "av-btn", style: { display: "inline-block", marginTop: 16 }, children: "Go home" })
    ] })
  ] });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-app", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-container", style: { textAlign: "center", paddingTop: 80 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Something went wrong" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "av-page-sub", children: error.message }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "av-btn", onClick: () => {
        router.invalidate();
        reset();
      }, children: "Try again" })
    ] })
  ] });
}
const Route$7 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AlgoVision – Interactive Algorithm Visualizer" },
      { name: "description", content: "Interactive visualizer for sorting, searching, and data structure algorithms." },
      { property: "og:title", content: "AlgoVision – Interactive Algorithm Visualizer" },
      { property: "og:description", content: "Visualize sorting, searching, stacks, queues, linked lists and BSTs." },
      { property: "og:type", content: "website" }
    ],
    links: [{ rel: "stylesheet", href: appCss }]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$7.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "av-app", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {})
  ] }) });
}
const $$splitComponentImporter$6 = () => import("./stack-BgppeJd2.mjs");
const Route$6 = createFileRoute("/stack")({
  head: () => ({
    meta: [{
      title: "Stack Visualizer – AlgoVision"
    }, {
      name: "description",
      content: "Visualize Stack operations: push, pop, peek."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./sorting-D-HhreO0.mjs");
const Route$5 = createFileRoute("/sorting")({
  head: () => ({
    meta: [{
      title: "Sorting Algorithms – AlgoVision"
    }, {
      name: "description",
      content: "Visualize Bubble, Selection, Insertion, Merge and Quick Sort step by step."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./searching-CmX8qDTe.mjs");
const Route$4 = createFileRoute("/searching")({
  head: () => ({
    meta: [{
      title: "Searching Algorithms – AlgoVision"
    }, {
      name: "description",
      content: "Visualize Linear and Binary Search step by step."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./queue-CVoAdJoi.mjs");
const Route$3 = createFileRoute("/queue")({
  head: () => ({
    meta: [{
      title: "Queue Visualizer – AlgoVision"
    }, {
      name: "description",
      content: "Visualize Queue operations: enqueue, dequeue, front, rear."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./linked-list-DIRb3w-T.mjs");
const Route$2 = createFileRoute("/linked-list")({
  head: () => ({
    meta: [{
      title: "Linked List Visualizer – AlgoVision"
    }, {
      name: "description",
      content: "Visualize singly linked list operations: insert at head, tail, delete, search."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./bst-D4uD6sRp.mjs");
const Route$1 = createFileRoute("/bst")({
  head: () => ({
    meta: [{
      title: "Binary Search Tree Visualizer – AlgoVision"
    }, {
      name: "description",
      content: "Visualize BST insert, delete and search with traversal highlighting."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-DPgEN8rf.mjs");
const Route = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "AlgoVision – Interactive Algorithm Visualizer"
    }, {
      name: "description",
      content: "Learn algorithms visually: sorting, searching, stacks, queues, linked lists, and binary search trees."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const StackRoute = Route$6.update({
  id: "/stack",
  path: "/stack",
  getParentRoute: () => Route$7
});
const SortingRoute = Route$5.update({
  id: "/sorting",
  path: "/sorting",
  getParentRoute: () => Route$7
});
const SearchingRoute = Route$4.update({
  id: "/searching",
  path: "/searching",
  getParentRoute: () => Route$7
});
const QueueRoute = Route$3.update({
  id: "/queue",
  path: "/queue",
  getParentRoute: () => Route$7
});
const LinkedListRoute = Route$2.update({
  id: "/linked-list",
  path: "/linked-list",
  getParentRoute: () => Route$7
});
const BstRoute = Route$1.update({
  id: "/bst",
  path: "/bst",
  getParentRoute: () => Route$7
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$7
});
const rootRouteChildren = {
  IndexRoute,
  BstRoute,
  LinkedListRoute,
  QueueRoute,
  SearchingRoute,
  SortingRoute,
  StackRoute
};
const routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router;
};
export {
  getRouter
};
