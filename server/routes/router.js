const express = require("express");
const router = express.Router();
const loginController = require("../controllers/login");
const adminController = require("../controllers/admin")
const userController = require("../controllers/user");
const upload = require("../utils/upload");
const exportController = require("../controllers/exportFunctions");

// Login
router.post("/login", loginController.login);
router.post("/authorize", loginController.authRoute);

// Admin
router.post("/add-user", adminController.addUser);
router.post("/delete-user", adminController.deleteUser);
router.get("/users/all", adminController.getAllUsers);
router.get("/entries/all", userController.getAllEntries);
router.get("/extras/all", adminController.getDropDowns);
router.post("/update/drop-down", adminController.updateDropDowns);
router.post("/add-entry", adminController.addEntry);
router.post("/update-entry", adminController.updateEntry);
router.post("/delete-entry", userController.deleteEntry);
router.post("/upload-data",upload.single('file'), adminController.uploadExcel);
router.get("/download-excel", exportController.exportExcel);


module.exports = router;
