const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const staffSchema = new mongoose.Schema({

  name: {
    type: String,
    required: false
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    minlength: [4, "Username must be at least 4 characters long"],
    maxlength: [150, "Username cannot exceed 150 characters"],
    unique: true 
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  createdAt: {
    type: Date
  },
  isAdmin: {
    type: Boolean,
    required: false,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }

});

staffSchema.methods.generateAuthToken = function(){
  const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET, {expiresIn: "1d"});
  return token;
}

const User = mongoose.model("User", staffSchema);


module.exports = User;
