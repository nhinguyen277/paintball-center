import styles from "../css/styles.module.css";
import Scenarios from "../components/customer/ScenarioList";
import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Scenario() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get("http://localhost:3000/verify").then((res) => {
      if (res.data.status) {
      } else {
        navigate("/");
      }
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
