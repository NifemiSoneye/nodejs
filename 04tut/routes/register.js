const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");

console.log("Register route file loaded!");

router.post("/", registerController.handleNewUser);

module.exports = router;
