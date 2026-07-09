import "dotenv/config";
import cors from "cors";
import express from "express";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: true,
  })
);
app.use(express.json());

connectDB();

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/admins", adminRoutes);
app.use("/checkout", checkoutRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Artify backend is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server is live on http://localhost:${PORT}`);
});
