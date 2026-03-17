import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import CheckoutPopup from "./CheckoutPopup";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(AppContext);

  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // ✅ Sync cart
  useEffect(() => {
    setCartItems(cart);
  }, [cart]);

  // ✅ Calculate total
  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    setTotalPrice(total);
  }, [cartItems]);

  // ✅ Image handler
  const convertBase64ToDataURL = (base64String, mimeType = "image/jpeg") => {
    const fallbackImage = "/fallback-image.jpg";

    if (!base64String) return fallbackImage;
    if (base64String.startsWith("data:")) return base64String;
    if (base64String.startsWith("http")) return base64String;

    return `data:${mimeType};base64,${base64String}`;
  };

  // ✅ Increase quantity
  const handleIncreaseQuantity = (itemId) => {
    const updated = cartItems.map((item) => {
      if (item.id === itemId) {
        if (item.quantity < item.stockQuality) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          toast.info("Max stock reached");
        }
      }
      return item;
    });
    setCartItems(updated);
  };

  // ✅ Decrease quantity
  const handleDecreaseQuantity = (itemId) => {
    const updated = cartItems.map((item) =>
      item.id === itemId
        ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
        : item,
    );
    setCartItems(updated);
  };

  // ✅ Remove item
  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  return (
    <div className="container mt-5 pt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow">
            {/* Header */}
            <div className="card-header bg-white">
              <h4 className="mb-0">Shopping Cart</h4>
            </div>

            <div className="card-body">
              {cartItems.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-cart-x fs-1 text-muted"></i>
                  <h5 className="mt-3">Your cart is empty</h5>
                  <a href="/" className="btn btn-primary mt-3">
                    Continue Shopping
                  </a>
                </div>
              ) : (
                <>
                  {/* Table */}
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Total</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {cartItems.map((item) => (
                          <tr key={item.id}>
                            {/* Product */}
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src={convertBase64ToDataURL(item.imageData)}
                                  alt={item.name}
                                  className="rounded me-3"
                                  width="80"
                                  height="80"
                                  style={{ objectFit: "cover" }}
                                />
                                <div>
                                  <h6 className="mb-0">{item.name}</h6>
                                  <small className="text-muted">
                                    {item.brand}
                                  </small>
                                </div>
                              </div>
                            </td>

                            {/* Price */}
                            <td>₹ {item.price}</td>

                            {/* Quantity */}
                            <td>
                              <div
                                className="input-group input-group-sm"
                                style={{ width: "120px" }}
                              >
                                <button
                                  className="btn btn-outline-secondary"
                                  onClick={() =>
                                    handleDecreaseQuantity(item.id)
                                  }
                                >
                                  <i className="bi bi-dash"></i>
                                </button>

                                <input
                                  type="text"
                                  className="form-control text-center"
                                  value={item.quantity}
                                  readOnly
                                />

                                <button
                                  className="btn btn-outline-secondary"
                                  onClick={() =>
                                    handleIncreaseQuantity(item.id)
                                  }
                                >
                                  <i className="bi bi-plus"></i>
                                </button>
                              </div>
                            </td>

                            {/* Total */}
                            <td className="fw-bold">
                              ₹ {(item.price * item.quantity).toFixed(2)}
                            </td>

                            {/* Action */}
                            <td>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleRemoveFromCart(item.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Total Card */}
                  <div className="card mt-3">
                    <div className="card-body d-flex justify-content-between">
                      <h5>Total:</h5>
                      <h5>₹ {totalPrice.toFixed(2)}</h5>
                    </div>
                  </div>

                  {/* Checkout */}
                  <div className="d-grid mt-4">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => setShowModal(true)}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Popup */}
      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
      />
    </div>
  );
};

export default Cart;
