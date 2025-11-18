import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import RoutesMeeting5 from "./routes/RoutesMeeting5";
import "./index.css";
import { UserProvider } from "./context/UserContext";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <RoutesMeeting5 />
        <Toaster richColors position="top-right" />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
