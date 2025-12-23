// src/components/Dropzone.js
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography, Paper } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { grey, teal } from "@mui/material/colors";

const Dropzone = ({ onFileSelected }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onFileSelected(acceptedFiles[0]);
      }
    },
    [onFileSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <Paper
      {...getRootProps()}
      sx={{
        p: 3,
        border: `2px dashed ${teal[700]}`,
        textAlign: "center",
        cursor: "pointer",
        bgcolor: isDragActive ? grey[100] : "white",
      }}
    >
      <input {...getInputProps()} />
      <CloudUploadIcon sx={{ fontSize: 40, color: teal[700], mb: 1 }} />
      <Typography variant="body1">
        {isDragActive ? "Drop the file here..." : "Drag & drop a file here, or click to select"}
      </Typography>
    </Paper>
  );
};

export default Dropzone;
