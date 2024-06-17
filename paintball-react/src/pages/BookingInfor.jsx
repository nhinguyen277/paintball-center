import styles from "../css/styles.module.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function BookingInfo() {
  const { id } = useParams();
  const [bookingInfo, setBookingInfo] = useState(null);

  useEffect(() => {
    const fetchBookingInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/booking/${id}`
        );
        setBookingInfo(response.data[0]);
      } catch (error) {
        console.error("Error fetching booking information:", error);
      }
    };

    fetchBookingInfo();
  }, [id]);

  if (!bookingInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.bookingQR}>
      <h1>Booking Information</h1>
      <div className={styles.bookingIn}>
        <div className={styles.bookingN}>
          <h3>Scenario: {bookingInfo.scenario?.title}</h3>
          <h3>Date: {bookingInfo.schedule?.date}</h3>
          <h3>Time: {bookingInfo.schedule?.time}</h3>
          <h3>
            Customer Name: {bookingInfo.customer?.firstname}{" "}
            {bookingInfo.customer?.lastname}
          </h3>
          <h3>Email: {bookingInfo.customer?.email}</h3>
          <h3>Phone number: {bookingInfo.customer?.phone}</h3>
          {bookingInfo.coupon && (
            <>
              <h3>Coupon Title: {bookingInfo.coupon.title}</h3>
              <h3>Coupon Code: {bookingInfo.coupon.code}</h3>
              <h3>Coupon Discount: {bookingInfo.coupon.discount}%</h3>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
