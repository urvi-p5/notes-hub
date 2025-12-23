import "./global.css";

import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./src/pages/dashboard";
import CreateNote from "./src/pages/notes/create";
import EditNote from "./src/pages/notes/edit";
import ViewNote from "./src/pages/notes/view";
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/notes/create" element={<CreateNote />} />
      <Route path="/notes/edit/:id" element={<EditNote />} />
      <Route path="/notes/:id" element={<ViewNote />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

createRoot(document.getElementById("root")!).render(<App />);
