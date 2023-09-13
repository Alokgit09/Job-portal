const userSchemaData = require("../models/user");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

///////// SING UP /////////

const registerController = async (req, res) => {
  const email = req.body.email;
  const ragisterInfo = new userSchemaData(req.body);
  const uniqueEmail = await userSchemaData.findOne({ email: email });
  try {
    console.log("uniqueEmail>>>", uniqueEmail);
    if (!uniqueEmail) {
      await ragisterInfo.generateAuthToken();
      res.status(201).json(ragisterInfo);
      console.log("ragisterInfo", ragisterInfo);
    } else {
      res.status(500).json({ message: "This E-mail Already Used" });
    }
  } catch (err) {
    console.log("Error>>>>>", err);
    res.status(400).send({
      message: `Error In Register Controllers`,
      success: false,
      err,
    });
  }
};

///////// LOGIN /////////

const loginController = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log("matchEmail>>>>", email);
  try {
    const logData = await userSchemaData.findOne({ email: email });
    console.log("matchEmail>>>>", logData);
    const isMatch = await bcrypt.compare(password, logData.password);
    const token = await logData.generateAuthToken();
    let multiple = { email: email, cookieKey: token };
    console.log("multiple", multiple);
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 600000),
      httpOnly: false,
      secure: false,
    });
    console.log("Cookie>>>>", multiple);
    if (isMatch) {
      res.status(201).json(multiple);
    } else {
      res.send({ message: "Invalid Password" });
    }
  } catch (err) {
    console.log("login Error>>>>", err);
    res.send({ message: "Invalid login Details" });
  }
};

module.exports = { registerController, loginController };
