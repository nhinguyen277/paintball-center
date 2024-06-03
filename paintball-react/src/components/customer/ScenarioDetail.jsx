import { useState, useEffect } from "react";
import styles from "../../css/styles.module.css";
import { useParams, Link } from "react-router-dom";

export default function ScenarioDetail() {
  const value = useParams();
  const [detail, setDetail] = useState([]);
  useEffect(() => {
    const getDetail = async () => {
      let response = await fetch(
        `http://localhost:3000/api/scenarios/${value.id}`
      );
      let data = await response.json();
      setDetail(data);
    };
    // console.log("param:"+value.id);
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

  return (
    <div className={styles.detail}>
      <h1 className={styles.scenarioTitle}>{detail.title}</h1>
      <div id="detail" className={styles.detailContent}>
        <img
          className={styles.imgDetail}
          src={`/src/img/${detail.image}`}
          alt={detail.title}
        />
        <h3>Number Of Player: {detail.players}</h3>
        <h3>Duration: {detail.time}</h3>
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
        <h3 className={styles.bookingLink}>
          Are you interested? <Link to="../booking">Booking</Link>
        </h3>
      </div>
    </div>
  );
}
