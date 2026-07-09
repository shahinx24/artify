import Product from "../models/Product.js";

const nextNumericId = async () => {
  const docs = await Product.find({}, { id: 1, _id: 0 }).lean();
  const maxId = docs.reduce((max, doc) => {
    const value = Number(doc.id);
    return Number.isFinite(value) ? Math.max(max, value) : max;
  }, 0);

  return String(maxId + 1);
};

// Create Product
export const createProduct = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      id: req.body.id || (await nextNumericId()),
    };

    const product = await Product.create(payload);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const query = {};
    if (req.query.category) {
      query.category = req.query.category;
    }

    const products = await Product.find(query).lean();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      id: String(req.params.id),
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
    const payload = { ...req.body };
    delete payload._id;
    delete payload.createdAt;
    delete payload.updatedAt;

    const product = await Product.findOneAndUpdate(
      { id: String(req.params.id) },
      payload,
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Product
export const updateProduct = async (req, res) => saveProduct(req, res);
export const patchProduct = async (req, res) => saveProduct(req, res);

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      id: String(req.params.id),
    }).lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
