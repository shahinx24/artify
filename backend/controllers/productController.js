import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// Generate Next Numeric Product ID
const nextNumericId = async () => {
  const result = await Product.aggregate([
    {
      $group: {
        _id: null,
        maxId: {
          $max: "$id",
        },
      },
    },
  ]);

  return (result[0]?.maxId || 0) + 1;
};

// Upload Image To Cloudinary
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "artify/products",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    streamifier
      .createReadStream(file.buffer)
      .pipe(stream);
  });
};

// Create Product
export const createProduct = async (req, res) => {
  try {
    // Product image is required
    if (!req.file) {
      return res.status(400).json({
        message: "Product image is required",
      });
    }

    // Upload image to Cloudinary
    const result = await uploadToCloudinary(req.file);

    const image = {
      url: result.secure_url,
      public_id: result.public_id,
    };

    // Create product payload
    const payload = {
      ...req.body,
      image,
      id: req.body.id || (await nextNumericId()),
    };

    // Create product
    const product = await Product.create(payload);

    return res.status(201).json(product);

  } catch (error) {
    console.error("createProduct error:", error);

    return res.status(400).json({
      message: error.message,
    });
  }
};

// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const {
      search = "",
      category = "",
    } = req.query;

    const query = {};

    // Case-insensitive product search
    if (search.trim()) {
      query.name = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    // Category filter
    if (category.trim()) {
      query.category = category.trim();
    }

    const products = await Product.find(query)
      .lean();

    return res.status(200).json(products);

  } catch (error) {
    console.error("getAllProducts error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const productId = Number(req.params.id);

    const product = await Product.findOne({
      id: productId,
    }).lean();

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json(product);

  } catch (error) {
    console.error("getProductById error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

const saveProduct = async (req, res) => {
  try {
    const productId = Number(req.params.id);

    // Find existing product
    const product = await Product.findOne({
      id: productId,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (req.file) {

      // Delete old Cloudinary image
      if (product.image?.public_id) {
        await cloudinary.uploader.destroy(
          product.image.public_id
        );
      }

      // Upload new image
      const result = await uploadToCloudinary(
        req.file
      );

      product.image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    if (req.body.name !== undefined) {
      product.name = req.body.name;
    }

    if (req.body.price !== undefined) {
      product.price = Number(req.body.price);
    }

    if (req.body.stock !== undefined) {
      product.stock = Number(req.body.stock);
    }

    if (req.body.category !== undefined) {
      product.category = req.body.category;
    }

    if (req.body.description !== undefined) {
      product.description = req.body.description;
    }

    await product.save();
    return res.status(200).json(product);

  } catch (error) {
    console.error("saveProduct error:", error);

    return res.status(400).json({
      message: error.message,
    });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  return saveProduct(req, res);
};

// Patch Product
export const patchProduct = async (req, res) => {
  return saveProduct(req, res);
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const productId = Number(req.params.id);

    // Find product
    const product = await Product.findOne({
      id: productId,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.image?.public_id) {
      await cloudinary.uploader.destroy(
        product.image.public_id
      );
    }

    await Product.deleteOne({
      id: productId,
    });


    return res.status(200).json({
      message: "Product deleted successfully",
    });

  } catch (error) {
    console.error("deleteProduct error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};