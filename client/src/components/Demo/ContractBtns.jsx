import { useState, useCallback } from "react";
import useEth from "../../contexts/EthContext/useEth";

const ContractBtns = ({ setValue }) => {
  const {
    state: { contract, accounts },
  } = useEth();

  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    const val = e.target.value;
    // Only allow numbers
    if (/^\d*$/.test(val)) setInputValue(val);
  };

  const read = useCallback(async () => {
    if (!contract || !accounts?.length) return;

    try {
      const value = await contract.methods.read().call({
        from: accounts[0],
      });
      setValue(value);
    } catch (err) {
      console.error("Read failed:", err);
    }
  }, [contract, accounts, setValue]);

  const write = useCallback(async () => {
    if (!contract || !accounts?.length) return;

    if (inputValue === "") {
      alert("Please enter a value to write.");
      return;
    }

    const newValue = Number(inputValue);

    try {
      await contract.methods.write(newValue).send({
        from: accounts[0],
      });
      setInputValue("");
    } catch (err) {
      console.error("Write failed:", err);
    }
  }, [contract, accounts, inputValue]);

  return (
    <div className="btns" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      <button onClick={read}>read()</button>

      <div className="input-btn" style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          placeholder="uint"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button onClick={write}>write</button>
      </div>
    </div>
  );
};

export default ContractBtns;
