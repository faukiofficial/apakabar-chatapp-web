import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN, {
    expiresIn: "70d",
  });

  return { token, refreshToken };
};

export default generateToken;
