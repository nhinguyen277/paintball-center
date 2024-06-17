import React, { useState, useEffect } from "react";
import styles from "../css/styles.module.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function Edit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [memberships, setMembership] = useState([]);
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
    membershipId: "",
  });

  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  useEffect(() => {
    // Fetch the existing customer data to populate the form
    axios
      .get(`http://localhost:3000/api/customer/${id}`)
      .then((res) => {
        if (res.data) {
          const customer = res.data.customer;
          setFormData({
            firstname: customer.customer.firstname || "",
            lastname: customer.customer.lastname || "",
            email: customer.customer.email || "",
            password: "*".repeat(10),
            phone: customer.customer.phone || "",
            membershipId: customer.customer.membership_id || "",
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching customer data:", error);
      });
  }, [id]);

  // Fetch all membership
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
    if (e.target.name === "password") {
      setIsPasswordChanged(true);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      let updatedData = { ...formData };

      // Check if the password was changed
      if (!isPasswordChanged) {
        // Remove the password from the update if it hasn't changed
        delete updatedData.password;
      }

      const response = await axios.put(
        `http://localhost:3000/admin/customer/edit/${id}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        alert("Customer updated successfully");
        navigate("/admin/customer");
      } else {
        console.error("Error response from server:", response.data);
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("Error updating a customer");
    }
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.detail}>
        <h1 className={styles.scenarioTitle}>EDIT A CUSTOMER</h1>
        <div id="detail" className={styles.detailContent}>
          <div className={styles.formFormat2}>
            <form onSubmit={handleEdit}>
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
                Edit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
