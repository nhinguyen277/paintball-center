import styles from "../css/styles.module.css";
import BookingList from "../components/customer/BookingList";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Booking() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null); // State to store customer ID
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:3000/verifyCustomer")
      .then((res) => {
        if (res.data.status) {
          const fetchedCustomer = res.data.customer.customer;
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
    // Dynamically import Bootstrap CSS
    const bootstrapLink = document.createElement("link");
    bootstrapLink.rel = "stylesheet";
    bootstrapLink.href =
      "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css";
    document.head.appendChild(bootstrapLink);

    return () => {
      document.head.removeChild(bootstrapLink);
    };
  }, []);

  return (
    <>
      <div className={styles.adminContainer}>
        <div id="scenarioPart">
          <h1 className={styles.scenarioTitle}>All Booking</h1>
          <div className={styles.addLink}>
            <Link to="/customer/booking/add">Add Booking</Link>
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
              <BookingList />
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
