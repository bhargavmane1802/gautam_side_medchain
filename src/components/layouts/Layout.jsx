import React from "react";
import { AppBar, Chip, Toolbar, Box, Typography } from "@mui/material";
import useEth from "../../contexts/EthContext/useEth";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import logo from "../../assets/tealNoBG-cropped.png";
import { grey, teal } from "@mui/material/colors";

const HeaderAppBar = () => {
  const {
    state: { accounts, role },
  } = useEth();

  const accountText = accounts?.[0] ?? "Wallet not connected";
  const chipLabel = role === "unknown" ? "not registered" : role;

  return (
    <AppBar position="static" sx={{ backgroundColor: "white" }}>
      <Toolbar>
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <a href="/">
            <img src={logo} alt="med-chain-logo" style={{ height: 24, width: 24 }} />
          </a>

          <Box flexGrow={1} />

          <Box display="flex" alignItems="center">
            <PersonRoundedIcon sx={{ color: grey[700], fontSize: 22, mb: 0.1 }} />
            <Typography variant="h6" color="black" sx={{ ml: 0.5, mr: 2 }}>
              {accountText}
            </Typography>
            <Chip
              label={chipLabel}
              sx={{
                fontSize: 12,
                backgroundColor: teal.A700,
                color: "white",
              }}
            />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderAppBar;
