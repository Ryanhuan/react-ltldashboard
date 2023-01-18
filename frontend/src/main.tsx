import "./main.scss";
import '@/css/reset.css'
import '@/css/animates.scss'
import 'bootstrap/dist/css/bootstrap.min.css';

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container as HTMLDivElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
