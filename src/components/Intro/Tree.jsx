import React from "react";

const Tree = () => (
  <code style={{ whiteSpace: "pre-line" }}>
    {`.\n`}
    {`├── client`}
    <span style={{ color: "#1976d2" }}>{`   # React project (Vite + React 18)\n`}</span>
    {`└── truffle`}
    <span style={{ color: "#1976d2" }}>{`  # Truffle project`}</span>
  </code>
);

export default Tree;
