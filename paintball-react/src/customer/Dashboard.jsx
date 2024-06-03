import styles from "../css/styles.module.css";
import SideBar from "../components/customer/Sidebar";
import target from "../img/Target.png";
import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function Dashboard() {
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
      <div className={styles.pageContent}>
        <h1>WELCOME TO EPIC PAINTBALL ADVENTURES</h1>
        <h1>PREPARE FOR UPCOMING JOURNEYS HERE.</h1>
        <h1>SHOOT YOUR GUNS !</h1>
        <img src={target} className={styles.target} alt="target" />
      </div>
    </>
  );
}
