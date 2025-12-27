const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "2d",
  });
};

const setAuthCookie = (res, userId) => {
  const acessToken = generateToken(userId);

  res.cookie("acess_token", acessToken, {
    httpOnly: true, // Prevent client-side JS from reading the cookie (XSS protection)
    // sameSite: "strict", // Prevent CSRF attacks
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days in milliseconds
  });
  return acessToken;
};

const clearAuthCookie = (res) => {
  res.cookie("acess_token", "", {
    httpOnly: true,
    expires: new Date(0), // Set expiration to the past to immediately delete it
  });
};

module.exports = { generateToken, setAuthCookie, clearAuthCookie };
