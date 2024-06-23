import styles from "../css/styles.module.css";
import CouponList from "../components/admin/CouponList";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Coupons() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
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
    // Dynamically import Bootstrap CSS
    import("bootstrap/dist/css/bootstrap.min.css");
  }, []);
  return (
    <>
      <div className={styles.adminContainer}>
        <div id="scenarioPart">
          <h1 className={styles.scenarioTitle}>All Coupons</h1>
          <div className={styles.addLink}>
            <Link to="/admin/coupon/add">Add A Coupon</Link>
          </div>

          <table
            className={`table table-dark table-striped ${styles.contentTable}`}
          >
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Title</th>
                <th scope="col">Discount</th>
                <th scope="col">Start Date</th>
                <th scope="col">End Date</th>
                <th scope="col">#</th>
              </tr>
            </thead>
            <tbody>
              <CouponList />
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
