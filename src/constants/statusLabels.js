import { ORDER_STATUS } from "./orderStatus";
import { PAYMENT_STATUS } from "./paymentStatus";
import { DELIVERY_STATUS } from "./deliveryStatus";

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: "Pending",
  [ORDER_STATUS.PROCESSING]: "Processing",
  [ORDER_STATUS.DELIVERED]: "Delivered",
  [ORDER_STATUS.CANCELLED]: "Cancelled"
};



export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PENDING]: "Payment Pending",
  [PAYMENT_STATUS.SUCCESS]: "Payment Successful",
  [PAYMENT_STATUS.FAILED]: "Payment Failed",
  [PAYMENT_STATUS.REFUNDED]: "Refunded"
};

export const DELIVERY_STATUS_LABELS = {
  [DELIVERY_STATUS.NOT_DISPATCHED]: "Not Dispatched",
  [DELIVERY_STATUS.DISPATCHED]: "Dispatched",
  [DELIVERY_STATUS.IN_TRANSIT]: "In Transit",
  [DELIVERY_STATUS.DELIVERED]: "Delivered"
};