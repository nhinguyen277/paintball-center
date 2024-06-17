import styles from "../css/styles.module.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function Profile() {
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

  const editPage = async () => {
    // console.log(customer);
    navigate(`edit/${customer.customer._id}`);
  };

  return (
    <>
      <div className={styles.profile}>
        <h1>Your Profile</h1>
        {customer ? (
          <>
            <h2>
              Customer: {customer.customer.firstname}{" "}
              {customer.customer.lastname}
            </h2>
            <h2 style={{ display: "flex", alignItems: "center" }}>
              Membership Type:{" "}
              {customer.customer.membership_id ? (
                <img
                  className={styles.imgMem}
                  src={`/src/img/${customer.membership.image}`}
                  alt={customer.membership.type}
                />
              ) : (
                <p></p>
              )}
            </h2>
            <h2>Email: {customer.customer.email}</h2>
            <h2>Password: {"*".repeat(10)}</h2>
            <h2>Phone number: {customer.customer.phone}</h2>
            <div className={styles.profilebutton}>
              <button onClick={editPage}>Edit Information</button>
              {/* <Link to={`/admin/booking/edit/${detail._id}`}>Edit</Link> */}
            </div>
          </>
        ) : (
          <p>Loading customer data...</p>
        )}
      </div>
    </>
  );
}
