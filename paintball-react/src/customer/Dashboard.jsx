import styles from "../css/styles.module.css";
import SideBar from "../components/customer/Sidebar";
import target from "../img/Target.png";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function Dashboard() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null); // State to store customer ID
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("https://paintball-center-api.vercel.app/verifyCustomer")
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
      <div className={styles.pageContent}>
        <h1>WELCOME TO EPIC PAINTBALL ADVENTURES</h1>
        <h1>PREPARE FOR UPCOMING JOURNEYS HERE.</h1>
        <h1>SHOOT YOUR GUNS !</h1>
        <img src={target} className={styles.target} alt="target" />
        {customer && (
          <p>
            Customer: {customer.customer.firstname} {customer.customer.lastname}
          </p>
        )}
      </div>
    </>
  );
}
