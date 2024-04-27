const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Demand = require("../models/recovery");
const slugify = require('slugify');

const createDemandEntry = async (req, res) => {
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

    const legalNameSlug = slugify(legalNameOfTaxpayer, { lower: true });

    const newDemand = new Demand({
      demandID,
      dateOfDemand,
      GSTIN,
      tradeNameOfTaxpayer,
      legalNameOfTaxpayer,
      legalNameSlug, // Add slug field
      taxPeriod,
      FYOfTaxPeriod,
      section,
      GSTDesk,
      OSPendingDemandTotal,
      demandAsPerOrderTotal
    });

    // Save the new entry to the database
    await newDemand.save();

    return res.status(201).json({ success: true, msg: "New demand entry created successfully" });
    
  } catch (error) {
    console.error("Error in creating demand entry:", error);
    return res.status(500).json({ success: false, msg: "Some error occurred while creating the demand entry" });
  }
};


const demoRoute = async (req, res) => {
  try {
    // Perform Action 
    return res.status(200).json({success: true, msg: "Success"});
    
  } catch (error) {
    console.error("Error in handling login request:", error);
    return res.status(500).json({success: false, msg: "Some Error Occurred"});
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({username: username})
    if (!user || !user.isActive){
      return res.status(500).json({success: false, msg: "User doesn't Exist"});
    }
    if (user.password == password){
      const token = user.generateAuthToken();
      return res.status(200).json({success: true, token: token, msg: `Logged in as ${username}`});
    }
    else{
      return res.status(500).json({success: false, msg: "Wrong Password !"});
    }
    
  } catch (error) {
    console.error("Error in handling login request:", error);
    return res.status(500).json({success: false, msg: "Some Error Occurred"});
  }
};

const authRoute = async (req, res) => {

  try {

    const { token } = req.body;
    var decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({_id: decoded._id});

    if (!user || !user.isActive){
      return res.status(500).json({success: false, msg: "User doesn't Exist"});
    }
    else{

      const newUser = {
        username: user.username,
        isAdmin: user.isAdmin,
        name: user.name ? user.name : null
      }

      return res.status(200).json({success: true, user: newUser, msg: `User Details`});
    }

  } catch (error) {
    console.error("Error in handling login request:", error);
    return res.status(500).json({success: false, msg: "You are not Authorized to perform Action"});
  }
};

module.exports = {
  login,
  authRoute
};
