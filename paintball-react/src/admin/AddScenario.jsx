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
    players: "",
    time: "",
    description: "",
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
    data.append("players", formData.players);
    data.append("time", formData.time);
    data.append("description", formData.description);
    if (image) {
      data.append("image", image);
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/admin/scenarios/add",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log("Response:", response); // Log successful response

      if (response.data.status === "success") {
        alert("A new scenario created successfully");
        navigate("/admin/scenarios");
      } else {
        console.error("Error response from server:", response.data);
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("Error creating a scenario");
    }
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.detail}>
        <h1 className={styles.scenarioTitle}>ADD A SCENARIO</h1>
        <div id="detail" className={styles.detailContent}>
          <div className={styles.formFormat2}>
            <form onSubmit={handleSubmit}>
              <div className={`mb-3 ${styles.m3}`}>
                <label
                  htmlFor="title"
                  className={`form-label ${styles.labelForm2}`}
                >
                  Scenario Title:
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
                  htmlFor="players"
                  className={`form-label ${styles.labelForm2}`}
                >
                  Number Of Players:
                </label>
                <input
                  type="number"
                  className={`form-control ${styles.formColor}`}
                  id="players"
                  name="players"
                  value={formData.players}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={`mb-3 ${styles.m3}`}>
                <label
                  htmlFor="time"
                  className={`form-label ${styles.labelForm2}`}
                >
                  Time (Minutes):
                </label>
                <input
                  type="number"
                  className={`form-control ${styles.formColor}`}
                  id="time"
                  name="time"
                  min="30"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={`mb-3 ${styles.m3}`}>
                <label
                  htmlFor="description"
                  className={`form-label ${styles.labelForm2}`}
                >
                  Description:
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="8"
                  cols="70"
                  className={`form-control ${styles.formColor}`}
                  value={formData.description}
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
