import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const nextNumericId = async () => {
  const docs = await Product.find({}, { id: 1, _id: 0 }).lean();
  const maxId = docs.reduce((max, doc) => {
    const value = Number(doc.id);
    return Number.isFinite(value) ? Math.max(max, value) : max;
  }, 0);

  return maxId + 1;
};

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "artify/products",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

export const createProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Product image is required",
      });
    }
    
    let image = {};

    if (req.file) {
      const result = await uploadToCloudinary(req.file);

      image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    const payload = {
      ...req.body,
      image,
      id: req.body.id || (await nextNumericId()),
    };

    const product = await Product.create(payload);

    res.status(201).json(product);

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
export const getAllProducts = async (req, res) => {
  try {
    const { search = "", category = "" } = req.query;

    const query = {};

    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query).lean();

    res.status(200).json(products);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      id: Number(req.params.id),
    }).lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const saveProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      id: Number(req.params.id),
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Update image if a new one is uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      if (product.image?.public_id) {
        await cloudinary.uploader.destroy(product.image.public_id);
      }

      // Upload new image
      const result = await uploadToCloudinary(req.file);

      product.image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    // Update other fields
    product.name = req.body.name ?? product.name;
    product.price = Number(req.body.price ?? product.price);
    product.stock = Number(req.body.stock ?? product.stock);

    await product.save();

    res.status(200).json(product);

  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => saveProduct(req, res);
export const patchProduct = async (req, res) => saveProduct(req, res);

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      id: Number(req.params.id),
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Delete image from Cloudinary
    if (product.image?.public_id) {
      await cloudinary.uploader.destroy(product.image.public_id);
    }

    // Delete product from MongoDB
    await Product.deleteOne({
      id: Number(req.params.id),
    });

    res.status(200).json({
      message: "Product deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};