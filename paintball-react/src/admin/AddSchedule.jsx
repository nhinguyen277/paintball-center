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
    date: "",
    time: "",
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
        "http://localhost:3000/admin/schedule/add",
        JSON.stringify(formData), // Convert formData to JSON
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        alert("A new schedule created successfully");
        navigate("/admin/schedules");
      } else {
        console.error("Error response from server:", response.data);
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("Error creating a schedule");
    }
  };
  return (
    <div className={styles.adminContainer}>
      <div className={styles.detail}>
        <h1 className={styles.scenarioTitle}>ADD A SCHEDULE</h1>
        <div id="detail" className={styles.detailContent}>
          <div className={styles.formFormat2}>
            <form onSubmit={handleSubmit}>
              <div className={`mb-3 ${styles.m3}`}>
                <label
                  htmlFor="date"
                  className={`form-label ${styles.labelForm2}`}
                >
                  Date:
                </label>
                <input
                  type="date"
                  className={`form-control ${styles.formColor}`}
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={`mb-3 ${styles.m3}`}>
                <label
                  htmlFor="time"
                  className={`form-label ${styles.labelForm2}`}
                >
                  Time:
                </label>
                <input
                  type="text"
                  className={`form-control ${styles.formColor}`}
                  id="time"
                  name="time"
                  placeholder="24:00"
                  value={formData.time}
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
