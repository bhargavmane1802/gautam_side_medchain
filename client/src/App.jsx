import React, { useContext } from "react";
import { EthProvider } from "./contexts/EthContext";
import EthContext from "./contexts/EthContext/EthContext";
import { AlertProvider } from "./contexts/AlertContext/AlertContext";
import { useRoutes, useLocation, Navigate } from "react-router-dom";
import routes from "./routes";
import Register from "./components/Register";
import Home from "./pages/Home";

window.global = window;

function AppContent() {
  const { state } = useContext(EthContext);
  const location = useLocation();
  
  const content = useRoutes(routes);

  // 1. Show loader while connecting to MetaMask/Blockchain
  if (state.loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        fontSize: "1.5rem" 
      }}>
        Loading Blockchain Data...
      </div>
    );
  }

  // 2. If user is not registered at all, show the Register/Home view
  // Only show Register if they are on the root path and are unknown
  if (state.role === "unknown" && location.pathname === "/") {
    return <div id="App"><Home /></div>; 
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