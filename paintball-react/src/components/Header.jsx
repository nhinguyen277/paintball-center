import Nav from "./Nav";
import styles from "../css/styles.module.css";
import logo from "../img/logo.png";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  //The return statement below returns a JSX element (one root element but you can have others inside the root element).
  return (
    <header id="header" className={styles.headContainer}>
      {/* This is JSX. */}
      <a href="/">
        <img src={logo} className={styles.logo} alt="logo" />
      </a>
      <h1 id="site-name" className={styles.siteName}>
        <a href="/">Epic Paintball Adventures</a>
      </h1>
      <Nav />
      <div className={styles.log}>
        <ul>
          <li>
            <Link to="/signin">Sign In</Link>
          </li>
        </ul>
      </div>
      <div className={styles.menuToggle} onClick={() => setMenuOpen(!menuOpen)}>
        <button
          className={`${styles.hamBox} ${menuOpen ? styles.hamBoxOpen : ""}`}
        >
          {/* <img className={styles.ham} src={menu} alt="menu" /> */}
          <span
            className={`${styles.lineTop} ${menuOpen ? styles.spin : ""}`}
          ></span>
          <span
            className={`${styles.lineTwo} ${menuOpen ? styles.spin : ""}`}
          ></span>
          <span
            className={`${styles.lineBottom} ${menuOpen ? styles.spin : ""}`}
          ></span>
        </button>
      </div>
      <div
        id="hidden"
        className={styles.dropdown}
        style={{
          height: menuOpen ? "200px" : "0",
          marginTop: menuOpen ? "20px" : "0",
          // display: menuOpen ? "block" : "none",
          transitionDelay: menuOpen ? "0s" : "0s",
        }}
      >
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/explore">Explore</Link>
          </li>
          <li>
            <Link to="/about">About Us</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li className={styles.signRe}>
            <Link to="/signin">Sign In</Link>/
            <Link to="/register">Register</Link>
          </li>
          {/* <li></li> */}
        </ul>
      </div>
    </header>
  );
}
