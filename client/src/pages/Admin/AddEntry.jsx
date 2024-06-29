import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Grid } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { successMessage, errorMessage } from '../../components/Toast';
import axios from 'axios';
import uri from '../../utils/URL';
import Autocomplete from '@mui/material/Autocomplete';
import { getUserDetails } from '../../utils/Session';

const AddEntry = () => {
    const [formData, setFormData] = useState({
        demandID: '',
        dateOfDemand: '',
        GSTIN: '',
        tradeNameOfTaxpayer: '',
        legalNameOfTaxpayer: '',
        taxPeriod: '',
        FYOfTaxPeriod: '',
        section: '',
        GSTDesk: '',
        OSPendingDemandTotal: 0,
        demandAsPerOrderTotal: 0,
        correctRecoveryID: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = () => {
        const errors = {};

        // Validation for demandID
        if (formData.demandID.trim() === '') {
            errorMessage('Demand ID is required');
            return;
        } else if (formData.demandID.length !== 15) {
            errorMessage('Demand ID must be 15 characters');
            return;
        }
        
        // Validation for Correct Recovery ID
        if (formData.correctRecoveryID.trim() === '') {
            errorMessage('Correct Recovery ID is required');
            return;
        } else if (formData.correctRecoveryID.length !== 15) {
            errorMessage('Correct Recovery ID must be 15 characters');
            return;
        }

        // Validation for GSTIN
        if (formData.GSTIN.trim() === '') {
            errorMessage('GSTIN is required');
            return;
        } else if (formData.GSTIN.length !== 15) {
            errorMessage('GSTIN must be 15 characters');
            return;
        }
        if (formData.tradeNameOfTaxpayer.trim() === '') {
            errorMessage('Trade Name of Tax-Payer is required');
            return;
        }
        if (formData.legalNameOfTaxpayer.trim() === '') {
            errorMessage('Legal Name of Tax-Payer is required');
            return;
        }
        if (formData.taxPeriod.trim() === '') {
            errorMessage('Tax Period is required');
            return;
        }
        if (formData.GSTDesk.trim() === '') {
            errorMessage('GST desk is required');
            return;
        }
        if (formData.section.trim() === '') {
            errorMessage('Section is required');
            return;
        }
        if (formData.FYOfTaxPeriod.trim() === '') {
            errorMessage('FY of Tax Period is required');
            return;
        }
        // Validation for dateOfDemand
        if (formData.dateOfDemand.trim() === '') {
            errorMessage('Date of Demand is required');
            return;
        } else {
            const selectedDate = new Date(formData.dateOfDemand);
            const currentDate = new Date();
            if (selectedDate > currentDate) {
                errorMessage('Date of Demand must be from the past');
                return;
            }
        }

        // Validation for OSPendingDemandTotal
        if (formData.OSPendingDemandTotal == 0) {
            errorMessage('OS Pending Demand Total is required');
            return;
        } else if (!Number.isInteger(Number(formData.OSPendingDemandTotal))) {
            errorMessage('OS Pending Demand Total must be an integer');
            return;
        }

        // Validation for demandAsPerOrderTotal
        if (formData.demandAsPerOrderTotal == 0) {
            errorMessage('Demand As per Order Total is required');
            return;
        } else if (!Number.isInteger(Number(formData.demandAsPerOrderTotal))) {
            errorMessage('Demand As per Order Total must be an integer');
            return;
        }

        // If all validations pass, proceed with form submission
        handleUpload();
    };

    const handleUpload = async () => {
        if (!currentUser.isAdmin){
            errorMessage("Not Authorized");
        }
        try {
            const res = await axios.post(uri + "/add-entry", formData);
            console.log(res);
            if (res.data.success) {
                successMessage(res.data.msg);
            } else {
                errorMessage(res.data.msg);
            }
        } catch (error) {
            errorMessage(error.response.data.msg);
        }
    }

    const fiscalYears = [
        '2017-18',
        '2018-19',
        '2019-20',
        '2020-21',
        '2021-22',
        '2022-23',
        '2023-24',
        '2024-25',
        '2025-26',
        '2026-27'
    ];

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
        <Grid container spacing={2} padding={5}>
            <ToastContainer />
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    name="demandID"
                    label="Demand ID"
                    value={formData.demandID}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    name="dateOfDemand"
                    label="Date of Demand"
                    type="date"
                    value={formData.dateOfDemand}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    name="GSTIN"
                    label="GSTIN"
                    value={formData.GSTIN}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    name="tradeNameOfTaxpayer"
                    label="Trade Name of Taxpayer"
                    value={formData.tradeNameOfTaxpayer}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    name="legalNameOfTaxpayer"
                    label="Legal Name of Taxpayer"
                    value={formData.legalNameOfTaxpayer}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    name="taxPeriod"
                    label="Tax Period"
                    value={formData.taxPeriod}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Autocomplete
                    fullWidth
                    options={fiscalYears}
                    getOptionLabel={(option) => option}
                    value={formData.FYOfTaxPeriod}
                    onChange={(event, value) => handleChange({ target: { name: 'FYOfTaxPeriod', value } })}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="FY of Tax Period"
                            name="FYOfTaxPeriod"
                            variant="outlined"
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    name="section"
                    label="Section"
                    value={formData.section}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    name="GSTDesk"
                    label="GST Desk"
                    value={formData.GSTDesk}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    name="OSPendingDemandTotal"
                    label="OS Pending Demand Total"
                    type="number"
                    value={formData.OSPendingDemandTotal}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    name="demandAsPerOrderTotal"
                    label="Demand As per Order Total"
                    type="number"
                    value={formData.demandAsPerOrderTotal}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    name="correctRecoveryID"
                    label="Correct Recovery ID"
                    value={formData.correctRecoveryID}
                    onChange={handleChange}
                />
            </Grid>
            
            <Grid item xs={12} sm={6}>
                <Button

                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    fullWidth
                    endIcon={<ArrowForwardIosIcon />}
                    style={{ fontSize: 18, borderRadius: 10, textTransform: 'none', boxShadow: 'none', height: '55px' }}
                >
                    Add Entry
                </Button>
            </Grid>
        </Grid>
    );
};

export default AddEntry;
