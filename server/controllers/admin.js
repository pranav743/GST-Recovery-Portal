const dotenv = require("dotenv");
dotenv.config();
const User = require("../models/user");
const Demand = require('../models/recovery');

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
    const data = req.body;
    console.log(data._id);
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

module.exports = {
  addUser,
  deleteUser,
  getAllUsers,
  addEntry,
  updateEntry
};
