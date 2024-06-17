import React, { useState, useEffect } from "react";
import styles from "../css/styles.module.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function EditScenario() {
  const navigate = useNavigate();
  const { id } = useParams();
  axios.defaults.withCredentials = true;
  const [formData, setFormData] = useState({
    title: "",
    players: "",
    time: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [initialImage, setInitialImage] = useState(null); // To store initial image path

  useEffect(() => {
    axios.get("http://localhost:3000/verify").then((res) => {
      if (!res.data.status) {
        navigate("/admin");
      }
    });
  }, [navigate]);

  useEffect(() => {
    // Fetch the existing scenario data to populate the form
    axios
      .get(`http://localhost:3000/api/scenarios/${id}`)
      .then((res) => {
        if (res.data) {
          const scenario = res.data;
          setFormData({
            title: scenario.title || "", // Ensure default empty string if null
            players: scenario.players || "",
            time: scenario.time || "",
            description: scenario.description || "",
          });
          setInitialImage(scenario.image); // Set the existing image path
        }
      })
      .catch((error) => {
        console.error("Error fetching scenario data:", error);
      });

    // Dynamically import Bootstrap CSS
    import("bootstrap/dist/css/bootstrap.min.css");
  }, [id]);

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

  const handleEdit = async (e) => {
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
      const response = await axios.put(
        `http://localhost:3000/admin/scenarios/edit/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const result = response.data;
      if (response.status === 200) {
        alert("Scenario edited successfully");
        navigate(`/admin/scenarios/${id}`); // Ensure URL matches your routes
      } else {
        console.error("Error response from server:", result);
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("Error editing scenario");
    }
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.detail}>
        <h1 className={styles.scenarioTitle}>EDIT A SCENARIO</h1>
        <div id="detail" className={styles.detailContent}>
          <div className={styles.formFormat2}>
            <form onSubmit={handleEdit}>
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
                  required={!initialImage}
                />
              </div>
              <div className={`mb-3 ${styles.m3}`}>
                {initialImage && (
                  <div className={styles.imgFormat}>
                    <img
                      src={`http://localhost:5173/src/img/${initialImage}`}
                      alt={`${initialImage}`}
                      style={{
                        width: "100px",
                        marginTop: "10px",
                      }}
                    />
                    <p>{initialImage}</p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className={`btn btn-primary ${styles.btnForm}`}
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
