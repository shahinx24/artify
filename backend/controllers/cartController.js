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

export const getUserCart = async (req, res) => {
  try {
    const cart = await getCartDetails(req.params.id);
    res.status(200).json(cart);
  } catch (error) {
    sendError(res, error);
  }
};

export const addUserCartItem = async (req, res) => {
  try {
    const user = await addCartItem(
      req.params.id,
      req.body.productId,
      req.body.qty
    );
    res.status(200).json(user);
  } catch (error) {
    sendError(res, error);
  }
};

export const updateUserCartItem = async (req, res) => {
  try {
    const user = await updateCartItemQty(
      req.params.id,
      req.params.productId,
      req.body.qty
    );
    res.status(200).json(user);
  } catch (error) {
    sendError(res, error);
  }
};

export const deleteUserCartItem = async (req, res) => {
  try {
    const user = await removeCartItem(req.params.id, req.params.productId);
    res.status(200).json(user);
  } catch (error) {
    sendError(res, error);
  }
};

export const clearUserCart = async (req, res) => {
  try {
    const user = await clearCart(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    sendError(res, error);
  }
};
