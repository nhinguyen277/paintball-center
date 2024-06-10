import React, { useState, useEffect } from "react";
import styles from "../css/styles.module.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function EditBooking() {
  const { id } = useParams();
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
  const [booking, setBooking] = useState({
    scenarioId: "", // Provide default value for scenarioId
    scheduleId: "",
    coupon: "",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
  });

  // Fetch booking data for the booking ID from URL params
  useEffect(() => {
    fetch(`http://localhost:3000/api/booking/${id}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log("Raw booking data fetched:", data); // Log raw data
        if (data && data.length > 0) {
          // Check if data is not empty and has at least one element
          const fetchedBooking = data[0]; // Access the first element
          const couponCode = fetchedBooking.coupon
            ? fetchedBooking.coupon.code
            : "";
          //   console.log("Formatted booking data:", fetchedBooking); // Log formatted data
          setBooking({
            scenarioId: fetchedBooking.scenario
              ? fetchedBooking.scenario._id
              : "",
            scheduleId: fetchedBooking.schedule
              ? fetchedBooking.schedule._id
              : "",
            coupon: couponCode,
            firstname: fetchedBooking.customer
              ? fetchedBooking.customer.firstname
              : "",
            lastname: fetchedBooking.customer
              ? fetchedBooking.customer.lastname
              : "",
            email: fetchedBooking.customer ? fetchedBooking.customer.email : "",
            phone: fetchedBooking.customer ? fetchedBooking.customer.phone : "",
          });
        } else {
          console.error("Booking not found");
        }
      })
      .catch((error) => console.error("Error fetching booking data:", error));
  }, [id]);

  // Fetch all scenarios
  useEffect(() => {
    fetch("http://localhost:3000/api/scenarios")
      .then((response) => response.json())
      .then((data) => {
        // console.log("Fetched scenarios:", data); // Log scenarios
        setScenarios(data);
      })
      .catch((error) => console.error("Error fetching scenarios:", error));
  }, []);

  useEffect(() => {
    // Fetch schedules when a scenario is selected
    if (booking.scenarioId) {
      fetch(`http://localhost:3000/api/schedules/${booking.scenarioId}`)
        .then((response) => response.json())
        .then((data) => {
          setSchedules(data);
        })
        .catch((error) => console.error("Error fetching schedules:", error));
    } else {
      setSchedules([]); // Clear schedules if no scenario is selected
    }
  }, [booking.scenarioId]);

  const handleChange = (e) => {
    setBooking({
      ...booking,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/admin/booking/edit/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(booking),
        }
      );
      const result = await response.json();
      if (response.ok) {
        alert("Booking edited successfully");
        navigate(`/admin/booking/${id}`);
      } else {
        console.error("Error response from server:", result);
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("Error editing booking");
    }
  };

  //   // Ensure booking is not null before rendering the form
  //   if (!booking) {
  //     return <div>Loading...</div>; // Show a loading message while booking data is being fetched
  //   }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.detail}>
        <h1 className={styles.scenarioTitle}>EDIT BOOKING</h1>
        <div id="detail" className={styles.detailContent}></div>
        <div className={styles.formFormat}>
          <form onSubmit={handleEdit}>
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
                value={booking.scenarioId} // Ensure scenarioId is correctly set
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
                value={booking.scheduleId ?? ""}
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
                value={booking.coupon || ""}
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
                value={booking.firstname}
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
                value={booking.lastname}
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
                value={booking.email}
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
                type="text"
                className={`form-control ${styles.formColor}`}
                aria-label="phone"
                name="phone"
                value={booking.phone}
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
  );
}
