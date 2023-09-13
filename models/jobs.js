const mongoose = require("mongoose");
const validator = require("validator");

const jobsSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  company: {
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
  education: {
    type: String,
    require: true,
  },
  city: {
    type: String,
    require: true,
  },
  job_title: {
    type: String,
    require: true,
  },
  experience: {
    type: String,
    require: true,
  },
  selery: {
    type: String,
    require: true,
  },
});

const allJobsSchema = new mongoose.model("Alljobs", jobsSchema);

module.exports = allJobsSchema;
