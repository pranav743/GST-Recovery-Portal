import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import DownloadIcon from '@mui/icons-material/Download';

function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

function convertKeys(originalJson) {
    const keyMapping = {
        "demandID": "Demand ID",
        "dateOfDemand": "Date of Demand",
        "GSTIN": "GSTIN",
        "tradeNameOfTaxpayer": "Trade Name of the Taxpayer",
        "legalNameOfTaxpayer": "Legal Name of the Taxpayer",
        "taxPeriod": "Tax Period",
        "FYOfTaxPeriod": "FY of Tax Period",
        "section": "Section",
        "GSTDesk": "GST Desk",
        "OSPendingDemandTotal": "O/S Pending Demand TOTAL",
        "demandAsPerOrderTotal": "Demand As per Order TOTAL",
        "correctRecoveryID": "Correct Recovery ID",
        "reasonOfDemand": "Reason of Demand (Drop Down)",
        "statusOfRecovery": "Status of Recovery",
        "reasonForNotAvailable": "Reason for Not available (Drop down)/ Action taken in Available",
        "partPaymentMadeInAppeal": "Part-payment made in Appeal",
        "authorityGrantingStay": "Authority granting Stay etc (Drop Down)",
        "detailsOfARNCaseNo": "Details of ARN Case no etc",
        "dateOfARNNo": "Date of ARN No of APL-01 or 02",
        "paidWithDRC03": "Paid with DRC-03",
        "ARNNoOfDRC03": "ARN No. of DRC-03",
        "dateOfDRC03": "Date of DRC-03",
        "amountPaidByRTPAgainstLiability": "Amount paid by RTP against liability",
        "amountRecoveredFromCreditLedger": "Amount recovered from Credit Ledger",
        "amountRecoveredFromCashLedger": "Amount recovered from CASH Ledger",
        "DRC13BankAttachedDate": "DRC 13- Bank Attached date",
        "bankBalance": "Bank balance",
        "amountRecoveredFromBankTotal": "Amount recovered from Bank",
        "DRC13DebtorAttachedDate": "DRC 13- Debtor Attached date",
        "amountRecoveredFromDebtors": "Amount recovered from Debtors",
        "attachmentOfMovablePropertyDRC16Date": "(Date)Attachment of Movable Property DRC 16",
        "attachmentOfImmovablePropertyDRC16Date": "(Date)Attachment of Immovable Property DRC 16",
        "dateOfAuctionFixed": "Date of Auction fixed",
        "amountRecoveredFromAuction": "Amount recovered from Auction",
        "amountReducedOtherwise": "Amount reduced otherwise",
        "reasonForReduction": "Reason for reduction",
        "actualBalanceDues": "Actual Balance Dues",
        "remark": "Remark if any"
    };

    const convertedJson = {};
    for (const key in originalJson) {
        if (keyMapping[key]) {
            convertedJson[keyMapping[key]] = originalJson[key];
        }
    }
    return convertedJson;
}
function addCommasToNumber(number) {
    const formatter = new Intl.NumberFormat('en-IN');
    var temp = formatter.format(number);
    return temp;
}
function removeCommasFromNumber(numberString) {
    return numberString.replace(/,/g, '');
}

function removeDecimal(numberString) {
    const number = parseFloat(numberString);
    const integerNumber = parseInt(number); 
    return integerNumber.toString(); 
}

function ExportToExcelButton({ excelData, desk, isAdmin }) {
    const [workbook, setWorkbook] = useState(null);
    const [data, setData] = useState();
    console.log(excelData);
  
    const handleExport = () => {
      var temp = [];
      for (let z = 0; z < excelData.length; z++) {
        let entry = excelData[z];
        if (entry.GSTDesk === desk || isAdmin) {
          // Create a new object to avoid mutating the original entry
          let newEntry = { ...entry };
  
          // Format entry fields
          newEntry.actualBalanceDues = addCommasToNumber(newEntry.actualBalanceDues);
          newEntry.amountRecoveredFromCashLedger = addCommasToNumber(newEntry.amountRecoveredFromCashLedger);
          newEntry.amountRecoveredFromCreditLedger = addCommasToNumber(newEntry.amountRecoveredFromCreditLedger);
          newEntry.amountPaidByRTPAgainstLiability = addCommasToNumber(newEntry.amountPaidByRTPAgainstLiability);
          newEntry.paidWithDRC03 = removeDecimal(newEntry.paidWithDRC03);
          newEntry.dateOfDemand = formatDate(newEntry.dateOfDemand);
  
          // Check if RecoveryDetails exists and is an array with at least one element
          if (Array.isArray(newEntry.RecoveryDetails) && newEntry.RecoveryDetails.length > 0) {
            newEntry.bankBalance = newEntry.RecoveryDetails[0].bankBalance;
            newEntry.DRC13BankAttachedDate = newEntry.RecoveryDetails[0].DRC13BankAttachedDate;
            newEntry.amountRecoveredFromBank = newEntry.RecoveryDetails[0].amountRecoveredFromBank;
            newEntry.DRC13DebtorAttachedDate = newEntry.RecoveryDetails[0].DRC13DebtorAttachedDate;
          } else {
            // Handle case where RecoveryDetails is missing or empty
            newEntry.bankBalance = null;
            newEntry.DRC13BankAttachedDate = null;
            newEntry.amountRecoveredFromBank = null;
            newEntry.DRC13DebtorAttachedDate = null;
          }
  
          // Remove the RecoveryDetails field
          delete newEntry["RecoveryDetails"];
  
          // Convert keys and add to temp array
          var excel_obj = convertKeys(newEntry);
          console.log(excel_obj);
          temp.push(excel_obj);
        }
      }
  
      console.log(temp);
  
      // Create and download the Excel file
      const worksheet = XLSX.utils.json_to_sheet(temp);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const currentDate = new Date();
      const formattedDateTime = currentDate.toLocaleString();
      XLSX.writeFile(workbook, `${formattedDateTime}.xlsx`);
    };
  
    if (excelData.length >= 1) {
      return (
        <div style={{ width: '100%', padding: '5px 2vw', display: 'flex', justifyContent: 'flex-end' }}>
          <DownloadIcon onClick={handleExport} />
        </div>
      );
    } else {
      return null;
    }
  }
  
  export default ExportToExcelButton;