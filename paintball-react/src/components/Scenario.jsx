import styles from "../css/styles.module.css";
import { Link } from "react-router-dom";
export default function Scenario(props) {
  return (
    <Link to={`/scenarios/${props.id}`}>
      <div id="scenario" className={styles.scenario}>
        <img
          className={styles.scenImg}
          src={`../src/img/${props.image}`}
          alt={props.title}
        />{" "}
        <h2>{props.title}</h2>
        <p>{props.description}</p>
        <div className={styles.buttonBar}>
          <Link to={`/scenario/edit/${props.id}`}>Edit</Link>
          <Link to={`/scenario/delete/${props.id}`}>Delete</Link>
        </div>
      </div>
    </Link>
  );
}
