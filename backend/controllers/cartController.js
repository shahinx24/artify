import {
  addCartItem,
  clearCart,
  getCartDetails,
  removeCartItem,
  updateCartItemQty,
} from "../services/commerce/cartService.js";

const sendError = (res, error) =>
  res.status(error.statusCode || 500).json({
    message: error.message || "Something went wrong",
  });

const sendCart = async (res, action) => {
  try {
    res.status(200).json(await action());
  } catch (error) {
    sendError(res, error);
  }
};

export const getUserCart = (req, res) =>
  sendCart(res, () => getCartDetails(req.params.id));

export const addUserCartItem = (req, res) =>
  sendCart(res, () =>
    addCartItem(
      req.params.id,
      req.body.productId,
      req.body.qty
    )
  );

export const updateUserCartItem = (req, res) =>
  sendCart(res, () =>
    updateCartItemQty(
      req.params.id,
      req.params.productId,
      req.body.qty
    )
  );

export const deleteUserCartItem = (req, res) =>
  sendCart(res, () =>
    removeCartItem(
      req.params.id,
      req.params.productId
    )
  );

export const clearUserCart = (req, res) =>
  sendCart(res, () => clearCart(req.params.id));
