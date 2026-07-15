import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  console.log("=================================");
  console.log("Request:", req.method, req.originalUrl);
  console.log("Authorization Header:", req.headers.authorization);

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No Authorization header found");

    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  const [, token] = authHeader.split(" ");
  console.log("JWT Token Received");

  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "JWT secret is not configured.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("JWT Verified");

    req.user = decoded;

    next();
  } catch (err) {
    console.log("JWT VERIFY ERROR:", err.message);

    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};

export const authorizeSelf = (req, res, next) => {
  if (
    req.user.role !== "admin" &&
    Number(req.user.id) !== Number(req.params.id)
  ) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  next();
};

export const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    next();
  };
};