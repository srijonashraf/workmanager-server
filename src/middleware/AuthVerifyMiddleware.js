const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

module.exports = (req, res, next) => {
  let token = req.headers.token || req.cookies.token;
  jwt.verify(token, process.env.SecretKey, function (err, decoded) {
    if (err) {
      res.status(401).json({ status: "Unauthorized" });
    } else {
      let email = decoded["data"];
      req.headers.email = email; // It will auto-set the email into the header
      next();
    }
  });
};
