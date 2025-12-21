import React from "react";
import { EthProvider } from "./contexts/EthContext";
import { AlertProvider } from "./contexts/AlertContext/AlertContext";
import { useRoutes } from "react-router-dom";
import routes from "./routes";

function App() {
  const content = useRoutes(routes);

  return (
    <EthProvider>
      <AlertProvider>{content}</AlertProvider>
    </EthProvider>
  );
}

export default App;
