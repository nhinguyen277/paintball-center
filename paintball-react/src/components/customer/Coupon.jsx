import styles from "../../css/styles.module.css";
export default function Coupon(props) {
  return (
    <div className={styles.coupon}>
      <img
        className={styles.imgCoupon}
        src={`/src/img/${props.image}`}
        alt={props.title}
      />
      <div>
        <p>Code: {props.code}</p>
        <p>Start Date: {props.startDate}</p>
        <p>Expire Date: {props.endDate}</p>
      </div>
    </div>
  );
}
