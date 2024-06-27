import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Button, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Grid, MenuItem, Select, FormControl } from '@mui/material';
import axios from 'axios';
import uri from '../utils/URL';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { successMessage, errorMessage } from '../components/Toast';

const dropdown = {
    reasonOfDemand: [
        "Audit case",
        "Interest Order",
        "NGTP beneficiary",
        "Penalty order",
        "RFR Case",
        "Scrutiny of Return case",
        "UAO",
        "16 (4) Sec. case",
        "Provisional Assessment (Sec. 60)",
        "Assessment of Unregistered Persons (Sec. 63)",
        "Summary Assessment (Sec. 64)",
        "Assessment of Tax Collected but not paid (Sec. 76)",
        "Special Audit (Sec. 66)",
        "Rectification (Sec. 161)",
        "Revision (Sec. 108)"
    ],
    authorityGrantingStay: [
        "DC-Appeal",
        "JC-Appeal",
        "Tribunal-GST",
        "ANNEXURE -I",
        "NCLT/NCLAT",
        "DRT",
        "High-Court",
        "Supreme-Court"
    ],
    reasonForNotAvailable: [
        "Not_Available",
        "Annexure I submitted",
        "Declared NGTP",
        "DRT moratorium",
        "Installment Application",
        "Installment Order",
        "NCLT moratorium",
        "No property Available",
        "Not Traceable",
        "Rectification pending",
        "Return filed in UAO case",
        "Stay in First Appeal",
        "Stay of High Court",
        "Stay of Supreme Court",
        "Transferred to Other Desk",
        "RRC within State",
        "RRC Outside State",
        "Official Liquidator",
        "GST Tribunal",
        "Court Receiver",
        "Auction proclaimed",
        "Other than above"
    ],
    statusOfRecovery: [
        "Available",
        "No action",
        "Bank attachment",
        "Debtor attachment",
        "MLRC",
        "Recovery reminder",
        "Police Complaint"
    ]
};

const validationFunctions = {
    checkStringLength15: (value) => typeof value === 'string' && value.length === 15,
    checkIsNumber: (value) => !isNaN(value) && Number.isInteger(Number(value)),
    checkNotEmpty: (value) => value !== '',
};

const fieldValidations = [
    // { field: 'demandID', validation: 'checkStringLength15' },
    // { field: 'dateOfDemand', validation: 'checkNotEmpty' },
    // { field: 'GSTIN', validation: 'checkStringLength15' },
    // { field: 'tradeNameOfTaxpayer', validation: 'checkNotEmpty' },
    // { field: 'legalNameOfTaxpayer', validation: 'checkNotEmpty' },
    // { field: 'taxPeriod', validation: 'checkNotEmpty' },
    // { field: 'FYOfTaxPeriod', validation: 'checkNotEmpty' },
    // { field: 'section', validation: 'checkNotEmpty' },
    // { field: 'GSTDesk', validation: 'checkNotEmpty' },
    // { field: 'OSPendingDemandTotal', validation: 'checkIsNumber' },
    // { field: 'demandAsPerOrderTotal', validation: 'checkIsNumber' },
    // { field: 'correctRecoveryID', validation: 'checkNotEmpty' },
    // { field: 'reasonOfDemand', validation: 'checkNotEmpty' },
    // { field: 'statusOfRecovery', validation: 'checkNotEmpty' },
    // { field: 'reasonForNotAvailable', validation: 'checkNotEmpty' },
    { field: 'partPaymentMadeInAppeal', validation: 'checkIsNumber' },
    // { field: 'authorityGrantingStay', validation: 'checkNotEmpty' },
    // { field: 'detailsOfARNCaseNo', validation: 'checkNotEmpty' },
    // { field: 'dateOfARNNo', validation: 'checkNotEmpty' },
    { field: 'paidWithDRC03', validation: 'checkIsNumber' },
    // { field: 'ARNNoOfDRC03', validation: 'checkNotEmpty' },
    // { field: 'dateOfDRC03', validation: 'checkNotEmpty' },
    { field: 'amountPaidByRTPAgainstLiability', validation: 'checkIsNumber' },
    { field: 'amountRecoveredFromCreditLedger', validation: 'checkIsNumber' },
    { field: 'amountRecoveredFromCashLedger', validation: 'checkIsNumber' },
    // { field: 'RecoveryDetails', validation: 'checkNotEmpty' }, // Nested fields should be validated separately
    { field: 'amountRecoveredFromDebtors', validation: 'checkIsNumber' },
    // { field: 'attachmentOfMovablePropertyDRC16Date', validation: 'checkNotEmpty' },
    // { field: 'attachmentOfImmovablePropertyDRC16Date', validation: 'checkNotEmpty' },
    // { field: 'dateOfAuctionFixed', validation: 'checkNotEmpty' },
    { field: 'amountRecoveredFromAuction', validation: 'checkIsNumber' },
    { field: 'amountReducedOtherwise', validation: 'checkIsNumber' },
    // { field: 'reasonForReduction', validation: 'checkNotEmpty' },
    // { field: 'actualBalanceDues', validation: 'checkIsNumber' },
    // { field: 'remark', validation: 'checkNotEmpty' },
];


const SingleEntry = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState(null);

    const getLatestData = async () => {
        try {
            const res = await axios.get(`${uri}/entries/all?demandID=${id}`);
            setFormData(res.data.data[0]);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (!formData) {
            getLatestData();
        }
    }, [formData]);

    const handleInputChange = (e, field) => {
        const value = e.target.value;
        setFormData({ ...formData, [field]: value });
    };

    const handleNestedInputChange = (e, field, subField) => {
        const value = e.target.value;
        setFormData({ 
            ...formData, 
            [field]: { 
                ...formData[field], 
                [subField]: value 
            } 
        });
    };

    const handleArrayInputChange = (e, field, index, subField) => {
        const value = e.target.value;
        const updatedArray = [...formData[field]];
        updatedArray[index][subField] = value;
        setFormData({ ...formData, [field]: updatedArray });
    };const validateField = (field, value) => {
        const validationRule = fieldValidations.find(v => v.field === field);
        if (validationRule) {
            const validationFunction = validationFunctions[validationRule.validation];
            return validationFunction(value);
        }
        return true;
    };

    const validateFormData = () => {
        let isValid = true;
        let newErrors = {};

        fieldValidations.forEach(({ field }) => {
            if (typeof formData[field] === 'object' && !Array.isArray(formData[field]) && formData[field] !== null) {
                Object.keys(formData[field]).forEach(subField => {
                    if (!validateField(subField, formData[field][subField])) {
                        isValid = false;
                        newErrors[subField] = true;
                    }
                });
            } else if (Array.isArray(formData[field])) {
                formData[field].forEach((item, index) => {
                    Object.keys(item).forEach(subField => {
                        if (!validateField(subField, item[subField])) {
                            isValid = false;
                            newErrors[`${field}-${index}-${subField}`] = true;
                        }
                    });
                });
            } else {
                if (!validateField(field, formData[field])) {
                    isValid = false;
                    newErrors[field] = true;
                }
            }
        });

        console.log(newErrors);
        for (let field of Object.keys(newErrors)) {
            if (newErrors[field]) {
              alert(`'${displayName(field)}' is not correct.`);
              break;
            }
          }
        
        return isValid;
    };

    const handleSave = async () => {
        if (validateFormData()) {
            console.log('Edited Object:', formData);
            try {
                const res = await axios.post(uri + "/update-entry", formData);
                if (res.data.success) {
                    successMessage(res.data.msg);
                } else {
                    errorMessage(res.data.msg);
                }
            } catch (error) {
                console.log(error);
                errorMessage(error.response.data.msg);
            }
    
        } else {
            console.log('Validation failed.');
        }
    };

    const displayName = (name) => {
        return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    };

    if (!formData) return <div>Loading...</div>;

    // Separate fields into headers and editable fields
    const nonEditableFields = [
        'demandID',
        'dateOfDemand',
        'GSTIN',
        'tradeNameOfTaxpayer',
        'legalNameOfTaxpayer',
        'taxPeriod',
        'FYOfTaxPeriod',
        'section',
        'GSTDesk',
        'OSPendingDemandTotal',
        'demandAsPerOrderTotal',
        'correctRecoveryID'
    ];

    const editableFields = Object.keys(formData).filter(
        field => !nonEditableFields.includes(field) && field !== '_id' && field !== '__v'
    );

    return (
        <Container>
             <ToastContainer />
            <Typography variant="h4" gutterBottom>
                Edit Demand Object
            </Typography>
            <Paper style={{ padding: '16px', marginBottom: '16px' }}>
                {nonEditableFields.map(field => (
                    <Typography variant="body1" key={field}>
                        <strong>{displayName(field)}:</strong> {formData[field]}
                    </Typography>
                ))}
            </Paper>
            <TableContainer component={Paper}>
                <Table>
                    <TableBody>
                        {editableFields.map((field) => {
                            if (typeof formData[field] === 'object' && formData[field] !== null && !Array.isArray(formData[field])) {
                                return (
                                    <>
                                        <TableRow key={field}>
                                            <TableCell colSpan={2}>
                                                <Typography variant="h6" gutterBottom>
                                                    {displayName(field)}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        {Object.keys(formData[field]).map((subField) => (
                                            <TableRow key={subField}>
                                                <TableCell>{displayName(subField)}</TableCell>
                                                <TableCell>
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        value={formData[field][subField]}
                                                        onChange={(e) => handleNestedInputChange(e, field, subField)}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                );
                            }

                            if (Array.isArray(formData[field])) {
                                return (
                                    <>
                                        <TableRow key={field}>
                                            <TableCell colSpan={2}>
                                                <Typography variant="h6" gutterBottom>
                                                    {displayName(field)}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        
                                        {formData[field].map((item, index) => (
                                            
                                            <TableRow key={`${field}-${index}`}>
                                                <TableCell colSpan={1}>
                                                    <Typography variant="subtitle1" gutterBottom>
                                                        {`${displayName(field)} ${index + 1}`}
                                                    </Typography>
                                                </TableCell>
                                                {Object.keys(item).map((subField) => (
                                                    displayName(subField) !== "_id" &&
                                                    <TableRow key={subField}>
                                                        <TableCell>{displayName(subField)}</TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                variant="outlined"
                                                                fullWidth
                                                                value={item[subField]}
                                                                onChange={(e) => handleArrayInputChange(e, field, index, subField)}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </>
                                );
                            }

                            if (dropdown[field]) {
                                return (
                                    <TableRow key={field}>
                                        <TableCell>{displayName(field)}</TableCell>
                                        <TableCell>
                                            <FormControl fullWidth>
                                                <Select
                                                    value={formData[field]}
                                                    onChange={(e) => handleInputChange(e, field)}
                                                >
                                                    {dropdown[field].map(option => (
                                                        <MenuItem key={option} value={option}>
                                                            {option}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                    </TableRow>
                                );
                            }

                            return (
                                <TableRow key={field}>
                                    <TableCell>{displayName(field)}</TableCell>
                                    <TableCell>
                                        <TextField
                                            variant="outlined"
                                            fullWidth
                                            value={formData[field]}
                                            onChange={(e) => handleInputChange(e, field)}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
                <Button variant="contained" color="primary" onClick={handleSave} sx={{marginBottom: '25px'}}>
                    Save
                </Button>
            </Grid>
        </Container>
    );
};

export default SingleEntry;
