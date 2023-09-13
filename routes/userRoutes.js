const express = require("express");
const auth = require("../middleware/auth");
const updateUserControllers = require("../controllers/userControllers");

const router = express.Router();

///////Update Users PUT ///////

router.put("/update-user", auth, updateUserControllers);

module.exports = router;
