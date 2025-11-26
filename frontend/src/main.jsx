import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Link, Route, Routes } from "react-router";
import PIBNews from "./pages/PIBNews.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
          <Routes>
            <Route path="/" element={ <App />} />
            <Route path="/pib" element={<PIBNews />} />

          </Routes>
  </BrowserRouter>
);
