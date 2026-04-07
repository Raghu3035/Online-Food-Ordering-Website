const dotenv = require("dotenv");
const { ObjectId } = require("mongodb");

const Order = require("../models/order");
const Cart = require("../models/cartModel");
const User = require("../models/user");
const FoodItem = require("../models/foodItem");
const Email = require("../utils/email");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

dotenv.config({ path: "./config/config.env" });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const { session_id } = req.body;
  if (!session_id) {
    return next(new ErrorHandler("Missing checkout session id.", 400));
  }

  const session = await stripe.checkout.sessions.retrieve(session_id);

  if (!session || session.payment_status !== "paid") {
    return next(new ErrorHandler("Payment is not completed for this session.", 400));
  }

  const sessionUserId = session?.client_reference_id || null;
  const sessionEmail =
    session?.customer_email || session?.customer_details?.email || null;

  let currentUser = req.user || null;
  if (!currentUser && sessionUserId) {
    currentUser = await User.findById(sessionUserId);
  }
  if (!currentUser && sessionEmail) {
    currentUser = await User.findOne({ email: sessionEmail });
  }

  if (!currentUser) {
    return next(
      new ErrorHandler("Unable to identify user for this payment session.", 401)
    );
  }

  const existingOrder = await Order.findOne({
    user: currentUser._id,
    "paymentInfo.id": session.payment_intent,
  });

  if (existingOrder) {
    return res.status(200).json({ success: true, order: existingOrder });
  }

  const cart = await Cart.findOne({ user: currentUser._id })
    .populate({ path: "items.foodItem", select: "name price images" })
    .populate({ path: "restaurant", select: "name" });

  if (!cart || !cart.items || cart.items.length === 0) {
    return next(
      new ErrorHandler("Cart is empty. Unable to create order for this session.", 400)
    );
  }

  const addressLine1 = session?.shipping_details?.address?.line1 || "";
  const addressLine2 = session?.shipping_details?.address?.line2 || "";
  const deliveryInfo = {
    address: `${addressLine1}${addressLine2 ? `, ${addressLine2}` : ""}`.trim(),
    city: session?.shipping_details?.address?.city || "N/A",
    phoneNo:
      session?.customer_details?.phone ||
      session?.shipping_details?.phone ||
      "0000000000",
    postalCode: session?.shipping_details?.address?.postal_code || "000000",
    country: session?.shipping_details?.address?.country || "IN",
  };

  const orderItems = cart.items.map((item) => ({
    name: item.foodItem.name,
    quantity: item.quantity,
    image: item.foodItem.images?.[0]?.url || "",
    price: item.foodItem.price,
    fooditem: item.foodItem._id,
  }));

  const paymentInfo = {
    id: session.payment_intent,
    status: session.payment_status,
  };

  for (const item of orderItems) {
    const food = await FoodItem.findById(item.fooditem).select("stock name");
    if (!food) {
      return next(new ErrorHandler(`Food item not found: ${item.name}`, 400));
    }
    if (food.stock < item.quantity) {
      return next(
        new ErrorHandler(
          `Insufficient stock for '${food.name}'. Please update cart and retry.`,
          400
        )
      );
    }
  }

  for (const item of orderItems) {
    await FoodItem.updateOne(
      { _id: item.fooditem },
      { $inc: { stock: -item.quantity } }
    );
  }

  const orderPayload = {
    orderItems,
    deliveryInfo,
    paymentInfo,
    deliveryCharge: +(session?.shipping_cost?.amount_subtotal || 0) / 100,
    itemsPrice: +(session?.amount_subtotal || 0) / 100,
    finalTotal: +(session?.amount_total || 0) / 100,
    user: currentUser._id,
    restaurant: cart.restaurant?._id,
    paidAt: Date.now(),
    orderStatus: "Processing",
    createdAt: new Date(),
  };

  const insertResult = await Order.collection.insertOne(orderPayload);
  const order = await Order.findById(insertResult.insertedId);

  await Cart.findOneAndDelete({ user: currentUser._id });

  try {
    const user = await User.findById(currentUser._id);
    if (user && user.email) {
      const emailData = {
        orderNumber: order._id,
        orderItems: order.orderItems,
        itemsPrice: order.itemsPrice,
        taxPrice: order.taxPrice,
        deliveryCharge: order.deliveryCharge,
        finalTotal: order.finalTotal,
        deliveryInfo: order.deliveryInfo,
        paymentInfo: order.paymentInfo,
      };
      const email = new Email(user, `${process.env.FRONTEND_URL}/orders/${order._id}`);
      await email.sendOrderConfirmation(emailData);
    }
  } catch (_) {}

  res.status(200).json({ success: true, order });
});

exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("restaurant")
    .exec();

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  res.status(200).json({ success: true, order });
});

exports.myOrders = catchAsyncErrors(async (req, res) => {
  const userId = new ObjectId(req.user.id);
  const orders = await Order.find({ user: userId })
    .populate("user", "name email")
    .populate("restaurant")
    .exec();

  res.status(200).json({ success: true, orders });
});

exports.allOrders = catchAsyncErrors(async (req, res) => {
  const orders = await Order.find();
  const totalAmount = orders.reduce((sum, item) => sum + item.finalTotal, 0);
  res.status(200).json({ success: true, totalAmount, orders });
});
