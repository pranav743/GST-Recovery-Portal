const express = require("express");
const router = express.Router();
const loginController = require("../controllers/login");
const adminController = require("../controllers/admin")
const userController = require("../controllers/user");

// Login
router.post("/login", loginController.login);
router.post("/authorize", loginController.authRoute);

// Admin
router.post("/add-user", adminController.addUser);
router.post("/delete-user", adminController.deleteUser);
router.get("/users/all", adminController.getAllUsers);
router.get("/entries/all", userController.getAllEntries);
router.post("/add-entry", adminController.addEntry);
router.post("/update-entry", adminController.updateEntry);


module.exports = router;
