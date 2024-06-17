import React, { useState, useEffect } from "react";
import styles from "../css/styles.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Add() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get("http://localhost:3000/verify").then((res) => {
      if (!res.data.status) {
        navigate("/admin");
      }
    });
  }, [navigate]);

  useEffect(() => {
    // Dynamically import Bootstrap CSS
    import("bootstrap/dist/css/bootstrap.min.css");
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    discount: "",
    code: "",
    start_date: "",
    end_date: "",
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("discount", formData.discount);
    data.append("code", formData.code);
    data.append("start_date", formData.start_date);
    data.append("end_date", formData.end_date);
    if (image) {
      data.append("image", image);
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/admin/coupon/add",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log("Response:", response); // Log successful response

      if (response.data.status === "success") {
        alert("A new coupon created successfully");
        navigate("/admin/coupons");
      } else {
        console.error("Error response from server:", response.data);
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("Error creating a coupon");
    }
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.detail}>
        <h1 className={styles.scenarioTitle}>ADD A COUPON</h1>
        <div id="detail" className={styles.detailContent}>
          <div className={styles.formFormat2}>
            <form onSubmit={handleSubmit}>
              <div className={`mb-3 ${styles.m3}`}>
                <label
                  htmlFor="title"
                  className={`form-label ${styles.labelForm2}`}
                >
                  Coupon Title:
                </label>
                <input
                  type="text"
                  className={`form-control ${styles.formColor}`}
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={`mb-3 ${styles.m3}`}>
                <label
                  htmlFor="discount"
                  className={`form-label ${styles.labelForm2}`}
                >
                  Discount:
                </label>
                <input
                  type="number"
                  className={`form-control ${styles.formColor}`}
                  id="discount"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={`mb-3 ${styles.m3}`}>
                <label
                  htmlFor="code"
                  className={`form-label ${styles.labelForm2}`}
                >
                  Code:
                </label>
                <input
                  type="text"
                  className={`form-control ${styles.formColor}`}
                  id="code"
                  name="code"
                  min="30"
                  value={formData.code}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={`mb-3 ${styles.m3}`}>
                <label
                  htmlFor="start_date"
                  className={`form-label ${styles.labelForm2}`}
                >
                  Start Date:
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  className={`form-control ${styles.formColor}`}
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={`mb-3 ${styles.m3}`}>
                <label
                  htmlFor="end_date"
                  className={`form-label ${styles.labelForm2}`}
                >
                  End Date:
                </label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  className={`form-control ${styles.formColor}`}
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={`mb-3 ${styles.m3}`}>
                <label
                  htmlFor="image"
                  className={`form-label ${styles.labelForm2}`}
                >
                  Image:
                </label>
                <input
                  type="file"
                  className={`form-control ${styles.formColor}`}
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  required
                />
              </div>

              <button
                type="submit"
                className={`btn btn-primary ${styles.btnForm}`}
              >
                Add
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
