import React, { useEffect } from "react";
import { FaRupeeSign } from "react-icons/fa";
import { MDBDataTable } from "mdbreact";
import { FaRegEye } from "react-icons/fa6";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, myOrders } from "../../actions/orderAction";
import { Link } from "react-router-dom";
import { SkeletonOrder, SkeletonGrid, SkeletonStyles } from "../layouts/Skeleton";

const ListOrders = () => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, error, orders } = useSelector((state) => state.myOrders);

  useEffect(() => {
    dispatch(myOrders());
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, error]);

  const setOrders = () => {
    const data = {
      columns: [
        {
          label: "Restaurant Name",
          field: "restaurant",
          sort: "asc",
        },

        {
          label: "Order Items",
          field: "orderItems",
          sort: "asc",
        },

        {
          label: "Num of Items",
          field: "numOfItems",
          sort: "asc",
        },

        {
          label: "Amount",
          field: "amount",
          sort: "asc",
        },

        {
          label: "Status",
          field: "status",
          sort: "asc",
        },

        {
          label: "Order Date",
          field: "orderDate",
          sort: "asc",
        },

        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: [],
    };
    if (orders && orders.length > 0) {
      const sortedOrders = orders.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      sortedOrders.forEach((order) => {
        const orderItemNames = order.orderItems
          .map((item) => item.name)
          .join(",");

        data.rows.push({
          restaurant: order?.restaurant?.name || "unknown Restaurant",
          numOfItems: order.orderItems.length,
          amount: (
            <span>
              <FaRupeeSign />
              {order.finalTotal}
            </span>
          ),
          status:
            order.orderStatus &&
            String(order.orderStatus).includes("Delivered") ? (
              <p style={{ color: "green" }}>{order.orderStatus}</p>
            ) : (
              <p style={{ color: "red" }}>{order.orderStatus}</p>
            ),
          orderItems: orderItemNames,
          orderDate: new Date(order.createdAt).toLocaleDateString(),
          actions: (
            <Link to={`/eats/orders/${order._id}`}>
              <FaRegEye />
            </Link>
          ),
        });
      });
    }
    return data;
  };

  return (
    <>
      <SkeletonStyles />
      <div className="cartt">
        <h1 className="my-5">My Orders</h1>

        {loading ? (
          <div className="container">
            <SkeletonGrid count={5} component={SkeletonOrder} />
          </div>
        ) : (
          <MDBDataTable
            data={setOrders()}
            className="px-3"
            bordered
            striped
            hover
          />
        )}
      </div>
    </>
  );
};

export default ListOrders;
