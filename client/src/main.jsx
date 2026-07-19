import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <App />

    <Toaster
      position="top-right"
      containerStyle={{
        top: 20,
        right: 20,
        zIndex: 999999,
      }}
    />
  </>
);