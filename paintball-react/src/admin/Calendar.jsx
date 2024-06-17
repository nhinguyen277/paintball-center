import styles from "../css/styles.module.css";
import CalendarList from "../components/admin/CalendarList";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Calendar() {
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
  return (
    <>
      <div className={styles.adminContainer}>
        <div id="scenarioPart">
          <h1 className={styles.scenarioTitle}>All Scencarios Calendar</h1>
          <div className={styles.addLink}>
            <Link to="/admin/coupon/add">Add A Scenario's Time</Link>
          </div>

          <table
            className={`table table-dark table-striped ${styles.contentTable}`}
          >
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Date</th>
                <th scope="col">#</th>
              </tr>
            </thead>
            <tbody>
              <CalendarList />
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
