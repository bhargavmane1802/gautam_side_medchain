import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

const EthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(async (artifact) => {
    if (!artifact) return;

    try {
      const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
      const accounts = await web3.eth.requestAccounts();
      const networkID = await web3.eth.net.getId();
      const { abi } = artifact;

      let contract = null;
      let address = null;
      let role = "unknown";

      if (artifact.networks[networkID]) {
        address = artifact.networks[networkID].address;
        contract = new web3.eth.Contract(abi, address);
        
        // Fetch role from the new contract logic
        try {
          role = await contract.methods.getSenderRole().call({ from: accounts[0] });
        } catch (e) {
          console.error("Could not fetch role:", e);
        }
      }

      dispatch({
        type: actions.init,
        data: { artifact, web3, accounts, networkID, contract, role, loading: false },
      });
    } catch (err) {
      console.error("Initialization error:", err);
      dispatch({ type: actions.init, data: { loading: false } });
    }
  }, []);

  useEffect(() => {
    const tryInit = async () => {
      try {
        const artifact = await import("../../contracts/EHR.json");
        init(artifact.default || artifact);
      } catch (err) {
        console.error("Artifact import error:", err);
      }
    };

    tryInit();
  }, [init]);

  useEffect(() => {
    const handleChange = () => init(state.artifact);
    const events = ["chainChanged", "accountsChanged"];

    if (window.ethereum) {
      events.forEach((e) => window.ethereum.on(e, handleChange));
    }

    return () => {
      if (window.ethereum) {
        events.forEach((e) => window.ethereum.removeListener(e, handleChange));
      }
    };
  }, [init, state.artifact]);

  return <EthContext.Provider value={{ state, dispatch }}>{children}</EthContext.Provider>;
};

export default EthProvider;