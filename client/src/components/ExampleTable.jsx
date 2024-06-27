import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';

const headers = [
  "Demand ID", "Date of Demand", "GSTIN", "Trade Name of the Taxpayer", "Legal Name of the Taxpayer", "Tax Period", 
  "FY of Tax Period", "Section", "GST Desk", "O/S Pending Demand TOTAL", "Demand As per Order TOTAL", 
  "Correct Recovery ID", "Reason of Demand (Drop Down)", "Status of Recovery", 
  "Reason for Not available (Drop down)/ Action taken in Available", "Part-payment made in Appeal", 
  "Authority granting Stay etc (Drop Down)", "Details of ARN Case no etc", 
  "Date of ARN No of APL-01 or 02", "Paid with DRC-03", "ARN No. of DRC-03", "Date of DRC-03", 
  "Amount paid by RTP against liability", "Amount recovered from Credit Ledger", 
  "Amount recovered from CASH Ledger", "DRC 13- Bank Attached date", "Bank balance", 
  "Amount recovered from Bank", "DRC 13- Debtor Attached date", "Amount recovered from Debtors", 
  "(Date)Attachment of Movable Property DRC 16", "(Date)Attachment of Immovable Property DRC 16", 
  "Date of Auction fixed", "Amount recovered from Auction", "Amount reduced otherwise", 
  "Reason for reduction", "Actual Balance Dues", "Remark if any"
];

const createData = () => {
  const emptyRow = headers.reduce((acc, header) => {
    acc[header] = "";
    return acc;
  }, {});
  return [emptyRow, emptyRow];
};

const rows = createData();

const DemandTable = () => {
  return (
    <>
    <h3 style={{margin: '15px', marginTop: '26px'}}>Example of table to be uploaded</h3>
    
    <TableContainer component={Paper} sx={{maxWidth: '97vw', marginBottom: '20px', marginTop: '0'}}>
        
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {headers.map((header) => (
                <TableCell key={header}>{row[header]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
};

export default DemandTable;
