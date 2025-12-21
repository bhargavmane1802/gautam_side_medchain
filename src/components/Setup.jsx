import React from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";

const Setup = () => {
  return (
    <Box sx={{ p: { xs: 2, sm: 5 }, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" mb={3}>
        Preparation
      </Typography>

      <Paper variant="outlined" sx={{ p: 3, mb: 2 }}>
        <details>
          <summary>
            <Typography variant="h6">Install</Typography>
          </summary>
          <Typography mt={1}>
            Install Truffle and Ganache globally.
          </Typography>
          <Box
            component="code"
            sx={{
              display: "block",
              mt: 1,
              p: 1,
              bgcolor: "grey.100",
              borderRadius: 1,
              fontFamily: "monospace",
            }}
          >
            $ npm install -g truffle ganache
          </Box>
        </details>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, mb: 2 }}>
        <details>
          <summary>
            <Typography variant="h6">Ganache and MetaMask</Typography>
          </summary>
          <Typography mt={1}>
            Open a terminal and run Ganache, a simulated Ethereum blockchain on your machine.
          </Typography>
          <Box
            component="code"
            sx={{
              display: "block",
              mt: 1,
              p: 1,
              bgcolor: "grey.100",
              borderRadius: 1,
              fontFamily: "monospace",
            }}
          >
            $ ganache
          </Box>
          <Typography mt={1}>
            From the list of generated private keys, import the first one to MetaMask.
          </Typography>
        </details>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <details>
          <summary>
            <Typography variant="h6">Truffle</Typography>
          </summary>
          <Typography mt={1}>
            Keep Ganache running and open another terminal. Let's compile and deploy our contracts to Ganache.
          </Typography>
          <Box
            component="code"
            sx={{
              display: "block",
              mt: 1,
              p: 1,
              bgcolor: "grey.100",
              borderRadius: 1,
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
            }}
          >
            {`$ cd truffle\n$ truffle migrate --network development`}
          </Box>
          <Typography mt={1} color="text.secondary" fontSize="0.875rem">
            # The `development` network points to Ganache, it's configured in truffle/truffle-config.js
          </Typography>
        </details>
      </Paper>
    </Box>
  );
};

export default Setup;
