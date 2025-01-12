import jwt from "jsonwebtoken";
import generateToken from "../lib/generateToken.js";
import setTokenCookies from "../lib/setTokenCookies.js";
import User from "../models/user.model.js";

const checkAuthAndRefreshToken = async (req, res, next) => {
  const token = req.cookies.token;
  const refreshToken = req.cookies.refreshToken;

  if (!token && !refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized, please login",
    });
  }

  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded) {
      const user = await User.findById(decoded.userId).select("-password");
      req.user = user;
      next();
    }
  } else {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);

    if (decoded) {
      const user = await User.findById(decoded.userId).select("-password");
      req.user = user;

      const { token, refreshToken } = generateToken(req.user);

      setTokenCookies(res, token, refreshToken);

      next();
    }
  }
};

export default checkAuthAndRefreshToken;
