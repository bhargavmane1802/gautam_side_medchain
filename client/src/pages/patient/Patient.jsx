import React, { useState, useEffect } from "react";
import { Box, Typography, Backdrop, CircularProgress, Divider } from "@mui/material";
import useEth from "../../contexts/EthContext/useEth";
import Record from "../../components/Record";

const Patient = () => {
  const {
    state: { contract, accounts, role, loading },
  } = useEth();

  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);

  useEffect(() => {
    // Only fetch if contract exists, accounts are connected, and user is a patient
    if (!contract || !accounts || role !== "patient") {
      setLoadingRecords(false);
      return;
    }

    const fetchRecords = async () => {
      setLoadingRecords(true);
      try {
        // Calls the updated getRecords function which now has the senderExists modifier
        const recs = await contract.methods
          .getRecords(accounts[0])
          .call({ from: accounts[0] });
        
        // Solidty returns structs as arrays/objects; we set them directly
        setRecords(recs);
      } catch (err) {
        console.error("Error fetching patient records:", err);
      } finally {
        setLoadingRecords(false);
      }
    };

    fetchRecords();
  }, [contract, accounts, role]); // Re-run if role changes (e.g., after login)

  if (loading || loadingRecords) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading your medical history...</Typography>
      </Backdrop>
    );
  }

  // Error State: No Account
  if (!accounts || accounts.length === 0) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <Typography variant="h5">Please connect your MetaMask wallet to view your records.</Typography>
      </Box>
    );
  }

  // Error State: Unauthorized
  if (role !== "patient") {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={10} gap={2}>
        <Typography variant="h4" color="error">Access Denied</Typography>
        <Typography variant="h6">
          This portal is reserved for registered patients. 
          {role === "doctor" ? " Please use the Doctor Portal." : " Please contact your doctor for registration."}
        </Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" width="100vw">
      <Box width={{ xs: "95%", sm: "80%", md: "60%" }} my={5}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          My Medical Records
        </Typography>
        <Typography variant="body1" color="textSecondary" mb={4}>
          Wallet Address: {accounts[0]}
        </Typography>

        <Divider sx={{ mb: 4 }} />

        {records.length === 0 ? (
          <Box display="flex" flexDirection="column" alignItems="center" my={10}>
            <Typography variant="h5" color="textSecondary">No records found.</Typography>
            <Typography variant="body1">Once your doctor uploads a record, it will appear here.</Typography>
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