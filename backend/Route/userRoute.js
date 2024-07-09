const express=require("express");
const { registerUser, loginUser, logOut,  } = require("../Controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../utils/auth");
const router=express.Router();
router.route("/user/register").post(registerUser);
router.route("/user/login").post(loginUser);
router.route("/user/logout").get(logOut);
module.exports=router;