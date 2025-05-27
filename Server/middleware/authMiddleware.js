export function protectRoute(req, res, next) {
    console.log("👣 Requested path:", req.path);
  
    const openPaths = ["/login", "/signup"];
  
    if (openPaths.includes(req.path)) {
      return next();
    }
  
    if (!req.session.userId) {
      return res.redirect("/login");
    }
  
    next();
  }