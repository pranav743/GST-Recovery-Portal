import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, LinearProgress, Paper } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import uri from '../utils/URL';
import DemandTable from '../components/ExampleTable';
import { getUserDetails } from '../utils/Session';

const Input = styled('input')({
  display: 'none',
});

const UploadBox = styled(Paper)({
  padding: '20px',
  maxWidth: '500px',
  margin: 'auto',
  textAlign: 'center',
});

const UploadButton = styled(Button)({
  marginTop: '10px',
});

const ProgressBox = styled(Box)({
  width: '100%',
  marginTop: '20px',
});

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(uri + '/upload-data', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });
      console.log('File uploaded successfully', response);
    } catch (error) {
      console.error('Error uploading file', error);
    }
  };

  const [currentUser, setCurrentUser] = useState(false);
    const getCurrentUser = async () => {
        if (currentUser){
            return
        }
        try {
            const curr_user = await getUserDetails();
            console.log(curr_user);
            setCurrentUser(curr_user.user);
            if (!curr_user.user.isAdmin){
                window.location.href = "/login";
            }
        } catch (error) {
            window.location.href = "/login";
        }
    }
    useEffect(() => {
        getCurrentUser();
    });

  return (
    <>
    <DemandTable/>
    <UploadBox elevation={3}>
      <Typography variant="h6" gutterBottom>
        Upload Your File
      </Typography>
      <label htmlFor="file-upload">
        <Input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          accept=".xlsx"
        />
        <Button variant="contained" color="primary" component="span">
          Choose File
        </Button>
      </label>
      {file && (
        <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px' }}>
          Selected File: {file.name}
        </Typography>
      )}
      <UploadButton variant="contained" color="secondary" onClick={handleUpload}>
        Upload
      </UploadButton>
      {progress > 0 && (
        <ProgressBox>
          <Typography variant="body2" color="textSecondary">
            Upload Progress: {progress}%
          </Typography>
          <LinearProgress variant="determinate" value={progress} />
        </ProgressBox>
      )}
    </UploadBox>
    </>
  );
};

export default FileUpload;
