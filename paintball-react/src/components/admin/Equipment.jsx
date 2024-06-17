import styles from "../../css/styles.module.css";
import { Link } from "react-router-dom";
export default function Equipment(props) {
  return (
    <tr>
      <th scope="row">{props.id}</th>
      <td>{props.name}</td>
      <td>{props.quantity}</td>
      <td>
        {" "}
        <img
          className={styles.imgMem}
          src={`/src/img/${props.image}`}
          alt={props.type}
        />
      </td>
      <td className={styles.format}>
        <Link to={`/admin/equipment/${props._id}`}>View</Link>
      </td>
    </tr>
  );
}
