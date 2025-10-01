const jwt = require("jsonwebtoken");

//checking whether the req has cookies;
exports.auth_user = async (req, res, next) => {
  const { token } = req.cookies;
  //unauthorised users
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "not authorized to access",
    });
  }
  //authorised users
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_STR);
    req.userId = decodedToken.id;
    req.user = {
      id: decodedToken.id,
    };
    next();
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: "invalid or expired token ",
    });
  }
};
