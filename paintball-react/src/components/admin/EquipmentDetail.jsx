import { useState, useEffect } from "react";
import styles from "../../css/styles.module.css";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function EquipmentDetail() {
  const value = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState([]);
  useEffect(() => {
    const getDetail = async () => {
      let response = await fetch(
        `http://localhost:3000/api/equipment/${value.id}`
      );
      let data = await response.json();
      setDetail(data);
    };
    getDetail(value.id);
  }, []);

  const formatText = (text) => {
    if (typeof text !== "string") return "";
    // Insert <strong> tags around "Rules" and "Variations"
    return text
      .replace(/Rules/g, "<strong style='font-size:30px' >Rules</strong>")
      .replace(
        /Variations/g,
        "<strong style='font-size:30px'>Variations</strong>"
      )
      .replace(/Supplies/g, "<strong style='font-size:30px'>Supplies</strong>");
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/equipment/delete/${value.id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete equipment");
      }
      navigate("/admin/equipment"); // Redirect to booking list after deletion
      alert("Delete equipment successfully!");
    } catch (error) {
      console.error("Error deleting equipment:", error);
    }
  };

  const editPage = async () => {
    navigate(`/admin/equipment/edit/${detail._id}`);
  };

  return (
    <div className={styles.detail}>
      <h1 className={styles.scenarioTitle}>{detail.name}</h1>
      <div id="detail" className={styles.detailContent}>
        <img
          className={styles.imgDetail}
          src={`/src/img/${detail.image}`}
          alt={detail.title}
        />
        <h3>Quantity: {detail.quantity}</h3>
        <p
          style={{
            whiteSpace: "pre-line",
            padding: "20px",
            // fontFamily: "monospace",
          }}
          dangerouslySetInnerHTML={{ __html: formatText(detail.description) }}
        />
        {/* {detail.description} */}
        {/* </p> */}
        <div className={styles.bookingbutton}>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={editPage}>Edit</button>
          {/* <Link to={`/admin/booking/edit/${detail._id}`}>Edit</Link> */}
        </div>
      </div>
    </div>
  );
}
