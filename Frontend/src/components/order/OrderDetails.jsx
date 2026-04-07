import React, { Fragment, useEffect, useState } from "react";
import Loader from "../layouts/Loader";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { FaStar } from "react-icons/fa";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { getOrderDetails } from "../../actions/orderAction";
import { clearErrors } from "../../actions/orderAction";

const OrderDetails = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [activeReviewItemId, setActiveReviewItemId] = useState(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [foodReviews, setFoodReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewedByOrderItem, setReviewedByOrderItem] = useState({});
  const {
    loading,
    error,
    order = {},
  } = useSelector((state) => state.orderDetails);
  const { user: loggedInUser } = useSelector((state) => state.auth);

  const {
    deliveryInfo,
    orderItems,
    paymentInfo,
    user,
    finalTotal,
    orderStatus,
  } = order;

  useEffect(() => {
    dispatch(getOrderDetails(id));
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, error, id]);

  useEffect(() => {
    const fetchReviewedFlags = async () => {
      if (!orderItems || !orderItems.length || !loggedInUser?._id || !order?._id) {
        return;
      }

      const reviewFlags = {};
      await Promise.all(
        orderItems.map(async (item) => {
          try {
            const response = await axios.get(`/api/v1/eats/reviews/${item.fooditem}`);
            const reviews = response?.data?.reviews || [];
            const alreadyReviewedForThisOrder = reviews.some(
              (r) =>
                String(r.user) === String(loggedInUser._id) &&
                String(r.orderId) === String(order._id)
            );
            reviewFlags[item.fooditem] = alreadyReviewedForThisOrder;
          } catch (fetchError) {
            reviewFlags[item.fooditem] = false;
          }
        })
      );
      setReviewedByOrderItem(reviewFlags);
    };

    fetchReviewedFlags();
  }, [orderItems, loggedInUser, order]);

  const handleOpenReview = (item) => {
    setActiveReviewItemId(item.fooditem);
    setRating(5);
    setReview("");
    setLoadingReviews(true);
    axios
      .get(`/api/v1/eats/reviews/${item.fooditem}`)
      .then((response) => {
        setFoodReviews(response?.data?.reviews || []);
      })
      .catch(() => {
        setFoodReviews([]);
      })
      .finally(() => {
        setLoadingReviews(false);
      });
  };

  const handleSubmitReview = async (item) => {
    if (!review.trim()) {
      alert.error("Please enter a review.");
      return;
    }

    try {
      await axios.post("/api/v1/eats/reviews", {
        foodItemId: item.fooditem,
        rating,
        comment: review.trim(),
        orderId: order._id,
      });

      const response = await axios.get(`/api/v1/eats/reviews/${item.fooditem}`);
      setFoodReviews(response?.data?.reviews || []);
      setReviewedByOrderItem((prev) => ({
        ...prev,
        [item.fooditem]: true,
      }));
      alert.success("Thanks! Your review has been submitted.");
      setReview("");
    } catch (submitError) {
      const msg =
        submitError?.response?.data?.message || "Unable to submit review.";
      alert.error(msg);
    }
  };

  const deliveryDetails =
    deliveryInfo &&
    `${deliveryInfo.address}, ${deliveryInfo.city}, ${deliveryInfo.postalCode}, ${deliveryInfo.country}`;

    const isPaid = paymentInfo && paymentInfo.status === "paid" ? true : false;
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="row d-flex justify-content-between orderdetails">
            <div className="col-12 col-lg-8 mt-1 order-details">
              <h1 className="my-5">Order # {order._id}</h1>

              <h4 className="mb-4">Delivery Info</h4>
              <p>
                <b>Name:</b> {user && user.name}
              </p>
              <p>
                <b>Phone:</b> {deliveryInfo && deliveryInfo.phoneNo}
              </p>
              <p className="mb-4">
                <b>Address:</b>
                {deliveryDetails}
              </p>
              <p>
                <b>Amount:</b> <LiaRupeeSignSolid /> {finalTotal}
              </p>

              <hr />

              <h4 className="my-4">
                Payment :
                <span className={isPaid ? "greenColor" : "redColor"}>
                  <b>{isPaid ? " PAID" : " NOT PAID"}</b>
                </span>
              </h4>
              <h4 className="my-4">
                Order Status :
                <span className={order.orderStatus && String(order.orderStatus).includes("Delivered") ? "greenColor" : "redColor"}>
                  <b>{orderStatus}</b>
                </span>
              </h4>
              <h4 className="my-4">Order Items:</h4>

              <hr />
              <div className="cart-item my-1">
                {orderItems &&
                  orderItems.map((item) => (
                    <Fragment key={item.fooditem}>
                      <div className="row my-5">
                      <div className="col-4 col-lg-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          height="45"
                          width="65"
                        />
                      </div>

                      <div className="col-5 col-lg-5">
                        <Link to={`/products/${item.product}`}>
                          {item.name}
                        </Link>
                      </div>

                      <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                        <p>
                          <LiaRupeeSignSolid />
                          {item.price}
                        </p>
                      </div>

                      <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                        <p>{item.quantity} Item(s)</p>
                        {String(orderStatus || "").toLowerCase() === "delivered" &&
                          !reviewedByOrderItem[item.fooditem] && (
                          <button
                            type="button"
                            className="btn btn-sm delivery-review-btn mt-2"
                            onClick={() => handleOpenReview(item)}
                          >
                            Give Rating & Review
                          </button>
                        )}
                        {String(orderStatus || "").toLowerCase() === "delivered" &&
                          reviewedByOrderItem[item.fooditem] && (
                            <p className="already-reviewed mt-2 mb-0">
                              Review submitted for this order
                            </p>
                          )}
                      </div>
                      </div>

                      {activeReviewItemId === item.fooditem && (
                        <div className="review-form-box mb-4">
                          <label>Rate this item</label>
                          <div className="review-stars mb-2">
                            {[1, 2, 3, 4, 5].map((starValue) => (
                              <button
                                key={starValue}
                                type="button"
                                className={`star-btn ${rating >= starValue ? "active" : ""}`}
                                onClick={() => setRating(starValue)}
                              >
                                <FaStar />
                              </button>
                            ))}
                          </div>
                          <label htmlFor={`review-${item.fooditem}`}>Review</label>
                          <textarea
                            id={`review-${item.fooditem}`}
                            className="form-control mb-3"
                            rows="3"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Write your feedback..."
                          />
                          <button
                            type="button"
                            className="btn btn-success btn-sm mr-2"
                            onClick={() => handleSubmitReview(item)}
                          >
                            Submit
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => {
                              setActiveReviewItemId(null);
                              setFoodReviews([]);
                            }}
                          >
                            Cancel
                          </button>
                          <hr />
                          <h6 className="mb-2">Existing Reviews</h6>
                          {loadingReviews ? (
                            <p>Loading reviews...</p>
                          ) : foodReviews.length > 0 ? (
                            foodReviews.map((foodReview) => (
                              <div
                                key={foodReview._id}
                                className="existing-review-item mb-2"
                              >
                                <strong>{foodReview.name}</strong>{" "}
                                <span>({foodReview.rating}/5)</span>
                                <p className="mb-1">{foodReview.Comment}</p>
                              </div>
                            ))
                          ) : (
                            <p>No reviews yet.</p>
                          )}
                        </div>
                      )}
                    </Fragment>
                  ))}
              </div>
              <hr />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OrderDetails;
