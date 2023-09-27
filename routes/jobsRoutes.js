const express = require("express");
const userAauth = require("../middleware/auth");
const {
  createjobSchema,
  getallJobsSchema,
  updateJobsSchema,
  deleteJobsSchema,
  jobstatsFilter,
} = require("../controllers/jobControllers");

const router = express.Router();

/// create jobs || POST //////

router.post("/create-job", userAauth, createjobSchema);

/// Get jobs || GEt //////

router.get("/get-job", userAauth, getallJobsSchema);

///// Update Jobs || Patch ////

router.patch("/update-job/:id", userAauth, updateJobsSchema);

////// Delete Job || DELETE   ////////

router.delete("/delete-job/:id", userAauth, deleteJobsSchema);


////// Job Stats Filter || GET   ////////

router.get("/job-stats/", userAauth, jobstatsFilter);

module.exports = router;
