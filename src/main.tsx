import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "./store";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: "#1e1b4b",
            color: "#e2e8f0",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
        }}
      />
    </Provider>
  </StrictMode>,
);
