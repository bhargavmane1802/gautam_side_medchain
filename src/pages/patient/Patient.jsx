import React, { useState, useEffect } from "react";
import { Box, Typography, Backdrop, CircularProgress } from "@mui/material";
import useEth from "../../contexts/EthContext/useEth";
import Record from "../../components/Record";

const Patient = () => {
  const {
    state: { contract, accounts, role, loading },
  } = useEth();

  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);

  useEffect(() => {
    if (!contract || !accounts) return;

    const fetchRecords = async () => {
      try {
        const recs = await contract.methods
          .getRecords(accounts[0])
          .call({ from: accounts[0] });
        setRecords(recs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingRecords(false);
      }
    };

    fetchRecords();
  }, [contract, accounts]);

  if (loading || loadingRecords) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading || loadingRecords}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (!accounts) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h6">
          Open your MetaMask wallet to get connected, then refresh this page
        </Typography>
      </Box>
    );
  }

  if (role === "unknown") {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h5">
          You're not registered, please go to home page
        </Typography>
      </Box>
    );
  }

  if (role === "doctor") {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h5">Only patient can access this page</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" width="100vw">
      <Box width={{ xs: "90%", sm: "60%" }} my={5}>
        <Typography variant="h4" mb={3}>
          My Records
        </Typography>

        {records.length === 0 ? (
          <Box display="flex" justifyContent="center" my={5}>
            <Typography variant="h5">No records found</Typography>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            {records.map((record, index) => (
              <Record key={index} record={record} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Patient;
