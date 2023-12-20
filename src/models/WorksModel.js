const mongoose = require("mongoose");
const WorkSchema = mongoose.Schema(
  {
    workTitle: { type: String },
    workDescription: { type: String },
    workStatus: { type: String, required: true },
    createdBy: String,
  },
  { timestamps: true, versionKey: false }
);

const WorksModel = mongoose.model("works", WorkSchema);
module.exports = WorksModel;
