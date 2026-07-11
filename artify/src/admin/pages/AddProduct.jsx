import { useState } from "react";
import { addProduct } from "../../services/productService";
import PageHeader from "../components/PageHeader";
import "../style/adminLayout.css";
import "../style/form.css";
import "../style/buttons.css";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    newCategory: "",
    image: null,
  });

  const [useNewCategory, setUseNewCategory] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalCategory = useNewCategory
      ? form.newCategory.trim()
      : form.category;

    if (
      !form.name ||
      !form.price ||
      !form.stock ||
      !finalCategory ||
      !form.image
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (Number(form.price) < 0 || Number(form.stock) < 0) {
      alert("Price and stock must be positive values");
      return;
    }

    const formData = new FormData();

    formData.append("name", form.name.trim());
    formData.append("price", Number(form.price));
    formData.append("stock", Number(form.stock));
    formData.append("category", finalCategory);
    formData.append("image", form.image);

    try {
      await addProduct(formData);

      alert("Product added successfully");

      setForm({
        name: "",
        price: "",
        stock: "",
        category: "",
        newCategory: "",
        image: null,
      });

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
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Price (₹)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Stock</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
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

            <br />

            {!useNewCategory && (
              <div>
                <label>Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  <option value="brushes">Brushes</option>
                  <option value="colors">Colors</option>
                  <option value="canvas">Canvas</option>
                  <option value="sketchbooks">Sketchbooks</option>
                  <option value="markers">Markers</option>
                  <option value="craft">Craft</option>
                </select>
              </div>
            )}

            {useNewCategory && (
              <div>
                <label>Add New Category</label>
                <input
                  type="text"
                  name="newCategory"
                  value={form.newCategory}
                  onChange={handleChange}
                  placeholder="eg: watercolors"
                />
              </div>
            )}
          </div>

          {/* Image Path */}
          <div>
            <label>Image Path</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          {/* Image Preview */}
          {form.image && (
            <img
              src={URL.createObjectURL(form.image)}
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