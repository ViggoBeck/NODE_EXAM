export function protectRoute(req, res, next) {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Du skal være logget ind" });
    }
    next();
}

