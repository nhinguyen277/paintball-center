import React, { useState, useEffect } from "react";
import styles from "../css/styles.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Add() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const [memberships, setMembership] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/verify").then((res) => {
      // console.log("dashboard:", res.data);
      if (res.data.message === "no token" || res.data.mes === "Forbidden") {
        navigate("/admin");
      } else {
      }
    });
  }, []);

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
    membershipId: "",
  });

  // Fetch all scenarios
  useEffect(() => {
    fetch("http://localhost:3000/api/memberships")
      .then((response) => response.json())
      .then((data) => {
        setMembership(data);
      })
      .catch((error) => console.error("Error fetching membership:", error));
  }, []);

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
        "http://localhost:3000/customer/add",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        alert("A new customer created successfully");
        navigate("/admin/customer");
      } else {
        console.error("Error response from server:", response.data);
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("Error creating a customer");
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
                  htmlFor="membership"
                  className={`form-label ${styles.labelForm}`}
                >
                  Membership:
                </label>
                <select
                  className={`form-select form-select-lg mb-3 ${styles.formColor} ${styles.formSe}`}
                  aria-label="Large select example"
                  id="membership"
                  name="membershipId"
                  value={formData.membershipId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a membership</option>
                  {memberships.map((membership) => (
                    <option key={membership._id} value={membership._id}>
                      {membership.type}
                    </option>
                  ))}
                </select>
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
