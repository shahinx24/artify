import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  const [, token] = authHeader.split(" ");

  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "JWT secret is not configured.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
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
