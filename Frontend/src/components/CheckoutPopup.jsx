import axios from "axios";
import React, { useState } from "react";
import { Modal, Button, Form, Toast, ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [validated, setValidated] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Image handler
  const convertBase64ToDataURL = (base64String, mimeType = "image/jpeg") => {
    const fallbackImage = "/fallback-image.jpg";

    if (!base64String) return fallbackImage;
    if (base64String.startsWith("data:")) return base64String;
    if (base64String.startsWith("http")) return base64String;

    return `data:${mimeType};base64,${base64String}`;
  };

  const handleConfirm = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    setIsSubmitting(true);

    const orderItems = cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    const data = {
      customerName: name,
      email: email,
      items: orderItems,
    };

    try {
      await axios.post(`${baseUrl}/api/orders/place`, data);

      setToastVariant("success");
      setToastMessage("Order placed successfully!");
      setShowToast(true);

      localStorage.removeItem("cart");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error(error);

      setToastVariant("danger");
      setToastMessage("Failed to place order. Please try again.");
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>🛒 Checkout</Modal.Title>
        </Modal.Header>

        <Form noValidate validated={validated} onSubmit={handleConfirm}>
          <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
            {/* Products */}
            <div className="mb-4">
              <h5 className="mb-3">Order Summary</h5>

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="d-flex align-items-center mb-3 p-2 border rounded"
                >
                  <img
                    src={convertBase64ToDataURL(item.imageData)}
                    alt={item.name}
                    className="me-3 rounded"
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "cover",
                    }}
                  />

                  <div className="flex-grow-1">
                    <h6 className="mb-1">{item.name}</h6>
                    <small className="text-muted">Qty: {item.quantity}</small>
                  </div>

                  <div className="fw-bold">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="d-flex justify-content-between align-items-center mb-4 border-top pt-3">
              <h5>Total Amount:</h5>
              <h5 className="fw-bold text-primary">₹{totalPrice.toFixed(2)}</h5>
            </div>

            {/* Name */}
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide your name.
              </Form.Control.Feedback>
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid email.
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="outline-secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Confirm Order"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Toast */}
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 2000 }}
      >
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg={toastVariant}
        >
          <Toast.Header>
            <strong className="me-auto">Order Status</strong>
          </Toast.Header>

          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default CheckoutPopup;
