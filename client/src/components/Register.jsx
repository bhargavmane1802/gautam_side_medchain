import { useContext, useState } from "react";
import EthContext from "../contexts/EthContext/EthContext";

const Register = () => {
  const { state: { contract, accounts } } = useContext(EthContext);
  const [loading, setLoading] = useState(false);

  const registerAsDoctor = async () => {
    if (!contract || !accounts) {
      alert("Wallet not connected correctly.");
      return;
    }
    
    setLoading(true);
    try {
      // Calls addDoctor() from EHR.sol
      await contract.methods.addDoctor().send({ from: accounts[0] });
      alert("Registration Successful!");
      window.location.reload(); // Reloads to let EthProvider fetch the new 'doctor' role
    } catch (err) {
      console.error("Registration failed", err);
      alert("Transaction failed or rejected.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Welcome to MedChain</h1>
      <p>You are currently logged in as: <strong>{accounts?.[0]}</strong></p>
      <p style={{ color: 'red' }}>Status: Not Registered</p>
      <button 
        onClick={registerAsDoctor} 
        disabled={loading}
        style={{
          padding: '12px 24px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? "Processing..." : "Register as Doctor"}
      </button>
    </div>
  );
};

export default Register;