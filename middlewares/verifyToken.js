const JWT = require("jsonwebtoken");
const appError = require("../utils/appError");
const HTTPMassage = require("../utils/httpMassage");
module.exports = (req, res, next) => {
  const authtoken = req.header("auth-token") || req.header("Auth-token");
  if (!authtoken) {
    const err = appError.create(
      "token is required",
      401,
      HTTPMassage.FIAL,
      null
    );
    return next(err);
  }

  try {
    const token = authtoken.split(" ")[1];
    // return console.log(token);
    const pyload = JWT.verify(token, process.env.TOKEN_SECRET);
    req.pyload = pyload;
    next();
  } catch {
    const err = appError.create(
      "Invalid Token",
      401,
      HTTPMassage.ERROR,
      undefined
    );
    return next(err);
  }
};
