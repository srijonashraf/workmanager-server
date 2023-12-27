const mongoose = require("mongoose");

const EmployeeSchema = mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    img: { type: String, default: "" },
    gender: { type: String, default: "" },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    mobile: { type: String, default: "" },
    password: { type: String, default: "" },
    address: { type: String, default: "" },
    position: { type: String, default: "" },
    department: { type: String, default: "" },
  },
  { timestamps: true, versionKey: false }
);

const EmployeeModel = mongoose.model("employees", EmployeeSchema);

module.exports = EmployeeModel;
