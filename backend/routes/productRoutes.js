import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  patchProduct,
  deleteProduct,
} from "../controllers/productController.js";

import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", upload.single("image"), createProduct);

router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.put("/:id", upload.single("image"), updateProduct);
router.patch("/:id", upload.single("image"), patchProduct);

router.delete("/:id", deleteProduct);

export default router;
