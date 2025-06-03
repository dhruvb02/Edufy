require("dotenv").config();
const express = require("express")
const router = express.Router()
const {isInstructor} =require("../middleware/auth");
const { auth } = require("../middleware/auth")
const{resetPasswordToken} = require("../controllers/ResetPassword");
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  instructorDashboard,
} = require("../controllers/Profile");

const { resetPassword } = require("../controllers/ResetPassword");

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account
router.delete("/deleteProfile",auth, deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)

//update password
router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);

// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)



router.get("/instructorDashboard",auth,isInstructor,instructorDashboard);


module.exports = router