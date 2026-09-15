import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";

import App from "./App";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

createRoot(
  document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Toaster position="top-center" />
  </StrictMode>
);