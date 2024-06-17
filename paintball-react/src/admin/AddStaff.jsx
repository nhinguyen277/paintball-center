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
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/staff/add",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        alert("A new staff created successfully");
        navigate("/admin/staff");
      } else {
        console.error("Error response from server:", response.data);
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("Error creating a staff");
    }
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.detail}>
        <h1 className={styles.scenarioTitle}>ADD A CUSTOMER</h1>
        <div id="detail" className={styles.detailContent}>
          <div className={styles.formFormat2}>
            <form onSubmit={handleSubmit}>
              <div className={`mb-3 ${styles.m3}`}>
                <label
                  htmlFor="firstname"
                  className={`form-label ${styles.labelForm2}`}
                >
                  First Name:
                </label>
                <input
                  type="text"
                  className={`form-control ${styles.formColor}`}
                  id="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={`mb-3 ${styles.m3}`}>
                <label
                  htmlFor="lastname"
                  className={`form-label ${styles.labelForm2}`}
                >
                  Last Name:
                </label>
                <input
                  type="text"
                  className={`form-control ${styles.formColor}`}
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={`mb-3 ${styles.m3}`}>
                <label
                  htmlFor="email"
                  className={`form-label ${styles.labelForm2}`}
                >
                  Email:
                </label>
                <input
                  type="email"
                  className={`form-control ${styles.formColor}`}
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={`mb-3 ${styles.m3}`}>
                <label
                  htmlFor="password"
                  className={`form-label ${styles.labelForm2}`}
                >
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`form-control ${styles.formColor}`}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={`mb-3 ${styles.m3}`}>
                <label
                  htmlFor="phone"
                  className={`form-label ${styles.labelForm2}`}
                >
                  Phone:
                </label>
                <input
                  type="tel"
                  className={`form-control ${styles.formColor}`}
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={`mb-3 ${styles.m3}`}>
                <label
                  htmlFor="phone"
                  className={`form-label ${styles.labelForm2}`}
                >
                  Address:
                </label>
                <input
                  type="text"
                  className={`form-control ${styles.formColor}`}
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
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
