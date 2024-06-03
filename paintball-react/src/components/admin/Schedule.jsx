import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import styles from "../../css/styles.module.css";
export default function Schedule(props) {
  useEffect(() => {
    // Dynamically import Bootstrap CSS
    import("bootstrap/dist/css/bootstrap.min.css");
  }, []);
  return (
    <tr>
      <th scope="row">{props.id}</th>
      <td>{props.date}</td>
      <td>{props.time}</td>
      <td className={styles.format}>
        <Link to={`/schedule/edit/${props.id}`}>Edit</Link>
        <Link to={`/schedule/delete/${props.id}`}>Delete</Link>
      </td>
    </tr>
  );
}
