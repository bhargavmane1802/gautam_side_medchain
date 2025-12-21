import React from "react";
import { Button, Typography } from "@mui/material";
import { grey, teal } from "@mui/material/colors";

const CustomButton = ({ text, handleClick, disabled = false, startIcon }) => {
  return (
    <Button
      startIcon={startIcon}
      variant="contained"
      onClick={handleClick}
      disabled={disabled}
      sx={{
        backgroundColor: disabled ? grey[400] : teal[700],
        textTransform: "none",
        padding: "10px 20px",
        "&:hover": {
          backgroundColor: disabled ? grey[400] : teal[900],
        },
      }}
    >
      <Typography variant="button" color="white">
        {text}
      </Typography>
    </Button>
  );
};

export default CustomButton;
