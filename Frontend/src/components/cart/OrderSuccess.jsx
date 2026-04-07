import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../../actions/orderAction";
import Loader from "../layouts/Loader";

const OrderSuccess = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const session_id = searchParams.get("session_id");
  const dispatch = useDispatch();
  const createOrderTriggered = useRef(false);
  const { loading, error, order } = useSelector((state) => state.newOrder);

  useEffect(() => {
    if (!session_id || createOrderTriggered.current) {
      return;
    }
    createOrderTriggered.current = true;
    dispatch(createOrder(session_id));
  }, [dispatch, session_id]);

  if (!session_id) {
    return (
      <div className="row justify-content-center">
        <div className="col-8 mt-5 text-center">
          <h3>Order session not found.</h3>
          <Link to="/cart">Back to Cart</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="row justify-content-center">
        <div className="col-8 mt-5 text-center">
          <h3>Order could not be created.</h3>
          <p className="text-danger">{error}</p>
          <Link to="/cart">Back to Cart</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-6 mt-5 text-center">
          <svg
            className="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              className="checkmark__circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              className="checkmark__check"
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>

          <h2>Your Order has been placed successfully.</h2>
          {order?.order?._id && <p>Order ID: {order.order._id}</p>}

          <Link to="/eats/orders/me/myOrders">Go to Orders</Link>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;
