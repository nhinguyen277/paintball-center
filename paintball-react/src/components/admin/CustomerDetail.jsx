import { useState, useEffect } from "react";
import styles from "../../css/styles.module.css";
import { useParams, useNavigate } from "react-router-dom";

export default function CustomerDetail() {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const getCustomer = async () => {
      let response = await fetch(`http://localhost:3000/api/customer/${id}`);
      let data = await response.json();
      setDetail(data.customer); // Assuming data is an array and we're interested in the first element
    };
    getCustomer();
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/customer/delete/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete a customer");
      }
      navigate("/admin/customer"); // Redirect to booking list after deletion
      alert("Delete a customer successfully!");
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const editPage = async () => {
    navigate(`/admin/customer/edit/${detail.customer._id}`);
  };

  if (!detail) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.detail}>
        <h1 className={styles.scenarioTitle}>CUSTOMER INFORMATION</h1>
        <div id="detail" className={styles.detailContent}></div>
        <div className={styles.informationCus}>
          <div className={styles.booking}>
            <h2>Customer ID: {detail.customer._id}</h2>
            <h2>First Name: {detail.customer.firstname}</h2>
            <h2>Last Name: {detail.customer.lastname}</h2>
            <h2>Email: {detail.customer.email}</h2>
            <h2>Phone: {detail.customer.phone}</h2>
            <h2 style={{ display: "flex", alignItems: "center" }}>
              Membership Type:{" "}
              <img
                className={styles.imgMem}
                src={`/src/img/${detail.membership.image}`}
                alt={detail.membership.type}
              />
            </h2>
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
