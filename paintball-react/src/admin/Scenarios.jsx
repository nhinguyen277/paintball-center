import styles from "../css/styles.module.css";
import Scenarios from "../components/admin/ScenarioList";
import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Scenario() {
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
  return (
    <>
      <div className={styles.adminContainer}>
        <div id="scenarioPart">
          <h1 className={styles.scenarioTitle}>All Scenarios</h1>
          <div className={styles.addLink}>
            <Link to="/admin/scenarios/add">Add A Scenario</Link>
          </div>
          <div id="scenarios" className={styles.scenarios}>
            <Scenarios />
          </div>
        </div>
      </div>
    </>
  );
}
