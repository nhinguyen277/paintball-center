import styles from "../css/styles.module.css";
import logo from "../img/logo.png";
import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer id="footer" className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.logoSide}>
          <a href="/">
            <img src={logo} className={styles.logoFooter} alt="logo" />
          </a>
        </div>
        <div className={styles.navFooter}>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/scenarios">Scenarios</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>
        <div className={styles.contactFooter}>
          <h2>Contact Us</h2>
          <div className={styles.contactInfor}>
            <div className={styles.infor}>
              <h5>Email: epicpaintball@gmail.com</h5>
              <h5>Phone number: 437 555 6545</h5>
              <h5>Address: 100, St. Clair, Toronto, ON</h5>
            </div>
            <div className={styles.hours}>
              <h5>Indoor Hours (Open 7 Days A Week)</h5>
              <h5>Monday-Friday: 11PM - 9PM</h5>
              <h5>Saturday-Sunday: 9AM - 10PM</h5>
            </div>
          </div>
        </div>
      </div>
      <p>&copy; By Nhi Nguyen, 2024.</p>
    </footer>
  );
}
