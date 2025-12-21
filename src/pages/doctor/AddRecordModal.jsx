import React, { useState, useCallback } from 'react';
import { Box, Chip, IconButton, Typography, Paper } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import { useDropzone } from 'react-dropzone';
import CustomButton from '../../components/CustomButton';
import useAlert from '../../contexts/AlertContext/useAlert';

const AddRecordModal = ({ handleClose, handleUpload, patientAddress }) => {
  const { setAlert } = useAlert();
  const [file, setFile] = useState(null);
  const [buffer, setBuffer] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;

    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setBuffer(null);

    const reader = new FileReader();
    reader.readAsArrayBuffer(selectedFile);
    reader.onloadend = () => {
      const buf = Buffer.from(reader.result);
      setBuffer(buf);
    };
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
      }}
    >
      <Paper
        elevation={24}
        sx={{
          position: 'relative',
          width: { xs: '90%', sm: '50%' },
          p: 3,
          borderRadius: 2,
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseRoundedIcon />
        </IconButton>

        <Typography variant="h4" mb={2}>
          Add Record
        </Typography>

        <Box
          {...getRootProps()}
          sx={{
            p: 4,
            textAlign: 'center',
            border: '2px dashed grey',
            borderRadius: 2,
            cursor: 'pointer',
            bgcolor: isDragActive ? 'grey.100' : 'inherit',
          }}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <Typography>Drop the file here ...</Typography>
          ) : (
            <Typography>
              Drag & drop a file here, or click to select a file
            </Typography>
          )}
        </Box>

        {file && (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
          >
            <Chip
              label={file.name}
              onDelete={() => {
                setFile(null);
                setBuffer(null);
              }}
            />
            <CustomButton
              text="Upload"
              handleClick={() => handleUpload(buffer, file.name, patientAddress)}
              disabled={!file || !buffer}
            >
              <CloudUploadRoundedIcon style={{ color: 'white' }} />
            </CustomButton>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default AddRecordModal;
