import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/reset.css';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme/index.js';


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
    <ThemeProvider theme={theme.default}>
      <App />
    </ThemeProvider>
  // </React.StrictMode>
);