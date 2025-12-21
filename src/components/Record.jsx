import React from "react";
import {
  Card,
  CardContent,
  IconButton,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import CloudDownloadRoundedIcon from "@mui/icons-material/CloudDownloadRounded";
import { grey } from "@mui/material/colors";
import dayjs from "dayjs";

const Record = ({ record }) => {
  const [cid, name, patientId, doctorId, timestamp] = record;

  return (
    <Card sx={{ mb: 2, boxShadow: 3 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={1}>
            <DescriptionRoundedIcon sx={{ fontSize: 40, color: grey[700] }} />
          </Grid>

          <Grid item xs={12} sm={3}>
            <Box display="flex" flexDirection="column">
              <Typography variant="subtitle2" color={grey[600]}>
                Record Name
              </Typography>
              <Typography variant="body1" noWrap>
                {name}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={5}>
            <Box display="flex" flexDirection="column">
              <Typography variant="subtitle2" color={grey[600]}>
                Doctor
              </Typography>
              <Typography variant="body1" noWrap>
                {doctorId}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={2}>
            <Box display="flex" flexDirection="column">
              <Typography variant="subtitle2" color={grey[600]}>
                Created Time
              </Typography>
              <Typography variant="body1">
                {dayjs.unix(timestamp).format("MM-DD-YYYY HH:mm")}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={1}>
            <a
              href={`https://med-chain.infura-ipfs.io/ipfs/${cid}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton>
                <CloudDownloadRoundedIcon fontSize="large" />
              </IconButton>
            </a>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Record;
