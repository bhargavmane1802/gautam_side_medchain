import React, { useContext } from "react";
import { EthProvider } from "./contexts/EthContext";
import EthContext from "./contexts/EthContext/EthContext";
import { AlertProvider } from "./contexts/AlertContext/AlertContext";
import { useRoutes, Navigate } from "react-router-dom";
import routes from "./routes"; // Verify this import points to the correct file
import Register from "./components/Register";

window.global = window;

function AppContent() {
  const { state } = useContext(EthContext);
  
  // FIX: Added a safety check to ensure routes is an array before passing to useRoutes
  const routesArray = Array.isArray(routes) ? routes : [];
  const content = useRoutes(routesArray);

  if (state.loading) {
    return <div style={{ textAlign: "center", marginTop: "20%" }}>Loading Blockchain Data...</div>;
  }

  if (state.role === "unknown") {
    return <Register />;
  }

  // Redirect logic to send doctors/patients to their specific dashboards
  if (window.location.pathname === "/") {
    if (state.role === "doctor") return <Navigate to="/doctor" replace />;
    if (state.role === "patient") return <Navigate to="/patient" replace />;
  }

  return <div id="App">{content}</div>;
}

function App() {
  return (
    <EthProvider>
      <AlertProvider>
        <AppContent />
      </AlertProvider>
    </EthProvider>
  );
}

export default App;