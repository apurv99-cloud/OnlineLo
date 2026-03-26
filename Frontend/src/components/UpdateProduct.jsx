import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../axios"; // ✅ FIX
import { toast } from "react-toastify";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({});
  const [image, setImage] = useState();
  const [imageChanged, setImageChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    productAvailable: false,
    stockQuantity: "", // ✅ FIX
  });

  // ✅ FETCH PRODUCT
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/product/${id}`);
        setProduct(res.data);
        setUpdateProduct(res.data);

        const imgRes = await API.get(`/product/${id}/image`, {
          responseType: "blob",
        });

        const file = new File([imgRes.data], res.data.imageName, {
          type: imgRes.data.type,
        });

        setImage(file);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
  }, [id]);

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

    // ✅ Only send image if changed
    if (imageChanged && image) {
      formData.append("imageFile", image);
    }

    formData.append(
      "product",
      new Blob([JSON.stringify(updateProduct)], {
        type: "application/json",
      }),
    );

    try {
      await API.put(`/product/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product updated ✅");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct({ ...updateProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setImageChanged(true);
    }
  };

  if (!product.id) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-5 pt-5">
      <h2 className="text-center mb-4">Update Product</h2>

      <form onSubmit={handleSubmit} className="row g-3">
        <input
          className="form-control"
          name="name"
          value={updateProduct.name}
          onChange={handleChange}
        />

        <input
          className="form-control"
          name="brand"
          value={updateProduct.brand}
          onChange={handleChange}
        />

        <textarea
          className="form-control"
          name="description"
          value={updateProduct.description}
          onChange={handleChange}
        />

        <input
          type="number"
          className="form-control"
          name="price"
          value={updateProduct.price}
          onChange={handleChange}
        />

        <input
          className="form-control"
          name="category"
          value={updateProduct.category}
          onChange={handleChange}
        />

        <input
          type="number"
          className="form-control"
          name="stockQuantity" // ✅ FIX
          value={updateProduct.stockQuantity}
          onChange={handleChange}
        />

        <input
          type="date"
          className="form-control"
          name="releaseDate"
          value={
            updateProduct.releaseDate
              ? updateProduct.releaseDate.slice(0, 10)
              : ""
          }
          onChange={handleChange}
        />

        <input type="file" onChange={handleImageChange} />

        <div className="col-12">
          <button className="btn btn-primary">
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
