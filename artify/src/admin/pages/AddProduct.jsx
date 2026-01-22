import { useState } from "react";
import { ENV } from "../../constants/env";
import "../style/adminLayout.css";
import "../style/form.css";
import "../style/buttons.css";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic validation
    if (!name || !price || !stock || !category || !image) {
      alert("Please fill all fields");
      return;
    }

    const newProduct = {
      name,
      price: Number(price),
      stock: Number(stock),
      category,
      image, // path like /images/brushes/brush1.webp
    };

    await fetch(`${ENV.API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });

    alert("Product added successfully ✅");

    // reset form
    setName("");
    setPrice("");
    setStock("");
    setCategory("");
    setImage("");
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Add Product</h1>

      <div className="admin-card">
        <form className="admin-form" onSubmit={handleSubmit}>
          
          <div>
            <label>Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Round Brush"
            />
          </div>

          <div>
            <label>Price (₹)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="120"
            />
          </div>

          <div>
            <label>Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="52"
            />
          </div>

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

          {/* Image Path */}
          <div>
            <label>Image Path</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/images/brushes/brush1.webp"
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