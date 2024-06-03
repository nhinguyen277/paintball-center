import { useState, useEffect } from "react";
import styles from "../../css/styles.module.css";
import { useParams, Link } from "react-router-dom";
import SideNav from "../SideNav";

export default function DetailBooking() {
  const value = useParams();
  const [detail, setDetail] = useState([]);
  useEffect(() => {
    const getBooking = async () => {
      let response = await fetch(
        `http://localhost:3000/api/booking/${value.id}`
      );
      let data = await response.json();
      setDetail(data[0]); // Assuming data is an array and we're interested in the first element
    };
    getBooking();
  }, [value.id]);

  return (
    <div className={styles.adminContainer}>
      <SideNav />
      <div className={styles.detail}>
        <h1 className={styles.scenarioTitle}>YOUR BOOKING INFORMATION</h1>
        <div id="detail" className={styles.detailContent}></div>
        <div className={styles.information}>
          <div className={styles.booking}>
            <h2>Booking ID: {detail._id}</h2>
            <h2>Scenario: {detail.scenario?.title}</h2>
            <h2>Date: {detail.schedule?.date}</h2>
            <h2>Time: {detail.schedule?.time}</h2>
          </div>

          <div className={styles.bookingbutton}>
            <Link to={`/booking/cancel/${detail._id}`}>Cancel</Link>
            <Link to={`/booking/edit/${detail._id}`}>Edit</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
