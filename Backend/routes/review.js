const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  submitFoodReview,
  getFoodReviews,
} = require("../controllers/reviewController");

router.post("/", authController.protect, submitFoodReview);
router.get("/:foodItemId", getFoodReviews);

module.exports = router;
