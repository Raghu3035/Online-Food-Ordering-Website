import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createOrder } from "../../actions/orderAction";

const OrderSuccess = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const session_id = searchParams.get("session_id");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(createOrder(session_id));
  }, [dispatch, session_id]);
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
              class="checkmark__check"
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>

          <h2>Your Order has been placed successfully.</h2>
          <p className="text-muted mb-3">Live Demo Tracking</p>

          <div className="demo-map-route mb-3">
            <div className="route-road"></div>
            <div className="route-dot restaurant-dot" title="Restaurant"></div>
            <div className="route-dot destination-dot" title="Delivery Address"></div>
            <div className="rider-dot" title="Delivery Partner"></div>
            <div className="rider-pulse"></div>
            <div className="route-label restaurant-label">Restaurant</div>
            <div className="route-label destination-label">You</div>
          </div>

          <Link to="/eats/orders/me/myOrders">Go to Orders</Link>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;
