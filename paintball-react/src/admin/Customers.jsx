import styles from "../css/styles.module.css";
import CustomerList from "../components/admin/CustomerList";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Customers() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get("http://localhost:3000/verify").then((res) => {
      if (res.data.status) {
      } else {
        navigate("/admin");
      }
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
          <h1 className={styles.scenarioTitle}>All Customer</h1>
          <div className={styles.addLink}>
            <Link to="/admin/customer/add">Add A Customer</Link>
          </div>

          <table
            className={`table table-dark table-striped ${styles.contentTable}`}
          >
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                <th scope="col">#</th>
              </tr>
            </thead>
            <tbody>
              <CustomerList />
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
