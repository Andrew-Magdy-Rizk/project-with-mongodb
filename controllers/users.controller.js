const bcrypt = require("bcryptjs");
const meddlewareWrapper = require("../middlewares/asyncWrapper");
const users = require("../modules/users.schema");
const HTTPMassage = require("../utils/httpMassage");
const appError = require("../utils/appError");
const generateJWT = require("../utils/generateJWT");

// Get all users
const getAllUsers = meddlewareWrapper(async (req, res) => {
  const allUsers = await users.find({}, { __v: false, password: false });
  res.json({ status: HTTPMassage.SUCCESS, data: { users: allUsers } });
});

// Register user
const registerUser = meddlewareWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;
  const oldUser = await users.findOne({ email });
  if (oldUser) {
    const err = appError.create(
      "the email already exist",
      400,
      HTTPMassage.FIAL,
      null
    );
    return next(err);
  }
  const hashingPassword = bcrypt.hashSync(password, 8);

  const newUser = new users({
    firstName,
    lastName,
    email,
    password: hashingPassword,
    role,
    avatar: req.file.filename,
  });

  const token = await generateJWT({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });
  newUser.token = token;
  await newUser.save();
  res.json({ status: HTTPMassage.SUCCESS, data: newUser });
});

// Login
const loginUser = meddlewareWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const err = appError.create(
      "please provide email and password",
      400,
      HTTPMassage.ERROR,
      undefined
    );
    return next(err);
  }
  const findUser = await users.findOne({ email });
  if (!findUser) {
    const err = appError.create("user not found", 404, HTTPMassage.FIAL, null);
    return next(err);
  }
  const matchPasword = await bcrypt.compare(password, findUser.password);
  if (!matchPasword) {
    const err = appError.create(
      "password not match",
      400,
      HTTPMassage.FIAL,
      null
    );
    return next(err);
  } else {
    const token = await generateJWT({
      email: findUser.email,
      id: findUser._id,
      role: findUser.role,
    });
    res.json({ status: HTTPMassage.SUCCESS, data: { token } });
  }
});

module.exports = {
  getAllUsers,
  registerUser,
  loginUser,
};
