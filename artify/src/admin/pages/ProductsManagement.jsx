import { useEffect, useState } from "react";
import api from "../../services/api";
import ProductFilter from "../components/filter/ProductFilter";
import "../style/adminLayout.css";
import "../style/table.css";
import "../style/buttons.css";
import { deleteProduct } from "../../services/productService";

export default function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [editedProducts, setEditedProducts] = useState({});
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const categories = [...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchName = p.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory = category
      ? p.category === category
      : true;

    return matchName && matchCategory;
  });

  useEffect(() => {
    api.get("/products").then(res => {
      setProducts(res.data);
    });
  }, []);

  const update = async (id) => {
    const edited = editedProducts[id];
    if (!edited) return;

    if (edited.stock < 0) {
      alert("Stock cannot be negative");
      return;
    }

    await api.patch(`/products/${id}`, {
      name: edited.name,
      stock: edited.stock,
      price: edited.price
    });

    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...edited } : p
      )
    );

    setEditedProducts((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };


  const dlt = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await deleteProduct(id);

      // update UI instantly (no refresh)
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete product");
    }
  };

  return (
    <div className="admin-container">
  <h1 className="admin-title">Products Management</h1>

    <div className="admin-card">
      <h2 className="section-title">Product Stock</h2>

      <ProductFilter
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        categories={categories}
      />

      <table className="admin-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {filteredProducts.map((p) => (
            <tr key={p.id}>
              <td>
                <input
                  value={editedProducts[p.id]?.name ?? p.name}
                  onChange={(e) =>
                    setEditedProducts({
                      ...editedProducts,
                      [p.id]: {
                        ...editedProducts[p.id],
                        name: e.target.value,
                      },
                    })
                  }
                />
              </td>

              <td>
                <input
                  type="number"
                  value={editedProducts[p.id]?.stock ?? p.stock}
                  onChange={(e) =>
                    setEditedProducts({
                      ...editedProducts,
                      [p.id]: {
                        ...editedProducts[p.id],
                        stock: Number(e.target.value),
                      },
                    })
                  }
                />
              </td>

              <td>
                <input
                  type="number"
                  value={editedProducts[p.id]?.price ?? p.price}
                  onChange={(e) =>
                    setEditedProducts({
                      ...editedProducts,
                      [p.id]: {
                        ...editedProducts[p.id],
                        price: Number(e.target.value),
                      },
                    })
                  }
                />
              </td>

              <td>
                <button className="btn btn-primary" onClick={() => update(p.id)}>
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