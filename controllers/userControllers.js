const userSchemaData = require("../models/user");

const updateUserControllers = async (req, res, next) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    next("Please Provide All Fields");
  }
  const user = await userSchemaData.findOne({ _id: req.user._id });
  user.name = name;
  user.email = email;
  user.phone = phone;

  console.log("name>>>>", user);
  await user.save();
  const token = user.generateAuthToken();
  res.status(200).json({
    user,
    token,
  });
};

module.exports = updateUserControllers;
