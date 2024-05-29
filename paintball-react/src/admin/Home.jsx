import styles from "../css/styles.module.css";
import SideNav from "../components/SideNav";

export default function Admin() {
  return (
    <>
      <div className={styles.adminContainer}>
        <SideNav />
        <div className={styles.pageContent}>
          <h1>WELCOME BACK ADMIN</h1>
          <h1>Start Your Work Now! </h1>
        </div>
      </div>
    </>
  );
}
