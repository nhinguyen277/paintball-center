import styles from "../../css/styles.module.css";
import logo from "../../img/logo.png";
import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer id="footer" className={styles.adminfooter}>
      {/* <div className={styles.footerContainer2}>
        <div className={styles.logoSide}>
          <Link href="/">
            <img src={logo} className={styles.logoFooter2} alt="logo" />
          </Link>
        </div>
      </div> */}
      <p>&copy; By Nhi Nguyen, 2024.</p>
    </footer>
  );
}
