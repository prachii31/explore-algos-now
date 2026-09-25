import {
  Outlet,
  Link,
  createRootRoute,
  useRouter,
} from "@tanstack/react-router";




const NAV: Array<{ to: string; label: string; exact?: boolean }> = [
  { to: "/", label: "Home", exact: true },
  { to: "/sorting", label: "Sorting" },
  { to: "/searching", label: "Searching" },
  { to: "/stack", label: "Stack" },
  { to: "/queue", label: "Queue" },
  { to: "/linked-list", label: "Linked List" },
  { to: "/bst", label: "BST" },
];

function Nav() {
  return (
    <nav className="av-nav">
      <Link to="/" className="av-nav-brand">⚡ AlgoVision</Link>
      <div className="av-nav-links">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to as "/"}
            className="av-nav-link"
            activeOptions={{ exact: !!n.exact }}
          >
            {n.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

function NotFoundComponent() {
  return (
    <div className="av-app">
      <Nav />
      <div className="av-container" style={{ textAlign: "center", paddingTop: 80 }}>
        <h1 style={{ fontSize: 72, margin: 0 }}>404</h1>
        <p className="av-page-sub">Page not found</p>
        <Link to="/" className="av-btn" style={{ display: "inline-block", marginTop: 16 }}>Go home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  
  return (
    <div className="av-app">
      <Nav />
      <div className="av-container" style={{ textAlign: "center", paddingTop: 80 }}>
        <h1>Something went wrong</h1>
        <p className="av-page-sub">{error.message}</p>
        <button className="av-btn" onClick={() => { router.invalidate(); reset(); }}>Try again</button>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  return (
    <div className="av-app">
      <Nav />
      <Outlet />
    </div>
  );
}