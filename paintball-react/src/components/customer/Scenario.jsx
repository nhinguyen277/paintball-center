import styles from "../../css/styles.module.css";
import { Link } from "react-router-dom";
export default function Scenario(props) {
  return (
    <div id="scenario" className={styles.scenario}>
      <img
        className={styles.scenImg}
        src={`../src/img/${props.image}`}
        alt={props.title}
      />{" "}
      <h2>{props.title}</h2>
      <p>{props.description}</p>
      <div className={`${styles.buttonBar} ${styles.viewButton}`}>
        <Link to={`${props.id}`}>View</Link>
      </div>
    </div>
  );
}
