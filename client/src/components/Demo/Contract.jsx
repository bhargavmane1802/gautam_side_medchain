import { useEffect, useRef } from "react";

const Contract = ({ value }) => {
  const spanRef = useRef(null);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    el.classList.add("flash");

    const timeoutId = setTimeout(() => {
      el.classList.remove("flash");
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [value]);

  return (
    <code style={{ display: "block", whiteSpace: "pre-wrap" }}>
{`contract SimpleStorage {
  uint256 value = `}
      <span
        ref={spanRef}
        style={{ color: "#1976d2", fontWeight: "bold" }}
      >
        {value}
      </span>
{`;
  
  function read() public view returns (uint256) {
    return value;
  }

  function write(uint256 newValue) public {
    value = newValue;
  }
}`}
    </code>
  );
};

export default Contract;
