import { Link, useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import styles from "../../css/styles.module.css";
export default function Schedule(props) {
  const navigate = useNavigate();
  useEffect(() => {
    // Dynamically import Bootstrap CSS
    import("bootstrap/dist/css/bootstrap.min.css");
  }, []);
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/schedule/delete/${props._id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete a schedule");
      }
      navigate("/admin/schedules"); // Redirect to booking list after deletion
      alert("Delete a schedule successfully!");
      // Reload the page to reflect the updated list of scenarios
      window.location.reload();
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };

  const editPage = async () => {
    navigate(`/admin/schedule/edit/${props._id}`);
  };

  const viewPage = async () => {
    navigate(`/admin/schedule/${props._id}`);
  };
  return (
    <tr>
      <th scope="row">{props.id}</th>
      <td>{props.date}</td>
      <td>{props.time}</td>
      <td className={styles.format}>
        <div className={styles.bookingbutton}>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={editPage}>Edit</button>
          <button onClick={viewPage}>View</button>
        </div>
      </td>
    </tr>
  );
}
