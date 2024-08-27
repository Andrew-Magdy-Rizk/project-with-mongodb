const express = require("express");
const usersController = require("../controllers/users.controller");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const multer = require("multer");
const appError = require("../utils/appError");
const HTTPMassage = require("../utils/httpMassage");
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    const fileName = `user-${Date.now()}.${ext}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const typeFile = file.mimetype.split("/")[0];
  if (typeFile !== "image") {
    return cb(
      appError.create("the file must be an image", 400, HTTPMassage.FIAL, null),
      false
    );
  }
  return cb(null, true);
};

const upload = multer({ storage: diskStorage, fileFilter: fileFilter });
router.route("/").get(verifyToken, usersController.getAllUsers);

router
  .route("/register")
  .post(upload.single("avatar"), usersController.registerUser);

router.route("/login").post(usersController.loginUser);

module.exports = router;
