const mongoose = require("mongoose");
const EmployeeSchema = mongoose.Schema(
  {
    employeeId: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    position: { type: String, required: true },
    department: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);
const EmployeeModel = mongoose.model("employees", EmployeeSchema);
module.exports = EmployeeModel;
