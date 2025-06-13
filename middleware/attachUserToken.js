import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export async function attachUserToken(req, res, next) {
    const token = req.cookies?.token;
    if (!token) {
      req.user = null;
      return next();
    }
  
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.userId).select('_id username');
      req.user = user ?? null;
    } catch (err) {
      req.user = null;
    }
    next();
};
  
