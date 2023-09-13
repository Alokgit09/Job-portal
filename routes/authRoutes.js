const express = require("express");
const auth = require("../middleware/auth");
const {
  registerController,
  loginController,
} = require("../controllers/authControllers");

const router = express.Router();

// SINGUP || POST
router.post("/singup", registerController);

// LOGGIN || POST
router.post("/login", loginController);

module.exports = router;
