import { useState, useEffect } from "react";
import styles from "../../css/styles.module.css";
import { useParams, Link, useNavigate } from "react-router-dom";
import SideNav from "../SideNav";

export default function DetailBooking() {
  const value = useParams();
  const [detail, setDetail] = useState(null);
  const navigate = useNavigate();
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

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/booking/delete/${value.id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete booking");
      }
      navigate("/admin/booking"); // Redirect to booking list after deletion
      alert("Delete booking successfully!");
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const editPage = async () => {
    navigate(`/admin/booking/edit/${detail._id}`);
  };

  if (!detail) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.detail}>
        <h1 className={styles.scenarioTitle}>YOUR BOOKING INFORMATION</h1>
        <div id="detail" className={styles.detailContent}></div>
        <div className={styles.information}>
          <div className={styles.booking}>
            <h2>Booking ID: {detail._id}</h2>
            <h2>
              Customer: {detail.customer?.firstname} {detail.customer?.lastname}
            </h2>
            <h2>Scenario: {detail.scenario?.title}</h2>
            <h2>Coupon: {detail.coupon?.title}</h2>
            <h2>Date: {detail.schedule?.date}</h2>
            <h2>Time: {detail.schedule?.time}</h2>
          </div>

          <div className={styles.bookingbutton}>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={editPage}>Edit</button>
            {/* <Link to={`/admin/booking/edit/${detail._id}`}>Edit</Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}
