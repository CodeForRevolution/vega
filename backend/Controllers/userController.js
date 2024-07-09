const ErrorHandler = require("../utils/Errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../model/userModels");
const { Error } = require("mongoose");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { query } = require("express");
exports.registerUser = catchAsyncError(async (req, res, next) => {
  console.log("you hit the registered route");
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is sample",
      url: "profileUrl",
    },
  });
  sendToken(user, 200, res); //this is the substitue of above code ie converted into a peice of function to perform that task
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  console.log("you hit login", req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and pasword", 400));
  }
  const user = await User.findOne({ email: email }).select(
    "name email password"
  ); // we have unselected the password in schema

  if (!user) {
    return next(new ErrorHandler("Invalid Email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);
  console.log("ispassword match", isPasswordMatched);
  console.log("which user you have on server", user);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  sendToken(user, 200, res);
});

exports.logOut = catchAsyncError(async (req, res, next) => {
  console.log("you hit the logged out");
  res.cookie("token", null, {
    htttpOnly: true,
    secure: true,
  });
  res.status(200).json({
    success: true,
    message: "logout successfully",
  });
});
//forgot password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  console.log("you hit the paswword forgot api");
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found in Db", 404));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  const message = `your password reset Token is :- \n\n ${resetPasswordUrl} \n\n if you have not request this email then igonore it`;

  console.log("what message you are sending via Email ", message);

  try {
    await sendEmail({
      email: user.email,
      subject: `maja arra hai kya email send karke apne website se`,
      message: message,
    });
    console.log("checking the send is send or not");

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} send successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetpasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
  }

  const date = new Date();
  console.log("your current Date", date.toUTCString());
});

//Resetting the password from the linke which we havve send to user email

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  console.log("your got the resettoken", resetPasswordToken);
  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    //there we havenot implemented the token expire condition to also validate that
  });

  console.log("user you got", user, +"date now", Date.now());

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password token is invlaiid or has been expired",
        404
      )
    );
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("password does not match with confirm password ")
    );
  }

  user.password = req.body.password;
  user.resetpasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  console.log("your user is", user);
  await user.save();
  sendToken(user, 200, res);
});

exports.getUserDetail = catchAsyncError(async (req, res, next) => {
  console.log("checking user in req ", req.user);
  const user = await User.findById(req.user.id);
  console.log("which user i am sending", user);
  res.status(200).json({
    success: true,
    user,
  });
});

//update user password
exports.changePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    console.log("what you got in ismatchedpassword", isPasswordMatched);
    return next(new ErrorHandler("old password is incoorect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("comfirmPassword and password should be same")
    );
  }

  user.password = req.body.newPassword;
  user.save();

  res.status(200).json({
    success: true,
    user,
    message: "your password has been changed",
  });
});

//update the user profile

exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  //we will update the profie photo when we will add cloudnary
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidator: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "user is updated",
    user: user,
  });
});

exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find({});
  
  res.status(200).json({
    success: true,
    message: "you got all users",
    users,
  });
});

exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  console.log("your hit the getSingleuser ", req.params.id);
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User not found ", 400));
  }

  res.status(200).json({
    success: true,
    message: "user if founded",
    user: user,
  });
});

exports.updateUserRole = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: "admin",
  };


  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidator: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "user is updated",
    user: user,
  });
});

exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User not found ", 400));
  }
  await user.remove();
  res.status(200).json({
    success: true,
    message: "user is Deleted",
  });
});
