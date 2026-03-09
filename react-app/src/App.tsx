import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import LoadView from "./views/LoadView";
import FilterView from "./views/FilterView";
import FormView from "./views/FormView";

function MetricsPageSetter() {
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname;
    const name =
      path === "/load"
        ? "Load"
        : path === "/filter"
          ? "Filter"
          : path === "/form"
            ? "Form"
            : path;
    (window as any).__metrics?.setPage?.(name);
  }, [location.pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <MetricsPageSetter />
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow p-4 flex gap-4 justify-center">
          <Link to="/load" className="text-blue-600 hover:underline">
            Load
          </Link>
          <Link to="/filter" className="text-blue-600 hover:underline">
            Filter
          </Link>
          <Link to="/form" className="text-blue-600 hover:underline">
            Form
          </Link>
        </nav>
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/load" replace />} />
            <Route path="/load" element={<LoadView />} />
            <Route path="/filter" element={<FilterView />} />
            <Route path="/form" element={<FormView />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
