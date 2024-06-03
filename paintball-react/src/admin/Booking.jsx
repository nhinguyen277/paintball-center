import styles from "../css/styles.module.css";
import Booking from "../components/admin/BookingList";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import SideNav from "../components/SideNav";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

export default function Schedule() {
  //   const navigate = useNavigate();
  //   axios.defaults.withCredentials = true;
  //   useEffect(() => {
  //     axios.get("http://localhost:3000/verify").then((res) => {
  //       if (res.data.status) {
  //       } else {
  //         navigate("/");
  //       }
  //     });
  //   }, []);

  useEffect(() => {
    // Dynamically import Bootstrap CSS
    import("bootstrap/dist/css/bootstrap.min.css");
  }, []);
  return (
    <>
      <div className={styles.adminContainer}>
        <SideNav />
        <div id="scenarioPart">
          <h1 className={styles.scenarioTitle}>All Booking</h1>
          <div className={styles.addLink}>
            <Link to="/admin/booking/add">Add Booking</Link>
          </div>

          <table
            className={`table table-dark table-striped ${styles.contentTable}`}
          >
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Scenario</th>
                <th scope="col">Date</th>
                <th scope="col">Time</th>
                <th scope="col">#</th>
              </tr>
            </thead>
            <tbody>
              <Booking />
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
