import { useState, useEffect } from "react";
import styles from "../../css/styles.module.css";
import { useParams, useNavigate } from "react-router-dom";

export default function StaffDetail() {
  const value = useParams();
  const [detail, setDetail] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const getStaff = async () => {
      let response = await fetch(`http://localhost:3000/api/staff/${value.id}`);
      let data = await response.json();
      setDetail(data); // Assuming data is an array and we're interested in the first element
    };
    getStaff();
  }, [value.id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/staff/delete/${value.id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete a staff");
      }
      navigate("/admin/staff"); // Redirect to booking list after deletion
      alert("Delete a staff successfully!");
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  const editPage = async () => {
    navigate(`/admin/staff/edit/${detail._id}`);
  };

  if (!detail) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.detail}>
        <h1 className={styles.scenarioTitle}>STAFF INFORMATION</h1>
        <div id="detail" className={styles.detailContent}></div>
        <div className={styles.informationStaff}>
          <div className={styles.booking}>
            <h2>Staff ID: {detail._id}</h2>
            <h2>First Name: {detail.firstname}</h2>
            <h2>Last Name: {detail.lastname}</h2>
            <h2>Email: {detail.email}</h2>
            <h2>Phone: {detail.phone}</h2>
            <h2>Address: {detail.address}</h2>
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
