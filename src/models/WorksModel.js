const mongoose = require("mongoose");
const WorkSchema = mongoose.Schema(
  {
    workTitle: { type: String, required: true },
    taskDetails: { type: String, required: true },
    workDescription: { type: String, required: true },
    workStatus: { type: String, required: true },
    createdBy: String,
  },
  { timestamps: true, versionKey: false }
);
const WorksModel = mongoose.model("works", WorkSchema);
module.exports = WorksModel;
