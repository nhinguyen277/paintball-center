import styles from "../css/styles.module.css";
export default function About() {
  return (
    <>
      <div className={styles.container}>
        <h1>Contact Us</h1>
        <div className={styles.aboutContent}>
          <div className={styles.contactInfor}>
            <div className={styles.infor}>
              <h3>Email: epicpaintball@gmail.com</h3>
              <h3>Phone number: 437 555 6545</h3>
              <h3>Address: 100, St. Clair, Toronto, ON</h3>
            </div>
            <div className={styles.hours} style={{ marginTop: "10px" }}>
              <h3>Indoor Hours (Open 7 Days A Week)</h3>
              <h3>Monday-Friday: 11PM - 9PM</h3>
              <h3>Saturday-Sunday: 9AM - 10PM</h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
