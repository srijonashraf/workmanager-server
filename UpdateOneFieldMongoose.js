use ('WorkManager')
db.employees.updateMany({}, { $unset: { "employeeId": "" } });

db.employees.updateMany({}, { $set: { img: "", gender: "", verified: false } });




