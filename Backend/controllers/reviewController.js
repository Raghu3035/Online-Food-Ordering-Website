const FoodItem = require("../models/foodItem");
const Order = require("../models/order");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

exports.submitFoodReview = catchAsyncErrors(async (req, res, next) => {
  const { foodItemId, rating, comment, orderId } = req.body;

  if (!foodItemId || !rating || !comment || !orderId) {
    return next(new ErrorHandler("Please provide all review fields.", 400));
  }

  const order = await Order.findOne({
    _id: orderId,
    user: req.user._id,
    orderStatus: { $regex: "delivered", $options: "i" },
  });

  if (!order) {
    return next(
      new ErrorHandler("Delivered order not found for this review request.", 400)
    );
  }

  const hasFoodInOrder = (order.orderItems || []).some(
    (item) => String(item.fooditem) === String(foodItemId)
  );

  if (!hasFoodInOrder) {
    return next(new ErrorHandler("This food item is not part of your order.", 400));
  }

  const foodItem = await FoodItem.findById(foodItemId).lean();
  if (!foodItem) {
    return next(new ErrorHandler("Food item not found.", 404));
  }

  const numericRating = Number(rating);
  if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    return next(new ErrorHandler("Rating must be between 1 and 5.", 400));
  }

  const updatedReviews = [...(foodItem.reviews || [])];
  const existingReviewIndex = updatedReviews.findIndex(
    (review) =>
      review.user &&
      review.orderId &&
      String(review.user) === String(req.user._id) &&
      String(review.orderId) === String(orderId)
  );

  if (existingReviewIndex >= 0) {
    updatedReviews[existingReviewIndex].rating = numericRating;
    updatedReviews[existingReviewIndex].Comment = comment;
    updatedReviews[existingReviewIndex].name = req.user.name;
    updatedReviews[existingReviewIndex].createdAt = new Date();
  } else {
    updatedReviews.push({
      user: req.user._id,
      orderId,
      name: req.user.name,
      rating: numericRating,
      Comment: comment,
      createdAt: new Date(),
    });
  }

  const numOfReviews = updatedReviews.length;
  const ratingSum = updatedReviews.reduce(
    (sum, review) => sum + Number(review.rating || 0),
    0
  );
  const ratings = numOfReviews ? ratingSum / numOfReviews : 0;

  await FoodItem.updateOne(
    { _id: foodItemId },
    {
      $set: {
        reviews: updatedReviews,
        numOfReviews,
        ratings,
      },
    }
  );

  res.status(200).json({
    success: true,
    message: "Review submitted successfully.",
  });
});

exports.getFoodReviews = catchAsyncErrors(async (req, res, next) => {
  const foodItem = await FoodItem.findById(req.params.foodItemId).select("reviews");

  if (!foodItem) {
    return next(new ErrorHandler("Food item not found.", 404));
  }

  const reviews = [...(foodItem.reviews || [])].sort((a, b) => {
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  res.status(200).json({
    success: true,
    reviews,
  });
});
