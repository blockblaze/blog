import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try{
    const token = req.cookies.access_token;
  
    if (!token) {
      return res.status(401).json({ success: false, statusCode: 401, message: "No token provided. Unauthorized" });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        // Handle expired token or invalid token
        if (err.name === 'TokenExpiredError') {
          res.clearCookie('access_token');  // Clear the cookie if the token is expired
          return res.status(401).json({ success: false, statusCode: 401, message: "Token expired. Unauthorized" });
        }
  
        return res.status(401).json({ success: false, statusCode: 401, message: "Invalid token. Unauthorized" });
      }
  
      req.user = user;  // Add the user payload from the token to the request object
      next();
    });
  }catch(error){
    return res.status(500).json({ success: false, statusCode: 500, message: "Internal server error" });
  }


};
