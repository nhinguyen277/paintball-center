import { useState, useEffect } from "react";
import styles from "../../css/styles.module.css";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function CouponDetail() {
  const value = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState([]);
  useEffect(() => {
    const getDetail = async () => {
      let response = await fetch(
        `http://localhost:3000/api/coupon/${value.id}`
      );
      let data = await response.json();
      setDetail(data);
    };
    // console.log("param:"+value.id);
    getDetail(value.id);
  }, []);

  return (
    <div className={styles.adminContainer}>
      <div className={styles.detail}>
        <h1 className={styles.scenarioTitle}>COUPON INFORMATION</h1>
        <div id="detail" className={styles.detailContent}></div>
        <div className={styles.informationCoupon}>
          <div className={styles.booking}>
            <h2>Title: {detail.title}</h2>
            <h2>Code: {detail.code}</h2>
            <h2>Discount: {detail.discount}%</h2>
            <h2 className={styles.discount}>
              Image:{" "}
              <img
                className={styles.imgCoupon}
                src={`/src/img/${detail.image}`}
                alt={detail.title}
              />
            </h2>
            <h2>Start Date: {detail.start_date}</h2>
            <h2>End Date: {detail.end_date}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
