const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const CreateJWTToken = (reqBody) => {
  let Payload = {
    // exp: Math.floor(Date.now() / 1000) + 60, // 1 min expiration
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 1 day expiration
    data: reqBody["email"],
  };
  return jwt.sign(Payload, process.env.SecretKey);
};

module.exports = CreateJWTToken;
