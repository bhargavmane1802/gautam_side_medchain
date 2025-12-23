import React from "react";
import {
  Box,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import VideoCover from "react-video-cover";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import CustomButton from "../components/CustomButton";
import { useEth, actions } from "../contexts/EthContext"; // Import actions here
import BackgroundVideo from "../assets/BackgroundVideo.mp4";
import logo from "../assets/tealNoBG-cropped.png";
import "../App.css";

const Home = () => {
  const {
    state: { contract, accounts, role, loading },
    dispatch,
  } = useEth();
  const navigate = useNavigate();

  const registerDoctor = async () => {
    try {
      // Calls the addDoctor function in your new EHR.sol
      await contract.methods.addDoctor().send({ from: accounts[0] });
      
      // Updates the global state immediately so the button changes to "Doctor Portal"
      dispatch({ 
        type: actions.setRole, 
        data: "doctor" 
      });
      
      // Optional: Navigate directly to the dashboard
      navigate("/doctor");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const ActionSection = () => {
    if (!accounts) {
      return (
        <Typography variant="h5" color="white" textAlign="center">
          Please connect your MetaMask wallet to continue.
        </Typography>
      );
    }

    if (role === "unknown") {
      return (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box mb={2}>
            <CustomButton text="Doctor Register" handleClick={registerDoctor}>
              <PersonAddAlt1RoundedIcon style={{ color: "white" }} />
            </CustomButton>
          </Box>
          <Typography variant="h6" color="white" textAlign="center">
            Patients: Please ask a registered doctor to add your address to the network.
          </Typography>
        </Box>
      );
    }

    if (role === "patient") {
      return (
        <CustomButton text="Patient Portal" handleClick={() => navigate("/patient")}>
          <LoginRoundedIcon style={{ color: "white" }} />
        </CustomButton>
      );
    }

    if (role === "doctor") {
      return (
        <CustomButton text="Doctor Portal" handleClick={() => navigate("/doctor")}>
          <LoginRoundedIcon style={{ color: "white" }} />
        </CustomButton>
      );
    }

    return null;
  };

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

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="100vw"
      height="100vh"
      id="background"
    >
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      >
        <VideoCover
          videoOptions={{ src: BackgroundVideo, autoPlay: true, loop: true, muted: true }}
        />
      </Box>

      <Box
        id="home-page-box"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        p={5}
        sx={{ backgroundColor: "rgba(0,0,0,0.5)", borderRadius: "20px" }}
      >
        <img src={logo} alt="med-chain-logo" style={{ height: 60 }} />
        <Box mt={2} mb={5}>
          <Typography variant="h3" color="white" fontWeight="bold">
            MED-CHAIN
          </Typography>
          <Typography variant="h5" color="white" textAlign="center">
            Secure Electronic Health Records
          </Typography>
        </Box>

        <ActionSection />

        <Box display="flex" alignItems="center" mt={4}>
          <Typography variant="body1" color="white">
            powered by{" "}
          </Typography>
          <Box mx={1}>
            <img
              src="https://cdn.worldvectorlogo.com/logos/ethereum-1.svg"
              alt="Ethereum logo"
              style={{ height: 20 }}
            />
          </Box>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/1/18/Ipfs-logo-1024-ice-text.png"
            alt="IPFS logo"
            style={{ height: 20 }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;