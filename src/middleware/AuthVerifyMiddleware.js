const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = req.headers.token || req.cookies.token;
  jwt.verify(token, "ABC-123", function (err, decoded) {
    if (err) {
      res.status(401).json({ status: "unauthorized" });
    } else {
      let email = decoded["data"];
      req.headers.email = email; // It will auto-set the email into the header
      next();
    }
  });
};
