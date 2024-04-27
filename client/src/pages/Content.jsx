import React from 'react'
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';


const Content = () => {

    const gstRecoveryData = [
        {
            demandId: "D123456",
            dateOfDemand: "2023-05-15",
            gstin: "GSTIN123456789",
            tradeName: "ABC Traders",
            legalName: "ABC Corporation Pvt. Ltd.",
            taxPeriod: "2023-04",
            fiscalYear: "2023-24",
            section: "Section A",
            gstDesk: "Desk 1",
            osPendingDemandTotal: 50000.00,
            demandAsPerOrderTotal: 75000.00
        },
        {
            demandId: "D789012",
            dateOfDemand: "2023-07-20",
            gstin: "GSTIN987654321",
            tradeName: "XYZ Enterprises",
            legalName: "XYZ Pvt. Ltd.",
            taxPeriod: "2023-06",
            fiscalYear: "2023-24",
            section: "Section B",
            gstDesk: "Desk 2",
            osPendingDemandTotal: 100000.00,
            demandAsPerOrderTotal: 125000.00
        },
    ];


    return (
        <div>


            {gstRecoveryData.map((item, index) => (
                <Paper key={index} elevation={3} style={{ margin: '10px', padding: '20px' }}>
                    <Typography variant="h6">Demand ID: {item.demandId}</Typography>
                    <Typography>Date of Demand: {item.dateOfDemand}</Typography>
                    <Typography>GSTIN: {item.gstin}</Typography>
                    <Typography>Trade Name: {item.tradeName}</Typography>
                    <Typography>Legal Name: {item.legalName}</Typography>
                    <Typography>Tax Period: {item.taxPeriod}</Typography>
                    <Typography>FY of Tax Period: {item.fiscalYear}</Typography>
                    <Typography>Section: {item.section}</Typography>
                    <Typography>GST Desk: {item.gstDesk}</Typography>
                    <Typography>O/S Pending Demand Total: {item.osPendingDemandTotal}</Typography>
                    <Typography>Demand As per Order Total: {item.demandAsPerOrderTotal}</Typography>
                </Paper>
            ))}


        </div>
    )
}

export default Content
