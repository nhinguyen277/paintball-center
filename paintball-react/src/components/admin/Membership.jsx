import styles from "../../css/styles.module.css";
import { Link } from "react-router-dom";
export default function Membership(props) {
  return (
    <tr>
      <th scope="row">{props.id}</th>
      <td>{props.type}</td>
      <td>
        {" "}
        <img
          className={styles.imgMem}
          src={`/src/img/${props.image}`}
          alt={props.type}
        />
      </td>
      <td className={styles.format}>
        <Link to={`/admin/membership/${props._id}`}>View</Link>
      </td>
    </tr>
  );
}
