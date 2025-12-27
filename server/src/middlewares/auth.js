const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * 1. Check Authentication (protect)
 * Verifies the JWT from the HTTP-Only cookie.
 * If valid, it attaches the user object to 'req.user'.
 */
const checkAuthentication = async (req, res, next) => {
  let acessToken;

  // 1. Try to get token from cookies (Best practice for Web Apps)
  acessToken = req.cookies.acess_token;
  console.log("Access Token from Cookie during authentication: ", acessToken);
  
  // Optional: Fallback to checking Authorization Header (Useful for Postman testing)
  // if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
  //   token = req.headers.authorization.split(" ")[1];
  // }

  if (acessToken) {
    try {
      // 2. Verify Token
      const decoded = jwt.verify(acessToken, process.env.JWT_SECRET_KEY);

      // 3. Get User from DB (exclude password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        console.log("User does not exist");
        return res.status(401).json({ message: "User not found" });
      }

      console.log("Authenticated User: ", req.user.username);
      next(); // Authentication successful
    } catch (error) {
      console.log("Exception while checking authentication");
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

/**
 * 2. Check Authorization (authorize)
 * Checks if the authenticated user has a specific role.
 * usage: router.delete(..., authorize('admin'), ...)
 */
const checkAuthorization = (...roles) => {
  return (req, res, next) => {
    // checkAuthentication() middleware runs first, so req.user is already available
    if (!req.user) {
       return res.status(401).json({ message: "User not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role '${req.user.role}' is not authorized to access this route` 
      });
    }

    next(); // Authorization successful
  };
};

module.exports = { checkAuthentication, checkAuthorization };