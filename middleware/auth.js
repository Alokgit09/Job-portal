const jwt = require("jsonwebtoken");
const userSchemaData = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const tokenNum = req.cookies.jwt;
    if (tokenNum) {
      const verifyToken = jwt.verify(tokenNum, process.env.JWT_SECRET_KEY);
      // console.log("verify>>>", verifyToken);
      console.log("newdatya", new Date().getTime());
      if (verifyToken.iat * 1000 > Date.now()) {
        const user = await userSchemaData.findOne({
          _id: verifyToken.id,
        });
        console.log("uniqueEmail>>>", user);
        req.user = user;
        return next();
      } else {
        return res.status(401).json({
          success: false,
          message: "Token is expired",
        });
      }
    } else {
      return res.status(401).json({
        success: false,
        message: "Unthorized access",
      });
    }
  } catch (err) {
    console.log("error Auth>>>", err);
    res.send("AuthTask Error>>", err);
  }
};

module.exports = auth;
