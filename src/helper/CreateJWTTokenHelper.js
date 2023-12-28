const jwt = require("jsonwebtoken");

const CreateJWTToken = (reqBody) => {
  let Payload = {
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 1 day expiration
    data: reqBody["email"],
  };
  return jwt.sign(Payload, "ABC-123");
};

module.exports = CreateJWTToken;
