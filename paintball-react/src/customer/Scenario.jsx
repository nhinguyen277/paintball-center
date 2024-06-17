import styles from "../css/styles.module.css";
import ScenarioDetail from "../components/customer/ScenarioDetail";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Detail() {
  const [customer, setCustomer] = useState(null); // State to store customer ID
  const navigate = useNavigate();
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
      <ScenarioDetail />
    </>
  );
}
