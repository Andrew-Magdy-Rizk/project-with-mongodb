const JWT = require("jsonwebtoken");
module.exports = async (pyload) => {
  const token = JWT.sign(pyload, process.env.TOKEN_SECRET, {
    expiresIn: "5m",
  });
  return token;
};
