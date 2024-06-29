import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Grid,
  Paper
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import uri from '../../utils/URL';

const EditableDropdown = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({});

  const displayName = (name) => {
    return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

  useEffect(() => {
    axios.get(uri + '/extras/all')
      .then(response => {
        // console.log(response.data.extra.dropDown)
        setData(response.data.extra.dropDown);
        setNewItem(Object.keys(response.data).reduce((acc, key) => ({ ...acc, [key]: '' }), {}));
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, []);

  const handleAddItem = (key) => {
    if (newItem[key]) {
      setData({
        ...data,
        [key]: [...data[key], newItem[key]]
      });
      setNewItem({ ...newItem, [key]: '' });
    }
  };

  const handleDeleteItem = (key, index) => {
    setData({
      ...data,
      [key]: data[key].filter((_, i) => i !== index)
    });
  };

  const handleUpdate = async () => {
    try {
        console.log(data)
      await axios.post(uri + '/update/drop-down', { dropDown: data });
      alert('Data updated successfully');
    } catch (error) {
      alert('Failed to update data');
    }
  };
  

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>{error}</Typography>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Editable Dropdowns</Typography>
      {Object.keys(data).map((key) => (
        <Paper key={key} style={{ marginBottom: '20px', padding: '20px' }}>
          <Typography variant="h6">{displayName(key)}</Typography>
          <List>
            {data[key].map((item, index) => (
              <ListItem key={index}>
                <ListItemText primary={item} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteItem(key, index)}>
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <TextField
                fullWidth
                variant="outlined"
                label="New Item"
                value={newItem[key]}
                onChange={(e) => setNewItem({ ...newItem, [key]: e.target.value })}
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => handleAddItem(key)}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </Paper>
      ))}
      <Button variant="contained" color="primary" fullWidth onClick={handleUpdate} sx={{marginTop: '20px', marginBottom: '25px'}}>Update</Button>
    </Container>
  );
};

export default EditableDropdown;
