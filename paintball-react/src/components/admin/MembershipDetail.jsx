import { useState, useEffect } from "react";
import styles from "../../css/styles.module.css";
import { useParams, useNavigate } from "react-router-dom";

export default function CouponDetail() {
  const value = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState([]);
  useEffect(() => {
    const getDetail = async () => {
      let response = await fetch(
        `http://localhost:3000/api/membership/${value.id}`
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
        `http://localhost:3000/api/membership/delete/${value.id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete a coupon");
      }
      navigate("/admin/memberships"); // Redirect to booking list after deletion
      alert("Delete a membership successfully!");
    } catch (error) {
      console.error("Error deleting membership:", error);
    }
  };

  const editPage = async () => {
    navigate(`/admin/membership/edit/${detail._id}`);
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.detail}>
        <h1 className={styles.scenarioTitle}>MEMBERSHIP INFORMATION</h1>
        <div id="detail" className={styles.detailContent}></div>
        <div className={styles.informationMem}>
          <div className={styles.booking}>
            <h2>Membership ID: {detail._id}</h2>
            <h2>Type: {detail.type}</h2>
            <h2 className={styles.discount}>
              Image:{" "}
              <img
                className={styles.imgMem}
                src={`/src/img/${detail.image}`}
                alt={detail.title}
              />
            </h2>
          </div>

          <div className={styles.bookingbutton}>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={editPage}>Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
}
