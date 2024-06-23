import styles from "../css/styles.module.css";
import EquipmentList from "../components/admin/EquipmentList";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Equipment() {
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
          <h1 className={styles.scenarioTitle}>All Equipment</h1>
          <div className={styles.addLink}>
            <Link to="/admin/equipment/add">Add A Equipment</Link>
          </div>

          <table
            className={`table table-dark table-striped ${styles.contentTable}`}
          >
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Quantity</th>
                <th scope="col">Image</th>
                <th scope="col">#</th>
              </tr>
            </thead>
            <tbody>
              <EquipmentList />
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
