const dotenv = require("dotenv");
dotenv.config();
const User = require("../models/user");
const Demand = require('../models/recovery');
const xlsx = require('xlsx')

// Route for adding a new user or updating an inactive user
const addUser = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    // Check if a user with the same username already exists
    let existingUser = await User.findOne({ username });

    if (existingUser) {
      // If user is inactive, update their details and set isActive to true
      if (!existingUser.isActive) {
        existingUser.name = name;
        existingUser.password = password;
        existingUser.createdAt = new Date();
        existingUser.isActive = true;
        await existingUser.save();
        return res.status(200).json({ success: true, msg: "User details updated successfully" });
      } else {
        return res.status(400).json({ success: false, msg: "User already exists" });
      }
    } else {
      // Create a new user instance
      const newUser = new User({
        name,
        username,
        password,
        createdAt: new Date(),
        isActive: true
      });

      // Save the new user to the database
      await newUser.save();
      return res.status(200).json({ success: true, msg: "User added successfully" });
    }
  } catch (error) {
    console.error("Error in adding/updating user:", error);
    return res.status(500).json({ success: false, msg: "Failed to add/update user" });
  }
};

// Route for "soft" deleting a user by setting isActive to false
const deleteUser = async (req, res) => {
  try {
    const { username } = req.body;

    // Find the user by ID
    const user = await User.findOne({ username: username });

    if (!user || !user.isActive) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // Set isActive to false instead of physically deleting the user
    user.isActive = false;
    await user.save();

    return res.status(200).json({ success: true, msg: "User deactivated successfully" });
  } catch (error) {
    console.error("Error in deactivating user:", error);
    return res.status(500).json({ success: false, msg: "Failed to deactivate user" });
  }
};

const getAllUsers = async (req, res) => {

  try {

    const reqQuery = { ...req.query, isActive: true };
    const removeFields = ['select', 'sort', 'limit', 'page'];
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    query = User.find(JSON.parse(queryStr));

    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await User.countDocuments(query);

    query = query.skip(startIndex).limit(limit);
    const pagination = {};
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      }
    }
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      }
    }

    const user = await query;
    if (!user) {
      return res.status(401).json({ success: false, msg: "There are no Users" });
    }
    return res.status(200).json({ success: true, count: total, pagination, data: user });

  } catch (error) {
    console.log(`${error.message} (error)`.red);
    return res.status(400).json({ success: false, msg: "Server Error" });
  }

};

const addEntry = async (req, res) => {
  try {
    const {
      demandID,
      dateOfDemand,
      GSTIN,
      tradeNameOfTaxpayer,
      legalNameOfTaxpayer,
      taxPeriod,
      FYOfTaxPeriod,
      section,
      GSTDesk,
      OSPendingDemandTotal,
      demandAsPerOrderTotal
    } = req.body;

    // Check if demandID already exists
    const existingDemand = await Demand.findOne({ demandID });
    if (existingDemand) {
      return res.status(400).json({ success: false, msg: 'Demand ID already exists' });
    }

    // Create a new Demand entry
    const newDemand = new Demand({
      demandID,
      dateOfDemand,
      GSTIN,
      tradeNameOfTaxpayer,
      legalNameOfTaxpayer,
      taxPeriod,
      FYOfTaxPeriod,
      section,
      GSTDesk,
      OSPendingDemandTotal,
      demandAsPerOrderTotal
    });

    await newDemand.save();

    return res.status(200).json({ success: true, msg: 'Entry Added Successfully !' });

  } catch (error) {
    console.error('Error in adding/updating demand:', error);
    return res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

const updateEntry = async (req, res) => {
  try {
    var data = req.body;
    console.log(data);
    const actual_balanace_dues = Number(data.demandAsPerOrderTotal) - Number(data.partPaymentMadeInAppeal) - Number(data.paidWithDRC03) - Number(data.amountPaidByRTPAgainstLiability) - Number(data.amountRecoveredFromCreditLedger) - Number(data.amountRecoveredFromCashLedger) - Number(data.RecoveryDetails[0]?.amountRecoveredFromBank || "0") - Number(data.amountRecoveredFromDebtors) - Number(data.amountRecoveredFromAuction) - Number(data.amountReducedOtherwise)
    if (actual_balanace_dues >= 0){
      data.actualBalanceDues = actual_balanace_dues.toString();
    } else {
      data.actualBalanceDues = "0";
    }
    

    const updatedDemand = await Demand.findOneAndUpdate(
      { _id: data._id }, // Filter by ID
      data, // New data to be updated
      { new: true } // To return the updated document
    );

    if (!updatedDemand) {
      return res.status(500).json({ success: false, msg: "Something wen't Wrong !" });
    }

    
    return res.status(200).json({ success: true, msg: 'Entry Updated Successfully !' });

  } catch (error) {
    console.error('Error in updating demand:', error);
    return res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

const uploadExcel = async (req, res) => {
  try {
    
    const filePath = 'uploads/uploaded.xlsx';
    
    const workbook = xlsx.readFile(filePath);
    // console.log(workbook);
    const sheet_name_list = workbook.SheetNames;
    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    
    jsonData.forEach(async (item) => {
      const existingDemand = await Demand.findOne({ demandID: item['Demand ID'] });
            if (!existingDemand) {
              var newDemand = ({
                demandID: item['Demand ID'] ? item['Demand ID'] : "",
                dateOfDemand: item['Date of Demand'] ? new Date(item['Date of Demand']) : new Date(),
                GSTIN: item['GSTIN'] ? item['GSTIN'] : "",
                tradeNameOfTaxpayer: item['Trade Name of the Taxpayer'] ? item['Trade Name of the Taxpayer'] : "",
                legalNameOfTaxpayer: item['Legal Name of the Taxpayer'] ? item['Legal Name of the Taxpayer'] : "",
                taxPeriod: item['Tax Period'] ? item['Tax Period'] : "",
                FYOfTaxPeriod: item['FY of Tax Period'] ? item['FY of Tax Period'] : "",
                section: item['Section'] ? item['Section'] : "",
                GSTDesk: item['GST Desk'] ? item['GST Desk'] : "",
                OSPendingDemandTotal: item['O/S Pending Demand TOTAL'] ? item['O/S Pending Demand TOTAL'] : '0',
                demandAsPerOrderTotal: item['Demand As per Order TOTAL'] ? item['Demand As per Order TOTAL'] : '0',
                correctRecoveryID: item['Correct Recovery ID'] ? item['Correct Recovery ID'] : "",
                reasonOfDemand: item['Reason of Demand (Drop Down)'] ? item['Reason of Demand (Drop Down)'] : "",
                statusOfRecovery: item['Status of Recovery'] ? item['Status of Recovery'] : "",
                reasonForNotAvailable: item['Reason for Not available (Drop down)/ Action taken in Available'] ? item['Reason for Not available (Drop down)/ Action taken in Available'] : "",
                partPaymentMadeInAppeal: item['Part-payment made in Appeal'] ? item['Part-payment made in Appeal'] : "0",
                authorityGrantingStay: item['Authority granting Stay etc (Drop Down)'] ? item['Authority granting Stay etc (Drop Down)'] : "",
                detailsOfARNCaseNo: item['Details of  ARN Case no etc'] ? item['Details of  ARN Case no etc'] : "",
                dateOfARNNo: item['Date of ARN No of APL-01 or 02'] ? item['Date of ARN No of APL-01 or 02'] : "",
                paidWithDRC03: item['Paid with DRC-03'] ? item['Paid with DRC-03'] : '0',
                ARNNoOfDRC03: item['ARN No. of DRC-03'] ? item['ARN No. of DRC-03'] : "",
                dateOfDRC03: item['Date of DRC-03'] ? item['Date of DRC-03'] : "",
                amountPaidByRTPAgainstLiability: item['Amount paid by RTP against liability'] ? item['Amount paid by RTP against liability'] : "0",
                amountRecoveredFromCreditLedger: item['Amount recovered from Credit Ledger'] ? item['Amount recovered from Credit Ledger'] : "0",
                amountRecoveredFromCashLedger: item['Amount recovered from CASH Ledger'] ? item['Amount recovered from CASH Ledger'] : "0",
                RecoveryDetails: [{
                  DRC13BankAttachedDate: item['DRC 13- Bank Attached date'] ? item['DRC 13- Bank Attached date'] : "",
                  bankBalance: item['Bank balance'] ? item['Bank balance'] : "",
                  amountRecoveredFromBank: item['Amount recovered from Bank'] ? item['Amount recovered from Bank'] : "0",
                  DRC13DebtorAttachedDate: item['DRC 13- Debtor Attached date'] ? item['DRC 13- Debtor Attached date'] : ""
                }],
                amountRecoveredFromDebtors: item['Amount recovered from Debtors'] ? item['Amount recovered from Debtors'] : "0",
                attachmentOfMovablePropertyDRC16Date: item['(Date)Attachment of Movable Property DRC 16'] ? item['(Date)Attachment of Movable Property DRC 16'] : "",
                attachmentOfImmovablePropertyDRC16Date: item['(Date)Attachment of Immovable Property DRC 16'] ? item['(Date)Attachment of Immovable Property DRC 16'] : "",
                dateOfAuctionFixed: item['Date of Auction fixed'] ? item['Date of Auction fixed'] : "",
                amountRecoveredFromAuction: item['Amount recovered from Auction'] ? item['Amount recovered from Auction'] : "0",
                amountReducedOtherwise: item['Amount reduced otherwise'] ? item['Amount reduced otherwise'] : "0",
                reasonForReduction: item['Reason for reduction'] ? item['Reason for reduction'] : "",
                actualBalanceDues: item['Actual Balance Dues'] ? item['Actual Balance Dues'] : "0",
                remark: item['Remark if any'] ? item['Remark if any'] : ""
            });
            // console.log(newDemand)
            const actual_balanace_dues = Number(newDemand.demandAsPerOrderTotal) - Number(newDemand.partPaymentMadeInAppeal) - Number(newDemand.paidWithDRC03) - Number(newDemand.amountPaidByRTPAgainstLiability) - Number(newDemand.amountRecoveredFromCreditLedger) - Number(newDemand.amountRecoveredFromCashLedger) - Number(newDemand.RecoveryDetails[0]?.amountRecoveredFromBank || "0") - Number(newDemand.amountRecoveredFromDebtors) - Number(newDemand.amountRecoveredFromAuction) - Number(newDemand.amountReducedOtherwise)
            // console.log(actual_balanace_dues);
            if (actual_balanace_dues < 0){
              newDemand.actualBalanceDues = "0"
            }
            else newDemand.actualBalanceDues = actual_balanace_dues.toString() ;

            newDemand = new Demand(newDemand);
            
        // console.log(newDemand);
            await newDemand.save();
      }
    });
    return res.status(200).json({ success: true, msg: "Excel File Uploaded Successfully" });
  } catch (error) {
    console.error("Problem in Excel:", error);
    return res.status(500).json({ success: false, msg: "Upload Correct Excel Format" });
  }
};


module.exports = {
  addUser,
  deleteUser,
  getAllUsers,
  addEntry,
  updateEntry,
  uploadExcel
};
