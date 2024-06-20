const mongoose = require("mongoose");
const WorksModel = require("../models/WorksModel.js");
const works = require("../data/works.js");

const importData = async (userEmail) => {
  try {
    await WorksModel.deleteMany({ createdBy: userEmail });

    const createWorks = works.map((work) => {
      return { ...work, createdBy: userEmail };
    });
    console.log(createWorks);

    await WorksModel.insertMany(createWorks);
  } catch (error) {
    console.log(error);
  }
};

module.exports = importData;
