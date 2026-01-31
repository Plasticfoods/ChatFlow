const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const getDomainType = () => {
  let domainType = "";
  if (process.env.NODE_ENV === "development") {
    domainType = "localhost";
  } else {
    domainType = "chatflow-67xw.onrender.com";
  }
  console.log(
    "Domain Type for Cookies: ",
    domainType,
    " in ",
    process.env.NODE_ENV,
    " mode.",
  );
  return domainType;
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "2d",
  });
};

const setAuthCookie = (res, userId) => {
  const acessToken = generateToken(userId);
  console.log(
    "Setting Auth Cookie with Token: ",
    acessToken,
    " for User ID: ",
    userId,
  );

  // res.cookie("acess_token", acessToken, {
  //   httpOnly: true, // Prevent client-side JS from reading the cookie (XSS protection)
  //   // sameSite: "strict", // Prevent CSRF attacks
  //   maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days in milliseconds
  //   withCredentials: true,
  // });

  res.cookie("acess_token", acessToken, {
    httpOnly: true, // Prevent client-side JS from reading the cookie (XSS protection)
    secure: true, // Ensures cookie is sent over HTTPS
    sameSite: "none", // Allow cross-site cookies
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    domain: getDomainType(), // Adjust domain as needed
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
