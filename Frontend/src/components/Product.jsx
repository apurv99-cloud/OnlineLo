import API from "../axios"; // ✅ FIX
import React, { useEffect, useState } from "react";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await API.get("/orders"); // ✅ FIX
        setOrders(response.data);
      } catch (error) {
        console.log(error);
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PLACED":
        return "bg-info";
      case "SHIPPED":
        return "bg-primary";
      case "DELIVERED":
        return "bg-success";
      case "CANCELLED":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const calculateOrderTotal = (items) => {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-5">{error}</div>;
  }

  return (
    <div className="container mt-5 pt-5">
      <h2 className="text-center mb-4">Orders</h2>

      <div className="card shadow">
        <div className="card-body p-0">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <React.Fragment key={order.orderId}>
                  <tr>
                    <td>{order.orderId}</td>
                    <td>{order.customerName}</td>
                    <td>
                      <span className={`badge ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{formatCurrency(calculateOrderTotal(order.items))}</td>
                    <td>
                      <button onClick={() => toggleOrderDetails(order.orderId)}>
                        {expandedOrder === order.orderId ? "Hide" : "View"}
                      </button>
                    </td>
                  </tr>

                  {expandedOrder === order.orderId && (
                    <tr>
                      <td colSpan="5">
                        {order.items.map((item, i) => (
                          <div key={i}>
                            {item.productName} x {item.quantity}
                          </div>
                        ))}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Order;
