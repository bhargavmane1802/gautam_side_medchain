import React, { useState, useCallback } from "react";
import {
  Box,
  Divider,
  FormControl,
  Modal,
  TextField,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import CustomButton from "../../components/CustomButton";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import useEth from "../../contexts/EthContext/useEth";
import useAlert from "../../contexts/AlertContext/useAlert";
import AddRecordModal from "./AddRecordModal";
import uploadToIPFS from "../../ipfs"; 
import Record from "../../components/Record";

const Doctor = () => {
  const {
    state: { contract, accounts, role, loading },
  } = useEth();
  const { setAlert } = useAlert();

  const [patientExist, setPatientExist] = useState(false);
  const [searchPatientAddress, setSearchPatientAddress] = useState("");
  const [addPatientAddress, setAddPatientAddress] = useState("");
  const [records, setRecords] = useState([]);
  const [addRecord, setAddRecord] = useState(false);

  const searchPatient = async () => {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(searchPatientAddress)) {
      setAlert("Please enter a valid wallet address", "error");
      return;
    }
    try {
      const exists = await contract.methods
        .getPatientExists(searchPatientAddress)
        .call({ from: accounts[0] });
        
      if (exists) {
        const recs = await contract.methods
          .getRecords(searchPatientAddress)
          .call({ from: accounts[0] });
        setRecords(recs);
        setPatientExist(true);
        setAlert("Patient records loaded", "success");
      } else {
        setAlert("Patient not found on the network", "error");
        setPatientExist(false);
        setRecords([]);
      }
    } catch (err) {
      console.error(err);
      setAlert("Error searching for patient", "error");
    }
  };

  const registerPatient = async () => {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(addPatientAddress)) {
      setAlert("Please enter a valid wallet address", "error");
      return;
    }

    if (addPatientAddress.toLowerCase() === accounts[0].toLowerCase()) {
      setAlert("You cannot register yourself as your own patient", "error");
      return;
    }

    try {
      // Calls the new addPatient function in EHR.sol
      await contract.methods
        .addPatient(addPatientAddress)
        .send({ from: accounts[0] });
        
      setAlert("Patient registered successfully", "success");
      setAddPatientAddress("");
    } catch (err) {
      console.error(err);
      // This will trigger if the patient already exists or if sender is not a doctor
      setAlert("Registration failed: Ensure patient is not already registered", "error");
    }
  };

  const addRecordCallback = useCallback(
    async (buffer, fileName, patientAddress) => {
      if (!patientAddress) {
        setAlert("Please search for a patient first", "error");
        return;
      }
      try {
        setAlert("Uploading to IPFS...", "info");
        // 1. Upload to Pinata/IPFS
        const ipfsHash = await uploadToIPFS(buffer, fileName);
        
        if (ipfsHash) {
          setAlert("Securing record on Blockchain...", "info");
          // 2. Save to Blockchain
          await contract.methods
            .addRecord(ipfsHash, fileName, patientAddress)
            .send({ from: accounts[0] });

          setAlert("Record secured on blockchain", "success");
          setAddRecord(false);

          // 3. Refresh list
          const recs = await contract.methods
            .getRecords(patientAddress)
            .call({ from: accounts[0] });
          setRecords(recs);
        }
      } catch (err) {
        console.error(err);
        setAlert("Failed to add record. See console for details.", "error");
      }
    },
    [accounts, contract, setAlert]
  );

  if (loading) {
    return (
      <Backdrop sx={{ color: "#fff", zIndex: 1201 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  // Unauthorized Access Checks
  if (!accounts || accounts.length === 0) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <Typography variant="h5">Please connect MetaMask to use the Doctor Portal</Typography>
      </Box>
    );
  }

  if (role !== "doctor") {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={10}>
        <Typography variant="h4" color="error">Access Denied</Typography>
        <Typography variant="h6">Only registered doctors can access this dashboard.</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" width="100vw">
      <Box width={{ xs: "95%", sm: "80%", md: "60%" }} my={5}>
        
        {/* Record Upload Modal */}
        <Modal open={addRecord} onClose={() => setAddRecord(false)}>
          <AddRecordModal
            handleClose={() => setAddRecord(false)}
            handleUpload={addRecordCallback}
            patientAddress={searchPatientAddress}
          />
        </Modal>

        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Doctor Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary" mb={4}>
          Connected as: {accounts[0]}
        </Typography>

        <Divider sx={{ mb: 4 }} />

        {/* Section: Patient Lookup */}
        <Typography variant="h5" mb={2}>Find Patient Records</Typography>
        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2} mb={4}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter Patient Wallet Address (0x...)"
            value={searchPatientAddress}
            onChange={(e) => setSearchPatientAddress(e.target.value)}
            size="small"
          />
          <CustomButton text="Search" handleClick={searchPatient}>
            <SearchRoundedIcon style={{ color: "white" }} />
          </CustomButton>
          <CustomButton 
            text="Add Record" 
            handleClick={() => setAddRecord(true)} 
            disabled={!patientExist}
          >
            <CloudUploadRoundedIcon style={{ color: "white" }} />
          </CustomButton>
        </Box>

        {/* Results Area */}
        {patientExist ? (
          records.length === 0 ? (
            <Typography variant="h6" textAlign="center" my={4} color="textSecondary">
              No medical records found for this patient.
            </Typography>
          ) : (
            <Box display="flex" flexDirection="column" gap={2} mt={2}>
              {records.map((record, index) => (
                <Record key={index} record={record} />
              ))}
            </Box>
          )
        ) : null}

        <Box mt={6} mb={6}>
          <Divider>
            <Typography color="textSecondary">OR</Typography>
          </Divider>
        </Box>

        {/* Section: Register New Patient */}
        <Typography variant="h5" mb={2}>Register New Patient</Typography>
        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="New Patient Wallet Address"
            value={addPatientAddress}
            onChange={(e) => setAddPatientAddress(e.target.value)}
            size="small"
          />
          <CustomButton text="Register Patient" handleClick={registerPatient}>
            <PersonAddAlt1RoundedIcon style={{ color: "white" }} />
          </CustomButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Doctor;