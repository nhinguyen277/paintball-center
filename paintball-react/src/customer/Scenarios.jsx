import styles from "../css/styles.module.css";
import Scenarios from "../components/customer/ScenarioList";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Scenario() {
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
      });
  }, []);
  return (
    <>
      <div className={styles.adminContainer}>
        <div id="scenarioPart">
          <h1 className={styles.scenarioTitle}>All Scenarios</h1>
          <div id="scenarios" className={styles.scenarios}>
            <Scenarios />
          </div>
        </div>
      </div>
    </>
  );
}
