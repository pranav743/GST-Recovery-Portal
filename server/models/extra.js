const mongoose = require("mongoose");

const extraSchema = new mongoose.Schema({
  dropDown: {
    reasonOfDemand: [String],
    authorityGrantingStay: [String],
    reasonForNotAvailable: [String],
    statusOfRecovery: [String]
  }
});


const Extra = mongoose.model("Extra", extraSchema);

module.exports = Extra;
