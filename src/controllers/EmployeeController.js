const CreateJWTToken = require("../helper/CreateJWTTokenHelper.js");
const EmployeeModel = require("../models/EmployeeModel");
const jwt = require("jsonwebtoken");
const OTPModel = require("../models/OTPModel");
const SendEmailUtility = require("../utility/SendEmailUtility");

//User Registration
exports.UserRegistration = async (req, res) => {
  let reqBody = req.body;
  try {
    const exisitngUser = await EmployeeModel.find({
      email: reqBody["email"],
    }).count();
    if (exisitngUser === 1) {
      res.status(200).json({ status: "fail", data: "User Already Exists" });
    } else {
      let result = await EmployeeModel.create(reqBody);
      res.status(200).json({ status: "success", data: result });
    }
  } catch (e) {
    res.status(200).json({ status: "fail", data: e });
  }
};

//User Login Manual
exports.UserLogin = async (req, res) => {
  try {
    let reqBody = req.body;
    let result = await EmployeeModel.find(reqBody).count();
    if (result === 1) {
      // Create JWT Token
      const token = CreateJWTToken(reqBody);

      //!Whenever its not mention the sameSite:None it automatically set to cookies but Cookies.get() response null in both localhost and deploy, but if its not mentioned (default Lax) it does not set cookie in deploy but work totally fine in localhost

      res.cookie("token", token, {
        httpOnly: false,
        secure: false, // Ensures that the cookie is only sent over HTTPS
        sameSite: "None", // Allows the cookie to be sent in cross-origin requests; Commenting this is working on localhost
        maxAge: 24 * 60 * 60 * 1000,
      });

      res
        .status(200)
        .json({ status: "success", email: reqBody["email"], token: token });
    } else {
      res.status(200).json({ status: "fail", data: "No User Found" });
    }
  } catch (e) {
    res.status(200).json({ status: "error", data: e });
  }
};

//Google Sign In
exports.UserGoogleSignIn = async (req, res) => {
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

        // Generate JWT token
        const token = CreateJWTToken(reqBody);

        // Set the token as a cookie in the response
        res.cookie("token", token, {
          httpOnly: true,
          secure: true, // Ensures that the cookie is only sent over HTTPS
          sameSite: "None", // Allows the cookie to be sent in cross-origin requests
          maxAge: 24 * 60 * 60 * 1000,
        });

        res
          .status(200)
          .json({ status: "success", email: reqBody["email"], token: token });
      } else {
        // Existing user has firstName and lastName, create token
        const token = CreateJWTToken(reqBody);

        // Set the token as a cookie in the response
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 24 * 60 * 60 * 1000,
        });

        res
          .status(200)
          .json({ status: "success", email: reqBody["email"], token: token });
      }
    } else {
      // User doesn't exist, create a new user in the database with first and last names
      const newUser = await EmployeeModel.create({
        email: reqBody["email"],
        firstName: reqBody["firstName"],
        lastName: reqBody["lastName"],
      });

      // Generate JWT token
      const token = CreateJWTToken(reqBody);

      // Set the token as a cookie in the response
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res
        .status(200)
        .json({ status: "success", email: reqBody["email"], token: token });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "fail", error: "Failed to sign in with Google" });
  }
};

//User Logout

exports.UserLogout = async (req, res) => {
  try {
    let cookieOption = {
      expires: new Date(Date.now() - 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.cookie("token", "", cookieOption);
    return res
      .status(200)
      .json({ status: "success", message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "fail", error: "Failed to logout" });
  }
};

//User Profile
exports.ProfileDetails = async (req, res) => {
  try {
    let email = req.headers["email"];
    let result = await EmployeeModel.find({ email: email });
    res.status(200).json({ status: "success", data: result });
  } catch (e) {
    res.status(200).json({ status: "fail", data: e });
  }
};

//User Profile Update
exports.ProfileUpdate = async (req, res) => {
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

exports.ProfileDelete = async (req, res) => {
  try {
    const email = req.headers["email"];
    const result = await EmployeeModel.deleteOne({ email: email });
    if (result.deletedCount === 1) {
      res
        .status(200)
        .json({ status: "success", data: "Profile deleted successfully" });
    } else {
      res.status(200).json({ status: "fail", data: "Profile not found" });
    }
  } catch (e) {
    res.status(500).json({ status: "fail", data: e });
  }
};

//User Profile Verification (Email)
exports.ProfileVerification = async (req, res) => {
  try {
    let email = req.params.email;
    let data = await EmployeeModel.updateOne(
      { email: email },
      { verified: true }
    );
    res.status(200).json({ status: "success", data: "Email Verified" });
  } catch (e) {
    res.status(200).json({
      status: "fail",
      data: e,
    });
  }
};

//Recover Password Step-1
exports.RecoverVerifyEmail = async (req, res) => {
  try {
    let email = req.params.email;
    let OTPCode = Math.floor(100000 + Math.random() * 900000);
    let EmailText = `Your verification code is ${OTPCode} which expires in 3 minutes`;
    let EmailSubject = "Work Manager verification";

    let result = await EmployeeModel.find({ email: email }).count();
    if (result === 1) {
      await SendEmailUtility(email, EmailText, EmailSubject);

      // Set a timeout for 3 minutes to expire the verification code
      setTimeout(async () => {
        await OTPModel.deleteOne({ email: email, otp: OTPCode });
      }, 3 * 60 * 1000); // 3 minutes in milliseconds

      await OTPModel.create({ email: email, otp: OTPCode });
      res.status(200).json({
        status: "success",
        data: "6 digit verification code sent to your email",
      });
    } else {
      res.status(200).json({ status: "fail", data: "No User Found" });
    }
  } catch (e) {
    res.status(500).json({ status: "error", data: e });
  }
};

//Recover Password Step-2
exports.RecoverVerifyOTP = async (req, res) => {
  let email = req.params.email;
  let OTPCode = req.params.otp;
  let status = 0;
  let statusUpdate = 1;
  try {
    let result = await OTPModel.find({
      email: email,
      otp: OTPCode,
      status: status,
    }).count();
    if (result === 1) {
      const data = await OTPModel.updateOne(
        { email: email, otp: OTPCode, status: status },
        { status: statusUpdate }
      );
      res.status(200).json({ status: "success", data: "OTP Verified" });
    } else {
      res.status(200).json({ status: "fail", data: "Invalid Verification" });
    }
  } catch (e) {
    res.status(500).json({ status: "error", data: e });
  }
};

//Create New Password
exports.RecoverResetPass = async (req, res) => {
  let email = req.body["email"];
  let OTPCode = req.body["OTP"];
  let NewPassword = req.body["password"];
  let statusUpdate = 1;
  try {
    let result = await OTPModel.find({
      email: email,
      otp: OTPCode,
      status: statusUpdate,
    }).count();
    if (result === 1) {
      const data = await EmployeeModel.updateOne(
        { email: email },
        { password: NewPassword }
      );
      res.status(200).json({ status: "success", data: "Password Updated" });
    } else {
      res.status(200).json({ status: "fail", data: "Password not updated" });
    }
  } catch (e) {
    res.status(500).json({ status: "error", data: e });
  }
};
