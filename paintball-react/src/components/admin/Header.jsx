import logo from "../../img/logo.png";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../App.css";
import styles from "../../css/styles.module.css";

// Ensure Axios sends cookies with requests
axios.defaults.withCredentials = true;

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    verifyUser();
  }, []);

  const verifyUser = async () => {
    try {
      const response = await axios.get("http://localhost:3000/verify");
      setIsAuthenticated(response.data.status);
    } catch (error) {
      console.error("Error verifying user:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      const response = await axios.get("http://localhost:3000/signout");
      if (response.data.status) {
        setIsAuthenticated(false);
        navigate("/admin");
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header id="header" className={styles.headContainer}>
      <Link to="/">
        <img src={logo} className={styles.logo} alt="logo" />
      </Link>
      <h1 id="site-name" className={styles.siteName}>
        <Link to="/">Epic Paintball Adventures</Link>
      </h1>
      <div className="adminLogout">
        {isAuthenticated ? (
          <button onClick={handleSignOut}>Sign Out</button>
        ) : (
          ""
        )}
      </div>
    </header>
  );
}
