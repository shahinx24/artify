import { useState } from "react";
import { addProduct } from "../../services/productService";
import PageHeader from "../components/PageHeader";
import "../style/adminLayout.css";
import "../style/form.css";
import "../style/buttons.css";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [useNewCategory, setUseNewCategory] = useState(false);
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalCategory = useNewCategory
      ? newCategory.trim()
      : category;

    if (!name || !price || !stock || !finalCategory || !image) {
      alert("Please fill all required fields");
      return;
    }

    if (Number(price) < 0 || Number(stock) < 0) {
      alert("Price and stock must be positive values");
      return;
    }

    const newProduct = {
      name: name.trim(),
      price: Number(price),
      stock: Number(stock),
      category: finalCategory,
      image,
    };

    try {
      await addProduct(newProduct);
      alert("Product added successfully");

      // reset form
      setName("");
      setPrice("");
      setStock("");
      setCategory("");
      setNewCategory("");
      setImage("");
      setUseNewCategory(false);
    } catch (error) {
      console.error("Add product failed", error);
      alert("Failed to add product");
    }
  };

  return (
    <div className="admin-container">
      <PageHeader
        title="Add Product"
        subtitle="Create a new product for your store"
      />

      <div className="admin-card">
        <form className="admin-form" onSubmit={handleSubmit}>
          
          <div>
            <label>Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name of the Product"
            />
          </div>

          <div>
            <label>Price (₹)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="enter the price"
            />
          </div>

          <div>
            <label>Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="enter the stock"
            />
          </div>

          <div>
            <div>
            <label>
                <input
                type="radio"
                checked={!useNewCategory}
                onChange={() => setUseNewCategory(false)}
                />
                Use Existing Category
            </label>

            <label style={{ marginLeft: "20px" }}>
                <input
                type="radio"
                checked={useNewCategory}
                onChange={() => setUseNewCategory(true)}
                />
                Add New Category
            </label>
            </div>
            <br></br>
            {!useNewCategory && (
            <div>
                <label>Category</label>
                <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                >
                <option value="">Select Category</option>
                <option value="brushes">Brushes</option>
                <option value="paints">Paints</option>
                <option value="canvas">Canvas</option>
                <option value="tools">Tools</option>
                </select>
            </div>
            )}
            {useNewCategory && (
            <div>
                <label>Add New Category</label>
                <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="eg: watercolors"
                />
            </div>
            )}
          </div>

          {/* Image Path */}
          <div>
            <label>Image Path</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="eg: /images/brushes/brush1.webp"
            />
          </div>

          {/* Image Preview */}
          {image && (
            <img
              src={image}
              alt="preview"
              style={{
                width: "120px",
                marginTop: "10px",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
          )}

          <button type="submit" className="btn btn-primary">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}