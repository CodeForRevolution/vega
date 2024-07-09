//creating the token and saving this into cookie
const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  const option = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
console.log('your user in send token',user)
  res.status(statusCode).cookie("token", token, option).json({
    success: true,
    message: "user Login successfully",
    data: {
        _id: user._id,
        role:user.role,
        name: user.name,
        email: user.email,
      token,
    },
  });
};

module.exports = sendToken;
