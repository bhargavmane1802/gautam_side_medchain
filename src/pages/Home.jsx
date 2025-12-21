import React from "react";
import {
  Box,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import VideoCover from "react-video-cover";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import CustomButton from "../components/CustomButton";
import useEth from "../contexts/EthContext/useEth";
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
      await contract.methods.addDoctor().send({ from: accounts[0] });
      dispatch({ type: "ADD_DOCTOR" });
    } catch (err) {
      console.error(err);
    }
  };

  const ActionSection = () => {
    if (!accounts) {
      return (
        <Typography variant="h5" color="white">
          Open your MetaMask wallet to get connected, then refresh this page
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
          <Typography variant="h5" color="white">
            If you are a patient, ask your doctor to register for you
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
      >
        <img src={logo} alt="med-chain-logo" style={{ height: 50 }} />
        <Box mt={2} mb={5}>
          <Typography variant="h4" color="white">
            Own Your Health
          </Typography>
        </Box>

        <ActionSection />

        <Box display="flex" alignItems="center" mt={2}>
          <Typography variant="h5" color="white">
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
