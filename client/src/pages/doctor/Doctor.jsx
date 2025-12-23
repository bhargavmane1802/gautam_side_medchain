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
      } else {
        setAlert("Patient does not exist", "error");
        setPatientExist(false);
        setRecords([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const registerPatient = async () => {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(addPatientAddress)) {
      setAlert("Please enter a valid wallet address", "error");
      return;
    }
    try {
      await contract.methods
        .addPatient(addPatientAddress)
        .send({ from: accounts[0] });
      setAlert("Patient registered successfully", "success");
      setAddPatientAddress("");
    } catch (err) {
      console.error(err);
      setAlert("Patient registration failed", "error");
    }
  };

  // At the top of Doctor.jsx, change the import name for clarity


// Inside the Doctor component:
const addRecordCallback = useCallback(
  async (buffer, fileName, patientAddress) => {
    if (!patientAddress) {
      setAlert("Please search for a patient first", "error");
      return;
    }
    try {
      // 1. Upload to Pinata and get the CID
      const ipfsHash = await uploadToIPFS(buffer, fileName);
      
      if (ipfsHash) {
        // 2. Save the CID to the Ethereum Blockchain
        await contract.methods
          .addRecord(ipfsHash, fileName, patientAddress)
          .send({ from: accounts[0] });

        setAlert("New record uploaded and secured on blockchain", "success");
        setAddRecord(false);

        // 3. Refresh the record list
        const recs = await contract.methods
          .getRecords(patientAddress)
          .call({ from: accounts[0] });
        setRecords(recs);
      }
    } catch (err) {
      console.error(err);
      setAlert("Record upload failed. Check console for details.", "error");
    }
  },
  [accounts, contract, setAlert]
);

  if (loading) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
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

  if (role === "patient") {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h5">Only doctor can access this page</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" width="100vw">
      <Box width={{ xs: "90%", sm: "60%" }} my={5}>
        <Modal open={addRecord} onClose={() => setAddRecord(false)}>
          <AddRecordModal
            handleClose={() => setAddRecord(false)}
            handleUpload={addRecordCallback}
            patientAddress={searchPatientAddress}
          />
        </Modal>

        <Typography variant="h4" mb={2}>
          Patient Records
        </Typography>

        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} alignItems="center" gap={2} mb={2}>
          <FormControl fullWidth>
            <TextField
              variant="outlined"
              placeholder="Search patient by wallet address"
              value={searchPatientAddress}
              onChange={(e) => setSearchPatientAddress(e.target.value)}
              size="small"
              inputProps={{ style: { fontSize: 15 } }}
            />
          </FormControl>

          <CustomButton text="Search" handleClick={searchPatient}>
            <SearchRoundedIcon style={{ color: "white" }} />
          </CustomButton>

          <CustomButton text="New Record" handleClick={() => setAddRecord(true)} disabled={!patientExist}>
            <CloudUploadRoundedIcon style={{ color: "white" }} />
          </CustomButton>
        </Box>

        {patientExist && records.length === 0 && (
          <Box display="flex" justifyContent="center" my={5}>
            <Typography variant="h5">No records found</Typography>
          </Box>
        )}

        {patientExist && records.length > 0 && (
          <Box display="flex" flexDirection="column" mt={3} mb={-2}>
            {records.map((record, index) => (
              <Box key={index} mb={2}>
                <Record record={record} />
              </Box>
            ))}
          </Box>
        )}

        <Box mt={6} mb={4}>
          <Divider />
        </Box>

        <Typography variant="h4" mb={2}>
          Register Patient
        </Typography>

        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} alignItems="center" gap={2}>
          <FormControl fullWidth>
            <TextField
              variant="outlined"
              placeholder="Register patient by wallet address"
              value={addPatientAddress}
              onChange={(e) => setAddPatientAddress(e.target.value)}
              size="small"
              inputProps={{ style: { fontSize: 15 } }}
            />
          </FormControl>

          <CustomButton text="Register" handleClick={registerPatient}>
            <PersonAddAlt1RoundedIcon style={{ color: "white" }} />
          </CustomButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Doctor;
