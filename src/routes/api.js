const express =require('express');
const EmployeeController=require("../controllers/EmployeeController");
const WorksController=require("../controllers/WorksController");
const AuthVerifyMiddleware=require("../middleware/AuthVerifyMiddleware");


const router =express.Router();

// Employee
router.post("/UserRegistration",EmployeeController.UserRegistration);
router.post("/UserLogin",EmployeeController.UserLogin);
router.post("/UserGoogleSignIn",EmployeeController.UserGoogleSignIn);
router.get("/UserLogout",EmployeeController.UserLogout);

router.get("/ProfileDetails",AuthVerifyMiddleware,EmployeeController.ProfileDetails);
router.post("/ProfileUpdate",AuthVerifyMiddleware,EmployeeController.ProfileUpdate);
router.get("/ProfileDelete",AuthVerifyMiddleware,EmployeeController.ProfileDelete);
router.get("/ProfileVerification/:email",EmployeeController.ProfileVerification);
router.get("/RecoverVerifyEmail/:email",EmployeeController.RecoverVerifyEmail);
router.get("/RecoverVerifyOTP/:email/:otp",EmployeeController.RecoverVerifyOTP);
router.post("/RecoverResetPass",EmployeeController.RecoverResetPass);


// Work
router.post("/WorkCreate",AuthVerifyMiddleware,WorksController.WorkCreate);
router.get("/WorkAllList",AuthVerifyMiddleware,WorksController.WorkAllList);
router.get("/WorkListByStatus/:status",AuthVerifyMiddleware,WorksController.WorkListByStatus);
router.get("/WorkStatusCountIndividual",AuthVerifyMiddleware,WorksController.WorkStatusCountIndividual);
router.get("/WorkStatusUpdate/:id/:status",AuthVerifyMiddleware,WorksController.WorkStatusUpdate);
router.post("/WorkUpdate/:id",AuthVerifyMiddleware,WorksController.WorkUpdate);
router.get("/WorkDelete/:id",AuthVerifyMiddleware,WorksController.WorkDelete);
// router.get("/WorkSearch",AuthVerifyMiddleware,WorksController.WorkSearch)


module.exports=router;