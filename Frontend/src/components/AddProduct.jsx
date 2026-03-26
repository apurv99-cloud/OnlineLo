import React, { useState } from "react";
import API from "../axios"; // ✅ FIX
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "", // ✅ FIX name
    releaseDate: "",
    productAvailable: false,
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setProduct({ ...product, [name]: fieldValue });

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);

      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, image: "Only JPG/PNG allowed" });
      } else if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Max size 5MB" });
      } else {
        setErrors({ ...errors, image: null });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!product.name.trim()) newErrors.name = "Required";
    if (!product.brand.trim()) newErrors.brand = "Required";
    if (!product.description.trim()) newErrors.description = "Required";
    if (!product.price || parseFloat(product.price) <= 0)
      newErrors.price = "Invalid";
    if (!product.category) newErrors.category = "Required";
    if (!product.stockQuantity || parseInt(product.stockQuantity) < 0)
      newErrors.stockQuantity = "Invalid";
    if (!product.releaseDate) newErrors.releaseDate = "Required";
    if (!image) newErrors.image = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" }),
    );

    try {
      await API.post("/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product added ✅");

      setProduct({
        name: "",
        brand: "",
        description: "",
        price: "",
        category: "",
        stockQuantity: "",
        releaseDate: "",
        productAvailable: false,
      });

      setImage(null);
      setImagePreview(null);
      setErrors({});
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Error adding product ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 pt-4">
      <form onSubmit={submitHandler} className="row g-4">
        <div className="col-md-6">
          <label>Name</label>
          <input
            name="name"
            className="form-control"
            value={product.name}
            onChange={handleInputChange}
          />
          {errors.name && <div className="text-danger">{errors.name}</div>}
        </div>

        <div className="col-md-6">
          <label>Brand</label>
          <input
            name="brand"
            className="form-control"
            value={product.brand}
            onChange={handleInputChange}
          />
        </div>

        <div className="col-md-12">
          <label>Description</label>
          <textarea
            name="description"
            className="form-control"
            value={product.description}
            onChange={handleInputChange}
          />
        </div>

        <div className="col-md-4">
          <label>Price</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={product.price}
            onChange={handleInputChange}
          />
        </div>

        <div className="col-md-4">
          <label>Category</label>
          <select
            name="category"
            className="form-select"
            value={product.category}
            onChange={handleInputChange}
          >
            <option value="">Select</option>
            <option value="Laptop">Laptop</option>
            <option value="Headphone">Headphone</option>
            <option value="Mobile">Mobile</option>
          </select>
        </div>

        <div className="col-md-4">
          <label>Stock</label>
          <input
            type="number"
            name="stockQuantity"
            className="form-control"
            value={product.stockQuantity}
            onChange={handleInputChange}
          />
        </div>

        <div className="col-md-6">
          <label>Date</label>
          <input
            type="date"
            name="releaseDate"
            className="form-control"
            value={product.releaseDate}
            onChange={handleInputChange}
          />
        </div>

        <div className="col-md-6">
          <input
            type="checkbox"
            name="productAvailable"
            checked={product.productAvailable}
            onChange={handleInputChange}
          />
          <label className="ms-2">Available</label>
        </div>

        <div className="col-md-12">
          <label>Image</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
          />
        </div>

        <div className="col-12 text-center">
          <button className="btn btn-primary">
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
