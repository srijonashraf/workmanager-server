const EmployeeModel = require("../models/EmployeeModel");
const jwt = require("jsonwebtoken");
const OTPModel = require("../models/OTPModel");
const SendEmailUtility = require("../utility/SendEmailUtility");

//User Registration
exports.registration = async (req, res) => {
  let reqBody = req.body;
  try {
    let result = await EmployeeModel.create(reqBody);
    res.status(200).json({ status: "success", data: result });
  } catch (e) {
    res.status(200).json({ status: "fail", data: e });
  }
};

//User Login Manual
exports.login = async (req, res) => {
  try {
    let reqBody = req.body;
    let result = await EmployeeModel.find(reqBody).count();
    if (result === 1) {
      // Create Token
      let Payload = {
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        data: reqBody["email"],
      };
      let token = jwt.sign(Payload, "ABC-123");
      res.status(200).json({ status: "success", token: token });
    } else {
      // Login fail
      res.status(200).json({ status: "fail", data: "No User Found" });
    }
  } catch (e) {
    res.status(200).json({ status: "fail", data: e });
  }
};


//Google Sign In
exports.googleSignIn = async (req, res) => {
  const reqBody = req.body;

  try {
    // Find the existing user by email
    const existingUser = await EmployeeModel.findOne({
      email: reqBody["email"],
    });

    if (existingUser) {
      // Update the existing user only if the firstName or lastName is empty
      if (!existingUser.firstName || !existingUser.lastName) {
        const updatedUser = await EmployeeModel.findOneAndUpdate(
          {
            email: reqBody["email"],
            $or: [
              { firstName: { $exists: false } },
              { lastName: { $exists: false } },
            ],
          },
          {
            $set: {
              firstName: existingUser.firstName || reqBody["firstName"],
              lastName: existingUser.lastName || reqBody["lastName"],
            },
          },
          { new: true }
        );

        // Generate JWT token and send it back
        const payload = {
          exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
          data: reqBody["email"],
        };
        const token = jwt.sign(payload, "ABC-123");
        res.status(200).json({ status: "success", token: token });
      } else {
        // Existing user has firstName and lastName, create token
        const payload = {
          exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
          data: reqBody["email"],
        };
        const token = jwt.sign(payload, "ABC-123");
        res.status(200).json({ status: "success", token: token });
      }
    } else {
      // User doesn't exist, create a new user in the database with first and last names
      const newUser = await EmployeeModel.create({
        email: reqBody["email"],
        firstName: reqBody["firstName"],
        lastName: reqBody["lastName"],
        // Set other default values or prompt the user for additional information
      });

      // Generate JWT token and send it back
      const payload = {
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        data: reqBody["email"],
      };
      const token = jwt.sign(payload, "ABC-123");
      res.status(200).json({ status: "success", token: token });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "fail", error: "Failed to sign in with Google" });
  }
};

//User Profile
exports.profileDetails = async (req, res) => {
  try {
    let email = req.headers["email"];
    let result = await EmployeeModel.find({ email: email });
    res.status(200).json({ status: "success", data: result });
  } catch (e) {
    res.status(200).json({ status: "fail", data: e });
  }
};

//User Profile Update
exports.profileUpdate = async (req, res) => {
  try {
    let email = req.headers["email"];
    let reqBody = req.body;
    let result = await EmployeeModel.updateOne({ email: email }, reqBody);
    res.status(200).json({ status: "success", data: result });
  } catch (e) {
    res.status(200).json({ status: "fail", data: e });
  }
};

//User Profile Delete

exports.profileDelete = async (req, res) => {
  try {
    const email = req.headers["email"];
    const result = await EmployeeModel.deleteOne({ email: email });
    if (result.deletedCount === 1) {
      res
        .status(200)
        .json({ status: "success", message: "Profile deleted successfully" });
    } else {
      res.status(404).json({ status: "fail", message: "Profile not found" });
    }
  } catch (e) {
    res.status(500).json({ status: "fail", data: e });
  }
};

//Recover Password Step-1
exports.RecoverVerifyEmail = async (req, res) => {
  try {
    let email = req.params.email;
    let OTPCode = Math.floor(100000 + Math.random() * 900000);
    let EmailText = "Your Verification Code is =" + OTPCode;
    let EmailSubject = "Work Manager verification code";

    let result = await EmployeeModel.find({ email: email }).count();
    if (result === 1) {
      await SendEmailUtility(email, EmailText, EmailSubject);
      await OTPModel.create({ email: email, otp: OTPCode });
      res.status(200).json({
        status: "success",
        data: "6 Digit Verification Code has been send",
      });
    } else {
      res.status(200).json({ status: "fail", data: "No User Found" });
    }
  } catch (err) {
    res.status(500).json({ status: "error", data: err });
  }
};

//Recover Password Step-2
exports.RecoverVerifyOTP = async (req, res) => {
  let email = req.params.email;
  let OTPCode = req.params.otp;
  let status = 0;
  let statusUpdate = 1;

  let result = await OTPModel.find({
    email: email,
    otp: OTPCode,
    status: status,
  }).count();
  if (result === 1) {
    await OTPModel.updateOne(
      { email: email, otp: OTPCode, status: status },
      { status: statusUpdate }
    );
    res.status(200).json({ status: "success", data: "Verification Completed" });
  } else {
    res.status(200).json({ status: "fail", data: "Invalid Verification" });
  }
};

//Create New Password
exports.RecoverResetPass = async (req, res) => {
  let email = req.body["email"];
  let OTPCode = req.body["OTP"];
  let NewPass = req.body["password"];
  let statusUpdate = 1;

  let result = await OTPModel.find({
    email: email,
    otp: OTPCode,
    status: statusUpdate,
  }).count();
  if (result === 1) {
    let result = await EmployeeModel.updateOne(
      { email: email },
      { password: NewPass }
    );
    res.status(200).json({ status: "success", data: "Password Reset Success" });
  } else {
    res.status(200).json({ status: "fail", data: "Invalid Verification" });
  }
};


//Profile Verification (Email)
exports.profileVerification = async (req, res) => {
  try {
    let email = req.params.email;
    let result = await EmployeeModel.updateOne({ email: email }, { verified: true });
    res.status(200).json({ status: "success", data: result });
  } catch (e) {
    res.status(200).json({ status: "fail", data: e });
  }
}
