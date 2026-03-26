import API from "../axios"; // ✅ FIX
import React, { useState } from "react";
import { Modal, Button, Form, Toast, ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice }) => {
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
      await API.post("/orders/place", data); // ✅ FIX

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
      setToastMessage("Failed to place order");
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
            <h5 className="mb-3">Order Summary</h5>

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="d-flex align-items-center mb-3 border p-2 rounded"
              >
                <img
                  src={convertBase64ToDataURL(item.imageData)}
                  width="70"
                  height="70"
                  className="me-3"
                />
                <div className="flex-grow-1">
                  <h6>{item.name}</h6>
                  <small>Qty: {item.quantity}</small>
                </div>
                <div>₹{(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}

            <div className="d-flex justify-content-between mt-3">
              <h5>Total</h5>
              <h5>₹{totalPrice.toFixed(2)}</h5>
            </div>

            <Form.Group className="mt-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Confirm Order"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg={toastVariant}
        >
          <Toast.Header>
            <strong>Order Status</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default CheckoutPopup;
