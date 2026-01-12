import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import "./index.css";
import "./styles/theme.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <ThemeProvider>
    <WishlistProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </WishlistProvider>
  </ThemeProvider>
</BrowserRouter>
);