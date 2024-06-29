const Demand = require("../models/recovery");
const ExcelJS = require('exceljs');


const exportExcel = async (req, res) => {

    try {
        const demands = await Demand.find().lean();

        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Demands');

        // Define columns
        worksheet.columns = [
            { header: 'Demand ID', key: 'demandID' },
            { header: 'Date of Demand', key: 'dateOfDemand' },
            { header: 'GSTIN', key: 'GSTIN' },
            { header: 'Trade Name of the Taxpayer', key: 'tradeNameOfTaxpayer' },
            { header: 'Legal Name of the Taxpayer', key: 'legalNameOfTaxpayer' },
            { header: 'Tax Period', key: 'taxPeriod' },
            { header: 'FY of Tax Period', key: 'FYOfTaxPeriod' },
            { header: 'Section', key: 'section' },
            { header: 'GST Desk', key: 'GSTDesk' },
            { header: 'O/S Pending Demand TOTAL', key: 'OSPendingDemandTotal' },
            { header: 'Demand As per Order TOTAL', key: 'demandAsPerOrderTotal' },
            { header: 'Correct Recovery ID', key: 'correctRecoveryID' },
            { header: 'Reason of Demand (Drop Down)', key: 'reasonOfDemand' },
            { header: 'Status of Recovery', key: 'statusOfRecovery' },
            { header: 'Reason for Not available (Drop down)/ Action taken in Available', key: 'reasonForNotAvailable' },
            { header: 'Part-payment made in Appeal', key: 'partPaymentMadeInAppeal' },
            { header: 'Authority granting Stay etc (Drop Down)', key: 'authorityGrantingStay' },
            { header: 'Details of  ARN Case no etc', key: 'detailsOfARNCaseNo' },
            { header: 'Date of ARN No of APL-01 or 02', key: 'dateOfARNNo' },
            { header: 'Paid with DRC-03', key: 'paidWithDRC03' },
            { header: 'ARN No. of DRC-03', key: 'ARNNoOfDRC03' },
            { header: 'Date of DRC-03', key: 'dateOfDRC03' },
            { header: 'Amount paid by RTP against liability', key: 'amountPaidByRTPAgainstLiability' },
            { header: 'Amount recovered from Credit Ledger', key: 'amountRecoveredFromCreditLedger' },
            { header: 'Amount recovered from CASH Ledger', key: 'amountRecoveredFromCashLedger' },
            { header: 'DRC 13- Bank Attached date', key: 'DRC13BankAttachedDate' },
            { header: 'Bank balance', key: 'bankBalance' },
            { header: 'Amount recovered from Bank', key: 'amountRecoveredFromBank' },
            { header: 'DRC 13- Debtor Attached date', key: 'DRC13DebtorAttachedDate' },
            { header: 'Amount recovered from Debtors', key: 'amountRecoveredFromDebtors' },
            { header: '(Date)Attachment of Movable Property DRC 16', key: 'attachmentOfMovablePropertyDRC16Date' },
            { header: '(Date)Attachment of Immovable Property DRC 16', key: 'attachmentOfImmovablePropertyDRC16Date' },
            { header: 'Date of Auction fixed', key: 'dateOfAuctionFixed' },
            { header: 'Amount recovered from Auction', key: 'amountRecoveredFromAuction' },
            { header: 'Amount reduced otherwise', key: 'amountReducedOtherwise' },
            { header: 'Reason for reduction', key: 'reasonForReduction' },
            { header: 'Actual Balance Dues', key: 'actualBalanceDues' },
            { header: 'Remark if any', key: 'remark' },
        ];

        // Add rows
        demands.forEach(demand => {
            worksheet.addRow({
                demandID: demand.demandID,
                dateOfDemand: demand.dateOfDemand,
                GSTIN: demand.GSTIN,
                tradeNameOfTaxpayer: demand.tradeNameOfTaxpayer,
                legalNameOfTaxpayer: demand.legalNameOfTaxpayer,
                taxPeriod: demand.taxPeriod,
                FYOfTaxPeriod: demand.FYOfTaxPeriod,
                section: demand.section,
                GSTDesk: demand.GSTDesk,
                OSPendingDemandTotal: Number(demand.OSPendingDemandTotal),
                demandAsPerOrderTotal: demand.demandAsPerOrderTotal,
                correctRecoveryID: demand.correctRecoveryID,
                reasonOfDemand: demand.reasonOfDemand,
                statusOfRecovery: demand.statusOfRecovery,
                reasonForNotAvailable: demand.reasonForNotAvailable,
                partPaymentMadeInAppeal: Number(demand.partPaymentMadeInAppeal),
                authorityGrantingStay: demand.authorityGrantingStay,
                detailsOfARNCaseNo: demand.detailsOfARNCaseNo,
                dateOfARNNo: demand.dateOfARNNo,
                paidWithDRC03: Number(demand.paidWithDRC03),
                ARNNoOfDRC03: demand.ARNNoOfDRC03,
                dateOfDRC03: demand.dateOfDRC03,
                amountPaidByRTPAgainstLiability: Number(demand.amountPaidByRTPAgainstLiability),
                amountRecoveredFromCreditLedger: Number(demand.amountRecoveredFromCreditLedger),
                amountRecoveredFromCashLedger: Number(demand.amountRecoveredFromCashLedger),
                DRC13BankAttachedDate: demand.RecoveryDetails[0].DRC13BankAttachedDate,
                bankBalance: Number(demand.RecoveryDetails[0].bankBalance),
                amountRecoveredFromBank: Number(demand.RecoveryDetails[0].amountRecoveredFromBank),
                DRC13DebtorAttachedDate: demand.RecoveryDetails[0].DRC13DebtorAttachedDate,
                amountRecoveredFromDebtors: Number(demand.amountRecoveredFromDebtors),
                attachmentOfMovablePropertyDRC16Date: demand.attachmentOfMovablePropertyDRC16Date,
                attachmentOfImmovablePropertyDRC16Date: demand.attachmentOfImmovablePropertyDRC16Date,
                dateOfAuctionFixed: demand.dateOfAuctionFixed,
                amountRecoveredFromAuction: Number(demand.amountRecoveredFromAuction),
                amountReducedOtherwise: Number(demand.amountReducedOtherwise),
                reasonForReduction: demand.reasonForReduction,
                actualBalanceDues: Number(demand.actualBalanceDues),
                remark: demand.remark,
            });
        });

        // Write to file and send it to the client
        const buffer = await workbook.xlsx.writeBuffer();
        res.setHeader('Content-Disposition', 'attachment; filename=demands.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);

    } catch (error) {
        console.error("Error in handling login request:", error);
        return res.status(500).json({ success: false, msg: "Some Error Occurred" });
    }
};



module.exports = {
    exportExcel
}