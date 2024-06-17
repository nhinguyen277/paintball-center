import styles from "../../css/styles.module.css";
import { Link } from "react-router-dom";
export default function Coupon(props) {
  return (
    <tr>
      <th scope="row">{props.id}</th>
      <td>{props.title}</td>
      <td>{props.discount}%</td>
      <td>{props.startDate}</td>
      <td>{props.endDate}</td>
      <td className={styles.format}>
        <Link to={`/admin/coupon/${props._id}`}>View</Link>
      </td>
    </tr>
  );
}
