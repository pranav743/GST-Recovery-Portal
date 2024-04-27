import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Button, Typography, Container, Grid, TableBody, TableCell, TableContainer, Table, TableRow, Paper, Select, MenuItem, FormControl } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { successMessage, errorMessage } from '../components/Toast';
import axios from 'axios';
import uri from '../utils/URL';
import { useNavigate } from 'react-router-dom';

const SingleEntry = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(false);

    const [editMode, setEditMode] = useState(false);
    const [editedData, setEditedData] = useState({});

    const fields = [
        { name: 'demandID', editable: false, displayName: "Demand ID" },
        { name: 'dateOfDemand', editable: false, displayName: "Date of Demand" },
        { name: 'GSTIN', editable: false, displayName: "GSTIN" },
        { name: 'tradeNameOfTaxpayer', editable: false, displayName: "Trade Name of Taxpayer" },
        { name: 'legalNameOfTaxpayer', editable: false, displayName: "Legal Name of Taxpayer" },
        { name: 'taxPeriod', editable: false, displayName: "Tax Period" },
        { name: 'FYOfTaxPeriod', editable: false, displayName: "FY of Tax Period" },
        { name: 'section', editable: false, displayName: "Section" },
        { name: 'GSTDesk', editable: false, displayName: "GST Desk" },
        { name: 'OSPendingDemandTotal', editable: false, displayName: "OS Pending Demand Total" },
        { name: 'demandAsPerOrderTotal', editable: false, displayName: "Demand as per Order Total" },
        { name: 'correctRecoveryID', editable: true, displayName: "Correct Recovery ID" },
        { name: 'reasonOfDemand', editable: true, displayName: "Reason of Demand" },
        { name: 'statusOfRecovery', editable: true, displayName: "Status of Recovery" },
        { name: 'reasonForNotAvailable', editable: true, displayName: "Reason for Not Available" },
        { name: 'partPaymentMadeInAppeal', editable: true, displayName: "Part Payment Made in Appeal" },
        { name: 'authorityGrantingStay', editable: true, displayName: "Authority Granting Stay" },
        { name: 'detailsOfARNCaseNo', editable: true, displayName: "Details of ARN Case No" },
        { name: 'dateOfARNNo', editable: true, displayName: "Date of ARN No" },
        { name: 'paidWithDRC03', editable: true, displayName: "Paid with DRC03" },
        { name: 'ARNNoOfDRC03', editable: true, displayName: "ARN No of DRC03" },
        { name: 'dateOfDRC03', editable: true, displayName: "Date of DRC03" },
        { name: 'amountPaidByRTPAgainstLiability', editable: true, displayName: "Amount Paid by RTP Against Liability" },
        { name: 'amountRecoveredFromCreditLedger', editable: true, displayName: "Amount Recovered From Credit Ledger" },
        { name: 'amountRecoveredFromCashLedger', editable: true, displayName: "Amount Recovered From Cash Ledger" },
        { name: 'DRC13BankAttachedDate', editable: true, displayName: "DRC13 Bank Attached Date" },
        { name: 'bankBalance', editable: true, displayName: "Bank Balance" },
        { name: 'amountRecoveredFromBankTotal', editable: true, displayName: "Amount Recovered From Bank Total" },
        { name: 'DRC13DebtorAttachedDate', editable: true, displayName: "DRC13 Debtor Attached Date" },
        { name: 'amountRecoveredFromDebtors', editable: true, displayName: "Amount Recovered From Debtors" },
        { name: 'attachmentOfMovablePropertyDRC16Date', editable: true, displayName: "Attachment of Movable Property DRC16 Date" },
        { name: 'attachmentOfImmovablePropertyDRC16Date', editable: true, displayName: "Attachment of Immovable Property DRC16 Date" },
        { name: 'dateOfAuctionFixed', editable: true, displayName: "Date of Auction Fixed" },
        { name: 'amountRecoveredFromAuction', editable: true, displayName: "Amount Recovered From Auction" },
        { name: 'amountReducedOtherwise', editable: true, displayName: "Amount Reduced Otherwise" },
        { name: 'reasonForReduction', editable: true, displayName: "Reason for Reduction" },
        { name: 'actualBalanceDues', editable: true, displayName: "Actual Balance Dues" },
        { name: 'remark', editable: true, displayName: "Remark" },
    ];


    const handleEdit = () => {
        setEditMode(true);
        setEditedData(formData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedData({ ...editedData, [name]: value });
    };

    const handleSave = async () => {
        setFormData(editedData);
        setEditMode(false);
        await handleSubmit(editedData);
    };

    const handleCancel = () => {
        setEditMode(false);
    };

    function containsOnlyDigitsOrHyphen(input) {
        if (input.length === 0) { return false }
        return !(/^[0-9-]+$/.test(input));
    }

    function removeDecimal(numberString) {
        const number = parseFloat(numberString);
        const integerNumber = parseInt(number);
        return integerNumber.toString();

    }

    function checkLength(value) {
        console.log(value.length, value);
        if (value) {
            return !(value.length === 0 || value.length === 15);
        } else {
            return false;
        }

    }

    const fieldsToCheck = [
        { name: 'correctRecoveryID', length: 15, validationFunction: checkLength, errorMessage: 'Recovery ID should be 15 Characters' },
        { name: 'detailsOfARNCaseNo', length: 15, validationFunction: checkLength, errorMessage: 'ARN Case no. should be 15 Characters' },
        { name: 'ARNNoOfDRC03', length: 15, validationFunction: checkLength, errorMessage: 'ARN no. of DRC03 should be 15 Characters' },
        { name: 'actualBalanceDues', validationFunction: containsOnlyDigitsOrHyphen, errorMessage: 'Actual Balance Dues field is not correct' },
        { name: 'amountRecoveredFromCashLedger', validationFunction: containsOnlyDigitsOrHyphen, errorMessage: 'Amount Recovered From Cash Ledger field is not correct' },
        { name: 'amountRecoveredFromCreditLedger', validationFunction: containsOnlyDigitsOrHyphen, errorMessage: 'Amount Recovered From Credit Ledger field is not correct' },
        { name: 'amountPaidByRTPAgainstLiability', validationFunction: containsOnlyDigitsOrHyphen, errorMessage: 'Amount Paid By RTP Against Liability field is not correct' },
    ];



    const handleSubmit = async (event) => {
        console.log(formData)
        for (const field of fieldsToCheck) {
            const fieldValue = editedData[field.name];
            if (field.validationFunction && field.validationFunction(fieldValue)) {
                errorMessage(field.errorMessage);
                return;
            }
        }

        try {
            const res = await axios.post(uri + "/update-entry", editedData);
            if (res.data.success) {
                successMessage(res.data.msg);
            } else {
                errorMessage(res.data.msg);
            }
        } catch (error) {
            console.log(error);
            errorMessage(error.response.data.msg);
        }

    };

    const getLatestData = async () => {
        try {
            const res = await axios.get(uri + `/entries/all?demandID=${id}`);
            console.log(res.data.data[0]);
            setFormData(res.data.data[0])
        } catch (error) {
            console.log(error);
        }
    }

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
    

    React.useEffect(() => {
        if (!formData) {
            getLatestData();
        }

    }, [])

    return (
        <TableContainer component={Paper}>
            <ToastContainer />
            <Table>
                <TableBody>
                    {fields.map((field) => (
                        <TableRow key={field.name}>
                            <TableCell>
                                <Typography variant="subtitle1">
                                    <strong>{field.displayName}</strong>
                                </Typography>
                            </TableCell>
                            <TableCell>
                                {editMode && field.editable ? (
                                    <>
                                        {(() => {
                                            switch (field.name) {
                                                case "reasonOfDemand":
                                                    return <FormControl sx={{ width: '200px', height: '35px', marginBottom: '0px', flexGrow: 1, display: { xs: 'none', sm: 'block' } }} >

                                                        <Select sx={{ height: '35px' }}
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={editedData[field.name]}
                                                            onChange={handleChange}
                                                            name={field.name}
                                                            fullWidth
                                                        >

                                                            {dropdown.reasonOfDemand.map((option, index) => (
                                                                <MenuItem key={index} value={option}>{option}</MenuItem>
                                                            ))}

                                                        </Select>

                                                    </FormControl>;
                                                case "authorityGrantingStay":
                                                    return  <FormControl sx={{ width: '200px', height: '35px', marginBottom: '0px', flexGrow: 1, display: { xs: 'none', sm: 'block' } }} >

                                                    <Select sx={{ height: '35px' }}
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={editedData[field.name]}
                                                        onChange={handleChange}
                                                        name={field.name}
                                                        fullWidth
                                                    >

                                                        {dropdown.authorityGrantingStay.map((option, index) => (
                                                            <MenuItem key={index} value={option}>{option}</MenuItem>
                                                        ))}

                                                    </Select>

                                                </FormControl>;
                                                case "reasonForNotAvailable":
                                                    return  <FormControl sx={{ width: '200px', height: '35px', marginBottom: '0px', flexGrow: 1, display: { xs: 'none', sm: 'block' } }} >

                                                    <Select sx={{ height: '35px' }}
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={editedData[field.name]}
                                                        onChange={handleChange}
                                                        name={field.name}
                                                        fullWidth
                                                    >

                                                        {dropdown.reasonForNotAvailable.map((option, index) => (
                                                            <MenuItem key={index} value={option}>{option}</MenuItem>
                                                        ))}

                                                    </Select>

                                                </FormControl>;
                                                case "statusOfRecovery":
                                                    return  <FormControl sx={{ width: '200px', height: '35px', marginBottom: '0px', flexGrow: 1, display: { xs: 'none', sm: 'block' } }} >

                                                    <Select sx={{ height: '35px' }}
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={editedData[field.name]}
                                                        onChange={handleChange}
                                                        name={field.name}
                                                        fullWidth
                                                    >

                                                        {dropdown.statusOfRecovery.map((option, index) => (
                                                            <MenuItem key={index} value={option}>{option}</MenuItem>
                                                        ))}

                                                    </Select>

                                                </FormControl>;
                                                default:
                                                    return (
                                                        <TextField
                                                            name={field.name}
                                                            value={editedData[field.name]}
                                                            fullWidth
                                                            onChange={handleChange}
                                                            variant="outlined"
                                                        />
                                                    );
                                            }
                                        })()}
                                    </>
                                )
                                    : (
                                        <Typography variant="subtitle1">{formData[field.name]}</Typography>
                                    )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {editMode ? (
                <>
                    <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2, ml: 2 }}>
                        Save
                    </Button>
                    <Button variant="contained" onClick={handleCancel} sx={{ mt: 2, ml: 2 }}>
                        Cancel
                    </Button>
                </>
            ) : (
                <>
                    <Button variant="contained" color="primary" onClick={handleEdit} sx={{ mt: 2, ml: 2 }}>
                        Edit
                    </Button>
                    {/* <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2, ml: 2 }}>
                        Submit
                    </Button> */}
                </>
            )}
            <div style={{ height: '40px' }}></div>
        </TableContainer>
    );
}

export default SingleEntry;
