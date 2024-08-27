const appError = require("../utils/appError");
const HTTPMassage = require("../utils/httpMassage");
module.exports = (...roles) => {
  console.log(roles);
  return (req, res, next) => {
    if (!roles.includes(req.pyload.role)) {
      console.log(req.pyload);
      const err = appError.create("unAuthorized", 401, HTTPMassage.ERROR);
      return next(err);
    }
    next();
  };
};
