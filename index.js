require("./db/database");
const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
require("express-async-errors");
const auth = require("./middleware/auth");
const userSchemaData = require("./models/user");
const cookieParser = require("cookie-parser");
const jobs = require("./models/jobs");
const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobsRoutes");

const app = express();
app.use(cookieParser());

const port = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h2>This is a front page<h2>");
});

/////////// Raoutes ///////////

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/job", jobRoutes);

/////////// Create User ///////////

// app.post("/singup", async (req, res) => {
//   // const { name, email, phone, password } = req.body;
//   const email = req.body.email;
//   const ragisterInfo = new userSchemaData(req.body);
//   const uniqueEmail = await userSchemaData.findOne({ email: email });
//   try {
//     console.log("uniqueEmail>>>", uniqueEmail);
//     if (!uniqueEmail) {
//       await ragisterInfo.generateAuthToken();
//       res.status(201).json(ragisterInfo);
//       console.log("ragisterInfo", ragisterInfo);
//     } else {
//       res.status(500).json({ message: "This E-mail Already Used" });
//     }
//   } catch (err) {
//     console.log("error>>>", err);
//     res.status(500).json({ message: "somthing went wrong" });
//   }
// });

/////////// Login User ///////////

// app.post("/login", async (req, res) => {
//   const email = req.body.email;
//   const password = req.body.password;
//   console.log("matchEmail>>>>", email);
//   try {
//     const logData = await userSchemaData.findOne({ email: email });
//     console.log("matchEmail>>>>", logData);
//     const isMatch = await bcrypt.compare(password, logData.password);
//     const token = await logData.generateAuthToken();
//     let multiple = { email: email, cookieKey: token };
//     console.log("multiple", multiple);
//     res.cookie("jwt", token, {
//       expires: new Date(Date.now() + 600000),
//       httpOnly: false,
//       secure: false,
//     });
//     console.log("Cookie>>>>", multiple);
//     if (isMatch) {
//       res.status(201).json(multiple);
//     } else {
//       res.send({ message: "Invalid Password" });
//     }
//   } catch (err) {
//     console.log("login Error>>>>", err);
//     res.send({ message: "Invalid login Details" });
//   }
// });

/////// Create Jobs /////////

app.post("/createjobs", auth, async (req, res) => {
  req.body.owner = req.user._id;
  const jobsData = new jobs(req.body);
  // console.log("ownerID>>>", req.body.owner);
  // console.log("userID>>>", req.user.id);
  try {
    const allJobs = await jobsData.save();
    res.status(201).json(allJobs);
  } catch (err) {
    res.send(err);
    console.log("error>>>>", err);
  }
});

////////// Search job ////////////////

app.get("/search/:key", auth, async (req, res) => {
  try {
    // const jobData = await jobs.find();
    let data = await jobs.find({
      $or: [
        { job_title: { $regex: req.params.key } },
        { city: { $regex: req.params.key } },
      ],
    });
    console.log("jobsGet>>>>", data);
    res.status(201).json(data);
  } catch (err) {
    console.log("filter>>>", err);
    res.send("filter err>>>>", err);
  }
});

app.get("/getall", auth, async (req, res) => {
  try {
    let data = await jobs.find();
    console.log("jobsGet>>>>", data);
    res.status(201).json(data);
  } catch (err) {
    console.log("filter>>>", err);
    res.send("filter err>>>>", err);
  }
});

app.listen(port, () => {
  console.log(`connettion is setup at ${port}`);
});
