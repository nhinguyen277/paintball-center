import styles from "../../css/styles.module.css";
import { Link } from "react-router-dom";
export default function Booking(props) {
  return (
    <tr>
      <th scope="row">{props._id}</th>
      <td>{props.title}</td>
      <td>{props.date}</td>
      <td>{props.time}</td>
      <td className={styles.format}>
        <Link to={`/admin/booking/${props.id}`}>View</Link>
      </td>
    </tr>
  );
}
