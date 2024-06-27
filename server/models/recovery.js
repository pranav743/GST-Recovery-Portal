const mongoose = require("mongoose");

const demandSchema = new mongoose.Schema({
    demandID: {
        type: String,
        required: [true, "Demand ID is required"],
        maxlength: [15, "Demand ID must be exactly 15 characters long"],
        minlength: [15, "Demand ID must be exactly 15 characters long"]
    },
    dateOfDemand: {
        type: Date,
        required: [true, "Date of Demand is required"]
    },
    GSTIN: {
        type: String,
        required: [true, "GSTIN is required"],
        maxlength: [15, "GSTIN must be exactly 15 characters long"],
        minlength: [15, "GSTIN must be exactly 15 characters long"]
    },
    tradeNameOfTaxpayer: {
        type: String,
        required: [true, "Trade Name of the Taxpayer is required"]
    },
    legalNameOfTaxpayer: {
        type: String,
        required: [true, "Legal Name of the Taxpayer is required"]
    },
    taxPeriod: {
        type: String,
        required: [true, "Tax Period is required"]
    },
    FYOfTaxPeriod: {
        type: String,
        required: [true, "FY of Tax Period is required"]
    },
    section: {
        type: String,
        required: [true, "Section is required"]
    },
    GSTDesk: {
        type: String,
        required: [true, "GST Desk is required"]
    },
    OSPendingDemandTotal: {
        type: Number,
        validate: {
            validator: Number.isInteger,
            message: "OS Pending Demand Total must be an integer"
        },
        required: [true, "Total Pending Demand is required"]
    },
    demandAsPerOrderTotal: {
        type: Number,
        validate: {
            validator: Number.isInteger,
            message: "Demand As per Order Total must be an integer"
        },
        required: [true, "Demand As per total Order is required"]
    },


    // Details will be edited by other personel
    correctRecoveryID: {
        type: String,
        maxlength: [15, "Correct Recovery ID must be exactly 15 characters long"],
        // minlength: [15, "Correct Recovery ID must be exactly 15 characters long"],
        default: "",
    },
    reasonOfDemand: {
        type: String,
        default: ""
    },
    statusOfRecovery: {
        type: String,
        default: ""
    },
    reasonForNotAvailable: {
        type: String,
        default: ""
    },
    partPaymentMadeInAppeal: {
        type: String,
        default: ""
    },
    authorityGrantingStay: {
        type: String,
        default: ""
    },
    detailsOfARNCaseNo: {
        type: String,
        maxlength: [15, "Details of ARN Case Number must be exactly 15 characters long"],
        // minlength: [15, "Details of ARN Case Number must be exactly 15 characters long"],
        default: ""
    },
    dateOfARNNo: String,
    paidWithDRC03: {
        type: String,
        default: false,
    },
    ARNNoOfDRC03: {
        type: String,
        maxlength: [15, "ARN Number DRC-03 must be exactly 15 characters long"],
        // minlength: [15, "ARN Number DRC-03 must be exactly 15 characters long"]
        default: '',
    },
    dateOfDRC03: String,
    amountPaidByRTPAgainstLiability: {
        type: String,
        default: ""
    },
    amountRecoveredFromCreditLedger: {
        type: String,
        default: ""
    },
    amountRecoveredFromCashLedger: {
        type: String,
        default: ""
    },

    // Multiple
    RecoveryDetails: [
        {
            DRC13BankAttachedDate: String,
            bankBalance: {
                type: String,
                default: ""
            },
            amountRecoveredFromBank: {
                type: String,
                default: ""
            },
            DRC13DebtorAttachedDate: String,
        }

    ],
    DRC13BankAttachedDate: String,
    // bankBalance: {
    //     type: String,
    //     default: ""
    // },
    // amountRecoveredFromBankTotal: {
    //     type: String,
    //     default: ""
    // },
    DRC13DebtorAttachedDate: String,

    // Multiple End

    amountRecoveredFromDebtors: {
        type: String,
        default: ""
    },
    attachmentOfMovablePropertyDRC16Date: String,
    attachmentOfImmovablePropertyDRC16Date: String,
    dateOfAuctionFixed: String,
    amountRecoveredFromAuction: {
        type: String,
        default: ""
    },
    amountReducedOtherwise: {
        type: String,
        default: ""
    },
    reasonForReduction: String,
    actualBalanceDues: {
        type: String,
        default: ""
    },
    remark: String
});

const Demand = mongoose.model("Demand", demandSchema);

module.exports = Demand;
