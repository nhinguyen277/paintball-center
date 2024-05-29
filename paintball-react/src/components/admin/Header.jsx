import styles from "../../css/styles.module.css";
import logo from "../../img/logo.png";
import { Link } from "react-router-dom";

export default function Header() {
  //The return statement below returns a JSX element (one root element but you can have others inside the root element).
  return (
    <header id="header" className={styles.headContainer}>
      {/* This is JSX. */}
      <Link href="/">
        <img src={logo} className={styles.logo} alt="logo" />
      </Link>
      <h1 id="site-name" className={styles.siteName}>
        <a href="/">Epic Paintball Adventures</a>
      </h1>
    </header>
  );
}
