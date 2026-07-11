import Order from "../models/Order.js";
import Product from "../models/Product.js";

const nextNumericId = async () => {
  const docs = await Order.find({}, { id: 1, _id: 0 }).lean();
  const maxId = docs.reduce((max, doc) => {
    const value = Number(doc.id);
    return Number.isFinite(value) ? Math.max(max, value) : max;
  }, 0);

  return maxId + 1;
};

const toOrderResponse = (order) => {
  if (!order) return order;

  return {
    ...order,
    date: order.date || order.createdAt,
  };
};

const normalizeItems = (items = []) =>
  items.map((item) => ({
    productId: Number(item.productId),
    qty: Number(item.qty) || 1,
  }));

const releaseOrderStock = async (items = []) => {
  for (const item of items) {
    await Product.findOneAndUpdate(
      { id: Number(item.productId) },
      { $inc: { stock: Math.max(1, Number(item.qty) || 1) } }
    );
  }
};

const reserveOrderStock = async (items = []) => {
  const appliedChanges = [];

  for (const item of items) {
    const productId = Number(item.productId);
    const qty = Math.max(1, Number(item.qty) || 1);

    const product = await Product.findOneAndUpdate(
      {
        id: productId,
        stock: { $gte: qty },
      },
      {
        $inc: { stock: -qty },
      },
      {
        new: true,
      }
    ).lean();

    if (!product) {
      await releaseOrderStock(appliedChanges);
      const error = new Error("One or more items are out of stock");
      error.statusCode = 409;
      throw error;
    }

    appliedChanges.push({ productId, qty });
  }
};

const applyStockForStatusChange = async (currentOrder, nextStatus) => {
  if (!nextStatus || currentOrder.status === nextStatus) return;

  if (currentOrder.status !== "cancelled" && nextStatus === "cancelled") {
    await releaseOrderStock(currentOrder.items);
  }

  if (currentOrder.status === "cancelled" && nextStatus !== "cancelled") {
    await reserveOrderStock(currentOrder.items);
  }
};

// Create Order
export const createOrder = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      id: Number(req.body.id) || Number(await nextNumericId()),
      userId: Number(req.body.userId),
      userEmail: req.body.userEmail?.trim().toLowerCase(),
      items: normalizeItems(req.body.items),
      total: Number(req.body.total),
      date: req.body.date || req.body.createdAt || new Date().toISOString(),
    };

    const order = await Order.create(payload);
    res.status(201).json(toOrderResponse(order.toObject()));
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

// Get All Orders
export const getAllOrders = async (req, res) => {
  try {
    const query = {};

    if (req.query.userId) {
      query.userId = Number.isFinite(Number(req.query.userId))
        ? Number(req.query.userId)
        : req.query.userId;
    }

    if (req.query.userEmail) {
      query.userEmail = req.query.userEmail.trim().toLowerCase();
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    const orders = await Order.find(query).lean();
    res.status(200).json(orders.map(toOrderResponse));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Order By app id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      id: Number(req.params.id),
    }).lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(toOrderResponse(order));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Orders By User Id
export const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: Number.isFinite(Number(req.params.userId))
        ? Number(req.params.userId)
        : req.params.userId,
    }).lean();

    res.status(200).json(orders.map(toOrderResponse));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const saveOrder = async (req, res) => {
  try {
    const payload = { ...req.body };
    delete payload._id;
    delete payload.createdAt;
    delete payload.updatedAt;

    if (payload.userEmail) {
      payload.userEmail = payload.userEmail.trim().toLowerCase();
    }

    if (payload.id !== undefined) {
      payload.id = Number(payload.id);
    }

    if (payload.userId !== undefined) {
      payload.userId = Number(payload.userId);
    }

    if (payload.total !== undefined) {
      payload.total = Number(payload.total);
    }

    if (payload.items) {
      payload.items = normalizeItems(payload.items);
    }

    const currentOrder = await Order.findOne({
      id: Number(req.params.id),
    }).lean();

    if (!currentOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    await applyStockForStatusChange(currentOrder, payload.status);

    const order = await Order.findOneAndUpdate(
      { id: Number(req.params.id) },
      payload,
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(toOrderResponse(order));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Order
export const updateOrder = async (req, res) => saveOrder(req, res);
export const patchOrder = async (req, res) => saveOrder(req, res);

// Delete Order
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({
      id: Number(req.params.id),
    }).lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Order Status
export const updateOrderStatus = async (req, res) => saveOrder(req, res);
