const mongoose = require('mongoose');
const DataSchema = mongoose.Schema({
    email: { type: String, unique: true, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    rollNo: { type: String, required: true },
    class: { type: String, required: true },
}, { timestamps: true, versionKey: false });

const StudentsModel = mongoose.model('students', DataSchema);
module.exports = StudentsModel;
