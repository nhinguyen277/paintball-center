import styles from "../css/styles.module.css";
import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get("http://localhost:3000/verify").then((res) => {
      if (res.data.status) {
      } else {
        navigate("/admin");
      }
    });
  }, []);
  return (
    <>
      <div className={styles.adminContainer}>
        <div className={styles.pageContent}>
          <h1>WELCOME BACK ADMIN</h1>
          <h1>Start Your Work Now! </h1>
        </div>
      </div>
    </>
  );
}
