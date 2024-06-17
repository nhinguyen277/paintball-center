import React, { useState, useEffect } from "react";
import SideNav from "../components/SideNav";
import styles from "../css/styles.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Add() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get("http://localhost:3000/verify").then((res) => {
      if (res.data.status) {
      } else {
        navigate("/admin");
      }
    });
  }, []);
  useEffect(() => {
    // Dynamically import Bootstrap CSS
    import("bootstrap/dist/css/bootstrap.min.css");
  }, []);

  const [scenarios, setScenarios] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [formData, setFormData] = useState({
    scenarioId: "",
    scheduleId: "",
    coupon: "",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
  });

  // Fetch all scenarios
  useEffect(() => {
    fetch("http://localhost:3000/api/scenarios")
      .then((response) => response.json())
      .then((data) => {
        setScenarios(data);
      })
      .catch((error) => console.error("Error fetching scenarios:", error));
  }, []);

  // Fetch schedules when a scenario is selected
  useEffect(() => {
    if (formData.scenarioId) {
      fetch(`http://localhost:3000/api/schedules/${formData.scenarioId}`)
        .then((response) => response.json())
        .then((data) => {
          setSchedules(data);
        })
        .catch((error) => console.error("Error fetching schedules:", error));
    } else {
      setSchedules([]); // Clear schedules if no scenario is selected
    }
  }, [formData.scenarioId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/admin/booking/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        alert("Booking created successfully");
        navigate("/admin/booking");
      } else {
        console.error("Error response from server:", result);
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("Error creating booking");
    }
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.detail}>
        <h1 className={styles.scenarioTitle}>BOOKING</h1>
        <div id="detail" className={styles.detailContent}>
          <div className={styles.formFormat}>
            <form onSubmit={handleSubmit}>
              <div className={`mb-3 ${styles.m3}`}>
                <label
                  htmlFor="scenario"
                  className={`form-label ${styles.labelForm}`}
                >
                  Scenario:
                </label>
                <select
                  className={`form-select form-select-lg mb-3 ${styles.formColor}`}
                  aria-label="Large select example"
                  id="scenario"
                  name="scenarioId"
                  value={formData.scenarioId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a scenario</option>
                  {scenarios.map((scenario) => (
                    <option key={scenario._id} value={scenario._id}>
                      {scenario.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className={`mb-3 ${styles.m3}`}>
                <label
                  htmlFor="schedule"
                  className={`form-label ${styles.labelForm}`}
                >
                  Date Time:
                </label>
                <select
                  className={`form-select form-select-lg mb-3 ${styles.formColor}`}
                  id="schedule"
                  name="scheduleId"
                  value={formData.scheduleId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a schedule</option>
                  {schedules.map((schedule) => (
                    <option key={schedule._id} value={schedule._id}>
                      {schedule.date}
                    </option>
                  ))}
                </select>
              </div>
              <div className={`mb-3 ${styles.m3}`}>
                <label
                  htmlFor="coupon"
                  className={`form-label ${styles.labelForm}`}
                >
                  Coupon:
                </label>
                <input
                  type="text"
                  className={`form-control ${styles.formColor}`}
                  id="coupon"
                  name="coupon"
                  value={formData.coupon}
                  onChange={handleChange}
                />
              </div>
              <h1>Your Information</h1>
              <div className={`mb-3 ${styles.m3}`}>
                <label
                  htmlFor="firstName"
                  className={`form-label ${styles.labelForm}`}
                >
                  First name:
                </label>
                <input
                  type="text"
                  className={`form-control ${styles.formColor}`}
                  aria-label="First name"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={`mb-3 ${styles.m3}`}>
                <label
                  htmlFor="lastName"
                  className={`form-label ${styles.labelForm}`}
                >
                  Last name:
                </label>
                <input
                  type="text"
                  className={`form-control ${styles.formColor}`}
                  aria-label="Last name"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={`mb-3 ${styles.m3}`}>
                <label
                  htmlFor="email"
                  className={`form-label ${styles.labelForm}`}
                >
                  Email:
                </label>
                <input
                  type="email"
                  className={`form-control ${styles.formColor}`}
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={`mb-3 ${styles.m3}`}>
                <label
                  htmlFor="phone"
                  className={`form-label ${styles.labelForm}`}
                >
                  Phone Number:
                </label>
                <input
                  type="tel"
                  className={`form-control ${styles.formColor}`}
                  aria-label="phone"
                  name="phone"
                  maxLength="12"
                  value={formData.phone}
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
