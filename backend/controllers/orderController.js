import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Generate Next Numeric Order ID
const nextNumericId = async () => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: null,
        maxId: {
          $max: "$id",
        },
      },
    },
  ]);

  return (result[0]?.maxId || 0) + 1;
};

// Format Order Response
const toOrderResponse = (order) => {
  if (!order) {
    return order;
  }

  return {
    ...order,
    date: order.date || order.createdAt,
  };
};

// Normalize Order Items
const normalizeItems = (items = []) => {
  return items.map((item) => ({
    productId: Number(item.productId),
    qty: Math.max(1, Number(item.qty) || 1),
  }));
};

// Release Product Stock
const releaseOrderStock = async (items = []) => {
  for (const item of items) {
    const productId = Number(item.productId);
    const qty = Math.max(
      1,
      Number(item.qty) || 1
    );

    await Product.findOneAndUpdate(
      {
        id: productId,
      },
      {
        $inc: {
          stock: qty,
        },
      }
    );
  }
};

// Reserve Product Stock
const reserveOrderStock = async (items = []) => {
  const appliedChanges = [];

  for (const item of items) {
    const productId = Number(item.productId);

    const qty = Math.max(
      1,
      Number(item.qty) || 1
    );

    // Decrease stock only if enough stock exists
    const product =
      await Product.findOneAndUpdate(
        {
          id: productId,
          stock: {
            $gte: qty,
          },
        },
        {
          $inc: {
            stock: -qty,
          },
        },
        {
          new: true,
        }
      ).lean();

    // Not enough stock
    if (!product) {

      // Roll back previously reserved stock
      await releaseOrderStock(
        appliedChanges
      );

      const error = new Error(
        "One or more items are out of stock"
      );

      error.statusCode = 409;

      throw error;
    }

    appliedChanges.push({
      productId,
      qty,
    });
  }
};

// Handle Stock When Order Status Changes
const applyStockForStatusChange = async (
  currentOrder,
  nextStatus
) => {
  // Nothing to do
  if (
    !nextStatus ||
    currentOrder.status === nextStatus
  ) {
    return;
  }

  // Order becomes cancelled
  if (
    currentOrder.status !== "cancelled" &&
    nextStatus === "cancelled"
  ) {
    await releaseOrderStock(
      currentOrder.items
    );

    return;
  }

  // Cancelled order becomes active again
  if (
    currentOrder.status === "cancelled" &&
    nextStatus !== "cancelled"
  ) {
    await reserveOrderStock(
      currentOrder.items
    );
  }
};

// Create Order
export const createOrder = async (req, res) => {
  try {
    const payload = {
      ...req.body,

      id:
        Number(req.body.id) ||
        (await nextNumericId()),

      userId: Number(req.body.userId),

      userEmail:
        req.body.userEmail
          ?.trim()
          .toLowerCase(),

      items: normalizeItems(
        req.body.items
      ),

      total: Number(req.body.total),

      date:
        req.body.date ||
        req.body.createdAt ||
        new Date().toISOString(),
    };

    const order = await Order.create(
      payload
    );

    return res.status(201).json(
      toOrderResponse(
        order.toObject()
      )
    );

  } catch (error) {
    console.error(
      "createOrder error:",
      error
    );

    return res.status(
      error.statusCode || 400
    ).json({
      message: error.message,
    });
  }
};

// Get All Orders
export const getAllOrders = async (
  req,
  res
) => {
  try {
    const query = {};

    // Filter by user ID
    if (req.query.userId) {
      const userId = Number(
        req.query.userId
      );

      query.userId = Number.isFinite(userId)
        ? userId
        : req.query.userId;
    }

    // Filter by email
    if (req.query.userEmail) {
      query.userEmail =
        req.query.userEmail
          .trim()
          .toLowerCase();
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    const orders = await Order.find(query)
      .lean();


    return res.status(200).json(
      orders.map(toOrderResponse)
    );

  } catch (error) {
    console.error(
      "getAllOrders error:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get Order By ID
export const getOrderById = async (
  req,
  res
) => {
  try {
    const orderId = Number(
      req.params.id
    );

    const order = await Order.findOne({
      id: orderId,
    }).lean();

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json(
      toOrderResponse(order)
    );

  } catch (error) {
    console.error(
      "getOrderById error:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get Orders By User ID
export const getOrdersByUser = async (
  req,
  res
) => {
  try {
    const userId = Number(
      req.params.userId
    );

    const queryUserId =
      Number.isFinite(userId)
        ? userId
        : req.params.userId;

    const orders = await Order.find({
      userId: queryUserId,
    }).lean();


    return res.status(200).json(
      orders.map(toOrderResponse)
    );

  } catch (error) {
    console.error(
      "getOrdersByUser error:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};

// Shared Order Update Helper
const saveOrder = async (req, res) => {
  try {
    const orderId = Number(
      req.params.id
    );


    const payload = {
      ...req.body,
    };

    delete payload._id;
    delete payload.createdAt;
    delete payload.updatedAt;
    delete payload.id;

    if (payload.userEmail) {
      payload.userEmail =
        payload.userEmail
          .trim()
          .toLowerCase();
    }

    if (
      payload.userId !== undefined
    ) {
      payload.userId = Number(
        payload.userId
      );
    }

    if (
      payload.total !== undefined
    ) {
      payload.total = Number(
        payload.total
      );
    }

    if (payload.items) {
      payload.items =
        normalizeItems(
          payload.items
        );
    }

    const currentOrder =
      await Order.findOne({
        id: orderId,
      }).lean();

    if (!currentOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    await applyStockForStatusChange(
      currentOrder,
      payload.status
    );

    const order =
      await Order.findOneAndUpdate(
        {
          id: orderId,
        },
        payload,
        {
          new: true,
          runValidators: true,
        }
      ).lean();


    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json(
      toOrderResponse(order)
    );

  } catch (error) {
    console.error(
      "saveOrder error:",
      error
    );

    return res.status(
      error.statusCode || 400
    ).json({
      message: error.message,
    });
  }
};

// Update Order
export const updateOrder = async (
  req,
  res
) => {
  return saveOrder(req, res);
};

// Patch Order
export const patchOrder = async (
  req,
  res
) => {
  return saveOrder(req, res);
};

// Delete Order
export const deleteOrder = async (
  req,
  res
) => {
  try {
    const orderId = Number(
      req.params.id
    );

    const order =
      await Order.findOneAndDelete({
        id: orderId,
      }).lean();


    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json({
      message: "Order deleted successfully",
    });

  } catch (error) {
    console.error(
      "deleteOrder error:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};

// Update Order Status
export const updateOrderStatus = async (
  req,
  res
) => {
  return saveOrder(req, res);
};