const express =require('express');
const EmployeeController=require("../controllers/EmployeeController");
const WorksController=require("../controllers/WorksController");
const AuthVerifyMiddleware=require("../middleware/AuthVerifyMiddleware");


const router =express.Router();

// Employee
router.post("/registration",EmployeeController.registration);
router.post("/login",EmployeeController.login);
router.post("/loginwithgoogle",EmployeeController.googleSignIn);

router.post("/profileUpdate",AuthVerifyMiddleware,EmployeeController.profileUpdate);
router.get("/profileDetails",AuthVerifyMiddleware,EmployeeController.profileDetails);
router.get("/profileDelete/:email",EmployeeController.profileDelete);
router.get("/RecoverVerifyEmail/:email",EmployeeController.RecoverVerifyEmail);
router.get("/RecoverVerifyOTP/:email/:otp",EmployeeController.RecoverVerifyOTP);
router.post("/RecoverResetPass",EmployeeController.RecoverResetPass);
router.get("/verified/:email",EmployeeController.profileVerification);


// Work
router.post("/createWork",AuthVerifyMiddleware,WorksController.createWork);
router.get("/updateWorkStatus/:id/:status",AuthVerifyMiddleware,WorksController.updateWorkStatus);
router.post("/updateWork/:id",AuthVerifyMiddleware,WorksController.updateWork);
router.get("/listWorkByStatus/:status",AuthVerifyMiddleware,WorksController.listWorkByStatus);
router.get("/workStatusCount",AuthVerifyMiddleware,WorksController.workStatusCount);
router.get("/deleteWork/:id",AuthVerifyMiddleware,WorksController.deleteWork);
router.get("/allWork",AuthVerifyMiddleware,WorksController.allWork);
router.get("/search",AuthVerifyMiddleware,WorksController.search)


module.exports=router;