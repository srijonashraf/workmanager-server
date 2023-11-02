const mongoose = require("mongoose");
const DataSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    classNote: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
    createdBy: String,
  },
  { timestamps: true, versionKey: false }
);
const WorksModel = mongoose.model("works", DataSchema);
module.exports = WorksModel;
