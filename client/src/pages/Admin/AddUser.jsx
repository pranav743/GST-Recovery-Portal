import React, { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Button, Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { successMessage, errorMessage } from '../../components/Toast';
import axios from 'axios';
import uri from '../../utils/URL';
import { getUserDetails } from '../../utils/Session';


const AddUser = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async () => {
        const data = {
            username, password
        }
        try {
            const res = await axios.post(uri + "/add-user", data);
            if (res.data.success) {
                successMessage(res.data.msg);
            } else{
                errorMessage(res.data.msg);
            }
            setUsername('');
            setPassword('');
        } catch (error) {
            errorMessage(error.response.data.msg);
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', backgroundColor: '#f0f2f5' }}>
            <Card style={{ maxWidth: 400, padding: 20, borderRadius: 10, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom style={{ marginBottom: 20, textAlign: 'center', color: '#333' }}>
                        Create New User
                    </Typography>
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        InputProps={{ style: { borderRadius: 8 } }}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        InputProps={{ style: { borderRadius: 8 } }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        style={{ borderRadius: 8, marginTop: 20 }}
                        onClick={handleSubmit} // Call handleSubmit function on button click
                    >
                        Add User
                    </Button>
                    <Typography variant="body2" color="textSecondary" style={{ marginTop: 20, textAlign: 'center', color: '#666' }}>
                        You can Add new Users Here !
                    </Typography>
                    <ToastContainer />
                </CardContent>
            </Card>
        </div>
    );
};

export default AddUser;
