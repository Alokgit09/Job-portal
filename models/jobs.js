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
  status: {
    type: String,
    require: true,
    enum: ['pending', 'reject', 'interview'],
    default: 'pending'
  },
  worktype: {
    type: String,
    enum: ['full-time', 'part-time', 'internship', 'contaract'],
    default: 'full-time'
  },
  education: {
    type: String,
    require: true,
  },
  workLocation: {
    type: String,
    require: true,
    default: 'Indore'
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
},
{timestamps:true,}
);

const allJobsSchema = new mongoose.model("Alljobs", jobsSchema);

module.exports = allJobsSchema;
