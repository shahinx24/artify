import "dotenv/config";
import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import { logger } from "./middleware/logger.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(logger);

connectDB();

app.get("/", (req, res) => {
  res.send("Backend Working");
});

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/admins", adminRoutes);
app.use("/checkout", checkoutRoutes);

app.listen(PORT, () => {
  console.log(`Server is live on http://localhost:${PORT}`);
});
