const jobsSchema = require("../models/jobs");
const mongoose = require("mongoose");
const moment = require("moment");

///////  Create Job ////////

const createjobSchema = async (req, res, next) => {
  try {
    req.body.owner = req.user.id;
    const { company, email, education, job_title, experience, selery } =
      req.body;
    const jobsInfo = new jobsSchema(req.body);
    const job = await jobsInfo.save();
    console.log("jobs>>>", job);
    res.status(201).json({ job });
  } catch (err) {
    res.send(err);
    console.log("job error >>>>", err);
  }
};

/////// Get All Jobs ///////////

const getallJobsSchema = async (req, res) => {
  try {
    const {status, worktype } = req.query
 let queryObJect = {
  owner: req.user.id
 }
 if(status && status !== 'all'){
  queryObJect.status = status;
 }

 if(worktype && worktype !== 'all'){
  queryObJect.worktype = worktype;
 }

 let queryResult = jobsSchema.find(queryObJect);

const page = Number(req.query.page) || 2
const limit = Number(req.query.limit) || 5
const skip = (page - 1) * limit
queryResult = queryResult.skip(skip).limit(limit)
const totalJobs = await jobsSchema.countDocuments(queryResult);
console.log("testing>>", totalJobs);
const numofPage = Math.ceil(totalJobs / limit)
 const jobs = await queryResult;
    // const jobs = await jobsSchema.find({ owner: req.user.id });
    console.log("Jobs>>>", jobs);
    res.status(200).json({ totalJobs, jobs, numofPage });
  } catch (err) {
    res.send({ message: err });
    console.log("getall>>>", err);
  }
};

/////// Update Jobs ///////////

const updateJobsSchema = async (req, res) => {
  try {
    const { id } = req.params;
    const { company, job_title, experience, selery } = req.body;
    if (company || job_title || experience || selery) {
      const job = await jobsSchema.findOne({ _id: id });
      console.log("Update-Job>>>>", job);
      if (job) {
        const updateJob = await jobsSchema.findOneAndUpdate(
          { _id: id },
          req.body,
          {
            new: true,
          }
        );
        res.status(201).json({ updateJob });
      } else {
        res.send({ message: `No found with this ID ${id}` });
        console.log(`No found with this ID ${id}`);
      }
    } else {
      res.send({ message: "Please Provide All Fields" });
      console.log("Please Provide All Fields");
    }
  } catch (err) {
    res.send({ message: err });
  }
};

/////// Delete Job ///////////

const deleteJobsSchema = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await jobsSchema.findOne({ _id: id });
    if (job) {
      await job.deleteOne();
      res.status(200).json({ message: "Successfuly Job Deleted" });
    } else {
      res.send({ message: `No found with this ID ${id}` });
      console.log(`No found with this ID ${id}`);
    }
  } catch (err) {
    res.send(err);
  }
};

/////// Job Stats & Filters ///////////

const jobstatsFilter = async (req, res) => {
  try {
    const stats = await jobsSchema.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    //// Default Stats ////

    const defaultStats = {
      pending: stats.pending || 0,
      reject: stats.reject || 0,
      interview: stats.interview || 0,
    };
   
    let monthlyApplication = await jobsSchema.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $group: {
          _id: {
            year:{$year: "$createdAt"},
            month:{$month: "$createdAt"}
          },
          count: { 
            $sum: 1 
          },
        },
      },
    ]);
    monthlyApplication = monthlyApplication.map(item => {
      const {_id:{year,month},count} = item
      const data = moment().month(month - 1).year(year).format("MMM - Y");
      return { data, count };
    })
    .reverse();
    res.status(200).json({ total: stats.length, defaultStats, monthlyApplication });
  } catch (err) {
    res.send(err);
  }
};

module.exports = {
  createjobSchema,
  getallJobsSchema,
  updateJobsSchema,
  deleteJobsSchema,
  jobstatsFilter,
};
