const { User } = require("./../models");
const asyncHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendMail = require("../utils/sendMail");

const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, numberPhone } = req.body;

  if (!firstName || !lastName || !email || !password || !numberPhone)
    return res.status(400).json({
      status: false,
      mes: "Missing inputs",
    });

  const user = await User.findOne({ email });

  if (user) {
    throw new Error("Account already exists");
  } else {
    const newUser = await User.create(req.body);
    return res.status(201).json({
      status: newUser ? true : false,
      mes: newUser
        ? "New account registration successful"
        : "New account registration failed",
    });
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      mes: "Missing input",
    });
  }

  const userData = await User.findOne({ email }).select(
    "-createdAt -updatedAt -__v -passwordChangeAt -numberPhone -cart -address -wishlist"
  );

  if (userData && (await userData.isCorrectPassword(password))) {
    // do findOne của mongo là plain object của mongo nên phải convert sang object thuần
    const { password, role, refreshToken, ...response } = userData.toObject();

    // create accessToken
    const accessToken = generateAccessToken(response._id, role);

    // // create refreshToken
    const newRefreshToken = generateRefreshToken(response._id);

    // // save refreshToken to database

    // // new : true sẽ trả về data sau khi update mới, false sẽ trả về data trước khi update

    await User.findByIdAndUpdate(
      response._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );

    // httpOnly chỉ cho phép các đầu http mới truy cập được vào

    // save refreshToken to cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      data: response,
      accessToken: accessToken,
    });
  } else {
    throw new Error("Login information is incorrect. Please check again");
  }
});

const getCurrent = asyncHandler(async (req, res) => {
  const { uid } = req.user;

  const currentUser = await User.findById({ _id: uid }).select(
    "-updatedAt -refreshToken -passwordChangeAt -wishlist  -cart -password -__v"
  );

  return res.status(200).json({
    status: true,
    data: !!currentUser ? currentUser : "User can't found",
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie && !cookie.refreshToken) {
    throw new Error("There is no refresh token in the cookies");
  }

  const result = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);

  const response = await User.findOne({
    _id: result.uid,
    refreshToken: cookie.refreshToken,
  });

  if (!response) {
    return res.status(200).json({
      success: false,
      mes: "Invalid refreshToken",
    });
  }

  const newRefreshToken = generateRefreshToken(response._id);
  await User.findOneAndUpdate(
    { _id: response._id },
    { refreshToken: newRefreshToken },
    { new: true }
  );

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    accessToken: generateAccessToken(response._id, response.role),
  });
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie && !cookie.refreshToken) {
    throw new Error("There is no refresh token in the cookies");
  }

  // Xóa refreshToken ở db
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );

  // Xóa refreshToken ở cookie

  res.clearCookie("refreshToken", { httpOnly: true, secure: true });

  return res.status(200).json({
    success: true,
    mes: "Logout successfully",
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) throw new Error("Missing email");
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  const resetToken = user.createPasswordChangedToken();
  await user.save();

  const html = `Vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn. Lưu ý: Link này sẽ tự động hết hạn sau 5 phút. Không gửi link này cho bất kỳ ai để bảo đảm tính bảo mật. <a href="${process.env.URL_CLIENT}/reset-password/${resetToken}">click here</a>`;

  data = {
    email,
    html,
  };

  const result = await sendMail(data);
  return res.status(200).json({
    success: true,
    result,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;
  console.log("password>>>>", password);
  console.log("token>>>>", token);
  if (!password || !token) throw new Error("Missing input");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpire: { $gt: Date.now() },
  });

  if (!user) throw new Error("Invalid reset token");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordChangeAt = Date.now();
  user.passwordResetExpire = undefined;
  await user.save();
  return res.status(200).json({
    success: user ? true : false,
    mes: user
      ? "Password has been changed successfully"
      : "Change of password failed",
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select(
    "-updatedAt -refreshToken -passwordChangeAt -wishlist -cart -password -__v"
  );
  if (!users) throw new Error("List users can't found");
  return res.status(200).json({
    success: users ? true : false,
    data: users,
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { uid } = req.user;
  if (!uid || Object.keys(req.body).length === 0)
    throw new Error("Missing input");

  const userUpdated = await User.findByIdAndUpdate({ _id: uid }, req.body, {
    new: true,
  }).select("-refreshToken -passwordChangeAt -wishlist -cart -password -__v");

  return res.status(200).json({
    success: userUpdated ? true : false,
    mes: userUpdated ? "User update successful" : "Update user failed",
  });
});
const deleteUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing input");
  if (id === req.user.uid)
    throw new Error("Can't remove myself from the system");
  const response = await User.findByIdAndDelete({ _id: id });
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "User has been deleted successfully" : "Delete user failed",
  });
});

const updateUserByAmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id || Object.keys(req.body).length === 0)
    throw new Error("Missing input");
  const userUpdated = await User.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
  }).select("-refreshToken -passwordChangeAt -wishlist -cart -password -__v");

  return res.status(200).json({
    success: userUpdated ? true : false,
    mes: userUpdated ? "User update successful" : "Update user failed",
  });
});

module.exports = {
  register,
  login,
  getCurrent,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getAllUsers,
  deleteUserById,
  updateUser,
  updateUserByAmin,
};
