import React, { createContext, useState, useCallback } from "react";

const ALERT_TIME = 5000;

const initialState = {
  text: "",
  type: "",
  setAlert: () => {},
};

const AlertContext = createContext(initialState);

export const AlertProvider = ({ children }) => {
  const [alert, setAlertState] = useState({ text: "", type: "" });

  const setAlert = useCallback((text, type) => {
    setAlertState({ text, type });

    const timer = setTimeout(() => {
      setAlertState({ text: "", type: "" });
      clearTimeout(timer);
    }, ALERT_TIME);
  }, []);

  return (
    <AlertContext.Provider value={{ ...alert, setAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export default AlertContext;
