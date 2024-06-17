import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../css/styles.module.css";

export default function Scenario(props) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/scenarios/delete/${props.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete scenario");
      }

      // Navigate to /admin/scenarios after successful deletion
      navigate("/admin/scenarios");
      // Reload the page to reflect the updated list of scenarios
      window.location.reload();
    } catch (error) {
      console.error("Error deleting scenario:", error.message);
      // Optionally, you can show a user-friendly error message or handle it in your UI
    }
  };

  const editPage = () => {
    navigate(`/admin/scenarios/edit/${props.id}`);
  };

  return (
    <div id={`scenario-${props.id}`} className={styles.scenario}>
      <Link to={`/admin/scenarios/${props.id}`}>
        <img
          className={styles.scenImg}
          src={`../../src/img/${props.image}`} // Adjusted image source path
          alt={props.title}
        />
      </Link>
      <h2>{props.title}</h2>
      <p>{props.description}</p>
      <div className={styles.buttonBar}>
        <button className={styles.button} onClick={editPage}>
          Edit
        </button>
        <button className={styles.button} onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
