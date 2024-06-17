import { useState, useEffect } from "react";
import Booking from "./Booking";
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function BookingList() {
  const [booking, setBooking] = useState([]);
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null); // State to store customer ID
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:3000/verifyCustomer")
      .then((res) => {
        if (res.data.status) {
          const fetchedCustomer = res.data.customer;
          if (fetchedCustomer) {
            setCustomer(fetchedCustomer);
          } else {
            console.error("Customer ID not found in response data");
          }
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Error fetching customer data:", error);
        navigate("/"); // Redirect to home page in case of error
      });
  }, [navigate]);

  useEffect(() => {
    if (customer) {
      const getBooking = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/api/customer/booking/${customer.customer._id}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch booking data");
          }
          const data = await response.json();
          setBooking(data);
        } catch (error) {
          console.error("Error fetching booking data:", error);
          // Handle error, e.g., show error message to the user
        }
      };
      getBooking();
    }
  }, [customer]);

  return booking.map((b) => (
    <Booking
      key={
        b._id +
        b.customer.firstname +
        b.customer.lastname +
        b.scenario.title +
        b.time +
        b.schedule.date +
        b.schedule.time
      }
      id={b._id}
      title={b.scenario.title}
      date={b.schedule.date}
      time={b.schedule.time}
      firstname={b.customer.firstname}
      lastname={b.customer.lastname}
    />
  ));
}
