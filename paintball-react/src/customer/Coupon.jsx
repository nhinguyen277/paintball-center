import styles from "../css/styles.module.css";
import CouponList from "../components/customer/CouponList";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Coupons() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const [customer, setCustomer] = useState(null); // State to store customer ID

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
      });
  }, []);

  return (
    <>
      <div className={styles.adminContainer}>
        <div id="scenarioPart">
          <h1 className={styles.scenarioTitle}>All Coupons</h1>
          <CouponList />
        </div>
      </div>
    </>
  );
}
