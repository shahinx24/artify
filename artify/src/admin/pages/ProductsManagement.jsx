import { useEffect, useState } from "react";
import { ENV } from "../../constants/env";
import "../style/adminLayout.css";
import "../style/table.css";
import "../style/buttons.css";

export default function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [editedProducts, setEditedProducts] = useState({});

  useEffect(() => {
  fetch(`${ENV.API_BASE_URL}/products`)
    .then((res) => res.json())
    .then((data) => {
      // console.log("PRODUCTS FROM API:", data);
      setProducts(data);
    });
}, []);


  const update = async (id) => {
  const newStock = editedStock[id];

  if (newStock === undefined) return;
  if (newStock < 0) {
  alert("Stock cannot be negative");
  return;
  }

  await fetch(`${ENV.API_BASE_URL}/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ stock: newStock }),
  });

  // update UI instantly
  setProducts((prev) =>
    prev.map((p) =>
      p.id === id ? { ...p, stock: newStock } : p
    )
  );
  };

  return (
    <div className="admin-container">
  <h1 className="admin-title">Products Management</h1>

  <div className="admin-card">
    <h2 className="section-title">Product Stock</h2>
    {/* <button>Add Product</button> */}

    <table className="admin-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Stock</th>
          <th>Price</th>
          <th>Update</th>
        </tr>
      </thead>

      <tbody>
        {products.map((p) => (
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
              <button className="btn btn-primary"  onClick={() => update(p.id)} >
                Update
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  </div>
  );
}