import { BrowserRouter, Route, Routes } from "react-router-dom";

import { NotFound } from "../pages/NotFound";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
