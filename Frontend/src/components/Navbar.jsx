import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../axios"; // ✅ FIX

const Navbar = ({ onSelectCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [input, setInput] = useState("");
  const [showNoProductsMessage, setShowNoProductsMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const navbarRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsNavCollapsed(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchInitialData = async () => {
    try {
      const response = await API.get("/products"); // ✅ FIX
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (input.trim() === "") return;

    setIsLoading(true);
    setIsNavCollapsed(true);

    try {
      const response = await API.get(`/products/search?keyword=${input}`); // ✅ FIX

      if (response.data.length === 0) {
        setShowNoProductsMessage(true);
      } else {
        navigate(`/search-results`, { state: { searchData: response.data } });
      }
    } catch (error) {
      console.error(error);
      setShowNoProductsMessage(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg fixed-top bg-white shadow-sm"
      ref={navbarRef}
    >
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          Telusko
        </a>

        <button
          className="navbar-toggler"
          onClick={() => setIsNavCollapsed(!isNavCollapsed)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`${isNavCollapsed ? "collapse" : ""} navbar-collapse`}>
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a className="nav-link" href="/">
                Home
              </a>
            </li>
          </ul>

          <form className="d-flex" onSubmit={handleSubmit}>
            <input
              className="form-control me-2"
              placeholder="Search"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="btn btn-outline-success" type="submit">
              {isLoading ? "..." : "Search"}
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
