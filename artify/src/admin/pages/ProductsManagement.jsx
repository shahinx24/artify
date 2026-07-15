import { useState } from "react";
import ProductFilter from "../components/filter/ProductFilter";
import "../style/adminLayout.css";
import "../style/table.css";
import "../style/buttons.css";
import { deleteProduct, updateProduct } from "../../services/productService";
import useProducts from "../../hooks/useProducts";
import { useNavigate } from "react-router-dom";
import { categories } from "../../data/categories";

export default function ProductsManagement({ showToast }) {
  const { products, refetch } = useProducts({
    search,
    category,
  });
  const [editedProducts, setEditedProducts] = useState({});
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const updateEditedProduct = (id, field, value) => {
    setEditedProducts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const filteredProducts = products;

  const update = async (id) => {
    const edited = editedProducts[id];
    if (!edited) {
      alert("No changes to update.");
      return;
    }

    const original = products.find(p => p.id === id);
    if (!original) return;

    const finalName = edited.name ?? original.name;
    const finalStock = Number(
      edited.stock ?? original.stock ?? 0
    );
    const finalPrice = Number(
      edited.price ?? original.price ?? 0
    );

    if (!finalName || finalName.trim() === "") {
      alert("Product name is required");
      return;
    }

    if (finalStock < 0) {
      alert("Stock cannot be negative");
      return;
    }

    if (finalPrice < 0) {
      alert("Price cannot be negative");
      return;
    }

    await updateProduct(id, {
      name: finalName,
      stock: finalStock,
      price: finalPrice,
      image: edited.image,
    });

    showToast("Product updated successfully!");

    await refetch(); // reload from source

    setEditedProducts(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }; // IMPORTANT: close update here


  const dlt = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(id);
      await refetch(); // reload after delete
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete product");
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Products Management</h1>

      <div className="admin-card">
        <div className="stock-header">
          <h2 className="section-title">Product Stock</h2>

          <ProductFilter
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            categories={categories}
          />

          <button
            className="btn btn-sec"
            onClick={() => navigate("/admin/add")}
          >
            Add New Product
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Image</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map(p => (
              <tr key={p.id}>
                <td>
                  <input
                    value={editedProducts[p.id]?.name ?? p.name}
                    onChange={(e) =>
                      updateEditedProduct(
                        p.id,
                        "name",
                        e.target.value
                      )
                    }
                  />
                </td>

                <td>
                  <img
                    src={editedProducts[p.id]?.image
                      ? URL.createObjectURL(editedProducts[p.id].image)
                      : p.image?.url}
                    alt={p.name}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 8,
                      display: "block",
                      marginBottom: 8,
                    }}
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      updateEditedProduct(
                        p.id,
                        "image",
                        e.target.files[0]
                      )
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    value={editedProducts[p.id]?.stock ?? p.stock}
                    onChange={(e) =>
                      updateEditedProduct(
                        p.id,
                        "stock",
                        Number(e.target.value)
                      )
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    value={editedProducts[p.id]?.price ?? p.price}
                    onChange={(e) =>
                      updateEditedProduct(
                        p.id,
                        "price",
                        Number(e.target.value)
                      )
                    }
                  />
                </td>

                <td>
                  <button
                    className="btn btn-primary"
                    disabled={!editedProducts[p.id]}
                    onClick={() => update(p.id)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button className="btn btn-danger" onClick={() => dlt(p.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}