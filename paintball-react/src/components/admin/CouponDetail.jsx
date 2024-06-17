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

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/coupon/delete/${value.id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete a coupon");
      }
      navigate("/admin/coupons"); // Redirect to booking list after deletion
      alert("Delete a coupon successfully!");
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  const editPage = async () => {
    navigate(`/admin/coupon/edit/${detail._id}`);
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.detail}>
        <h1 className={styles.scenarioTitle}>COUPON INFORMATION</h1>
        <div id="detail" className={styles.detailContent}></div>
        <div className={styles.informationCoupon}>
          <div className={styles.booking}>
            <h2>Coupon ID: {detail._id}</h2>
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

          <div className={styles.bookingbutton}>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={editPage}>Edit</button>
            {/* <Link to={`/admin/booking/edit/${detail._id}`}>Edit</Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}
