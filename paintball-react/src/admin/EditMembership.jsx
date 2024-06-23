import React, { useState, useEffect } from "react";
import styles from "../css/styles.module.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function EditCoupon() {
  const navigate = useNavigate();
  const { id } = useParams();
  axios.defaults.withCredentials = true;
  const [formData, setFormData] = useState({
    type: "",
  });
  const [image, setImage] = useState(null);
  const [initialImage, setInitialImage] = useState(null); // To store initial image path

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
    // Fetch the existing coupon data to populate the form
    axios
      .get(`http://localhost:3000/api/membership/${id}`)
      .then((res) => {
        if (res.data) {
          const membership = res.data;
          setFormData({
            type: membership.type || "", // Ensure default empty string if null
          });
          setInitialImage(membership.image); // Set the existing image path
        }
      })
      .catch((error) => {
        console.error("Error fetching membership data:", error);
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
    data.append("type", formData.type);
    if (image) {
      data.append("image", image);
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/admin/membership/edit/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const result = response.data;
      if (response.status === 200) {
        alert("Membership edited successfully");
        navigate(`/admin/membership/${id}`); // Ensure URL matches your routes
      } else {
        console.error("Error response from server:", result);
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("Error editing membership");
    }
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.detail}>
        <h1 className={styles.scenarioTitle}>EDIT A MEMBERSHIP</h1>
        <div id="detail" className={styles.detailContent}>
          <div className={styles.formFormat2}>
            <form onSubmit={handleEdit}>
              <div className={`mb-3 ${styles.m3}`}>
                <label
                  htmlFor="type"
                  className={`form-label ${styles.labelForm2}`}
                >
                  Membership Type:
                </label>
                <input
                  type="text"
                  className={`form-control ${styles.formColor}`}
                  id="type"
                  name="type"
                  value={formData.type}
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
