import React from "react";
import { Box, Alert, Typography } from "@mui/material";
import useAlert from "../../contexts/AlertContext/useAlert";

const AlertPopup = () => {
  const { text, type } = useAlert();

  if (!text || !type) return null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        position: "fixed",
        top: 16,
        zIndex: 1300, // matches MUI modal/dialog z-index hierarchy
      }}
    >
      <Alert
        severity={type}
        sx={{
          width: { xs: "90%", sm: "auto" },
          maxWidth: 500,
          paddingRight: 3,
        }}
      >
        <Typography variant="h6">{text}</Typography>
      </Alert>
    </Box>
  );
};

export default AlertPopup;
