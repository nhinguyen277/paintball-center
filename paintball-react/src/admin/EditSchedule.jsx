import React, { useState, useEffect } from "react";
import styles from "../css/styles.module.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function Edit() {
  const { id } = useParams();
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

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/schedule/${id}`
        );
        const { date, time } = response.data; // Assuming your API returns date and time fields
        setFormData({ date, time });
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };
    fetchSchedule();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    const updatedSchedule = {
      date: formData.date,
      time: formData.time,
    };

    try {
      const response = await axios.put(
        `http://localhost:3000/admin/schedule/edit/${id}`,
        updatedSchedule,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = response.data;
      if (response.status === 200) {
        alert("Schedule edited successfully");
        navigate(`/admin/schedules`); // Ensure URL matches your routes
      } else {
        console.error("Error response from server:", result);
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("Error editing schedule");
    }
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.detail}>
        <h1 className={styles.scenarioTitle}>Edit A SCHEDULE</h1>
        <div id="detail" className={styles.detailContent}>
          <div className={styles.formFormat2}>
            <form onSubmit={handleEdit}>
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
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
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
