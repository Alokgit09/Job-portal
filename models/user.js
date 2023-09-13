const mongoose = require("mongoose");
require("dotenv").config();
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: 2,
  },
  email: {
    type: String,
    require: true,
    unique: [true, "E-mail is already here"],
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid E-mail");
      }
    },
  },
  phone: {
    type: Number,
    require: true,
    min: 10,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    min: 6,
  },
  token: {
    type: String,
    require: true,
  },
});

userSchema.methods.generateAuthToken = async function () {
  try {

    const token = jwt.sign(
      {
        email: this.email,
        id: this._id,
        iat: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      },
      SECRET_KEY, {
        expiresIn: "1d",
      }
    );
    this.token = token;
    await this.save();
    // console.log("TokenKey>>>>", token);
    return token;
  } catch (error) {
    console.log("token error part" + error);
  }
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  }
});

const schemaUser = new mongoose.model("User", userSchema);

module.exports = schemaUser;
