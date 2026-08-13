import { authenticateAccount } from "../services/authenticationService.js";

export const login = async (req, res) => {
  try {
    const result = await authenticateAccount({
      email: req.body.email,
      pass: req.body.pass,
      roles: ["user", "admin"],
    });

    return res.status(200).json({ message: "Login successful", ...result });
  } catch (error) {
    console.error("unified login error:", error.message);
    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Server Error",
    });
  }
};
