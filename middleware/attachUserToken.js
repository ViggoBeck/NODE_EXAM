// middleware/attachUserToken.js
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export async function attachUserToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('username');

    if (user) {
      req.user = user;
      
    }
  } catch (err) {
    
  }

  next();
}
