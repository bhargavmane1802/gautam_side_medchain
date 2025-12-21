import React from "react";
import { Box, Typography, Link as MuiLink, Stack } from "@mui/material";

const Footer = () => {
  const links = [
    { uri: "https://trufflesuite.com", text: "Truffle" },
    { uri: "https://reactjs.org", text: "React" },
    { uri: "https://soliditylang.org", text: "Solidity" },
    { uri: "https://ethereum.org", text: "Ethereum" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: 6,
        backgroundColor: "grey.100",
        textAlign: "center",
      }}
    >
      <Typography variant="h6" mb={2}>
        More Resources
      </Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        {links.map((link) => (
          <MuiLink
            key={link.uri}
            href={link.uri}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            color="primary"
            sx={{ fontSize: 16 }}
          >
            {link.text}
          </MuiLink>
        ))}
      </Stack>
    </Box>
  );
};

export default Footer;
