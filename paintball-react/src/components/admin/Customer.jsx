import styles from "../../css/styles.module.css";
import { Link } from "react-router-dom";
export default function Customer(props) {
  return (
    <tr>
      <th scope="row">{props.id}</th>
      <td>{props.firstname}</td>
      <td>{props.lastname}</td>
      <td>{props.email}</td>
      <td>{props.phone}</td>
      <td className={styles.format}>
        <Link to={`/admin/customer/${props._id}`}>View</Link>
      </td>
    </tr>
  );
}
