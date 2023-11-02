const WorksModel = require("../models/WorksModel");

exports.createWork = async (req, res) => {
  try {
    const reqBody = req.body;
    const createdBy = req.headers["email"];

    if (!createdBy) {
      return res
        .status(400)
        .json({ status: "fail", data: "Missing 'email' header." });
    }

    reqBody.createdBy = createdBy;

    const existingWork = await WorksModel.findOne({
      title: reqBody.title,
      classNote: reqBody.classNote,
      description: reqBody.description,
      status: reqBody.status,
    });

    if (existingWork && existingWork.createdBy === req.headers["email"]) {
      // The work already exists and is created by the same user, so return an error message
      return res.status(409).json({
        status: "fail",
        data: "You've already posted this work.",
        email: reqBody.createdBy,
      });
    }

    // The work does not exist, or it exists but was not created by the same user, so create it in the database
    let result = await WorksModel.create(reqBody);
    res.status(200).json({ status: "success", data: result });
  } catch (e) {
    res.status(500).json({ status: "fail", data: e });
  }
};

exports.deleteWork = async (req, res) => {
  try {
    let id = req.params.id;
    let Query = { _id: id };
    let result = await WorksModel.deleteOne(Query);
    res.status(200).json({ status: "success", data: result });
  } catch (e) {
    res.status(200).json({ status: "fail", data: e });
  }
};

exports.updateWorkStatus = async (req, res) => {
  try {
    let id = req.params.id; //extracting id from url
    let status = req.params.status; //extracting status from url
    let Query = { _id: id };
    let reqBody = { status: status };

    let result = await WorksModel.updateOne(Query, reqBody);

    res.status(200).json({ status: "success", data: result });
  } catch (e) {
    res.status(200).json({ status: "fail", data: e });
  }
};

exports.listWorkByStatus = async (req, res) => {
  try {
    let status = req.params.status;
    let email = req.headers["email"];

    console.log("Email:", email);
    console.log("Status:", status);

    let result = await WorksModel.find({ email: email, status: status });

    if (result.length === 0) {
      return res.status(200).json({
        status: "success",
        data: "No work assignments found.",
        email: req.headers["email"],
        reqStatus: req.params.status,
      });
    }
    console.log(result.length);

    res.status(200).json({ status: "success", data: result });
  } catch (e) {
    console.log("Error:", e);
    res.status(200).json({ status: "fail", data: e });
  }
};

exports.workStatusCount = async (req, res) => {
  try {
    let email = req.headers["email"];
    let result = await WorksModel.aggregate([
      { $match: { createdBy: email } },
      { $group: { _id: "$status", sum: { $count: {} } } },
    ]);
    res.status(200).json({ status: "success", data: result });
  } catch (e) {
    res.status(200).json({ status: "fail", data: e });
  }
};

exports.deleteWork = async (req, res) => {
  try {
    let id = req.params.id;
    let Query = { _id: id };
    let result = await WorksModel.deleteOne(Query);
    res.status(200).json({ status: "success", data: result });
  } catch (e) {
    res.status(200).json({ status: "fail", data: e });
  }
};
