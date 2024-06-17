import { useState, useEffect } from "react";
import styles from "../../css/styles.module.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ScheduleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get("http://localhost:3000/verify").then((res) => {
      if (!res.data.status) {
        navigate("/admin");
      }
    });
  }, [navigate]);

  const [detail, setDetail] = useState({});
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [scenarios, setScenarios] = useState([]);
  const [formData, setFormData] = useState({
    scenarioId: "",
  });

  useEffect(() => {
    import("bootstrap/dist/css/bootstrap.min.css");
  }, []);

  useEffect(() => {
    const getDetail = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/schedule/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch schedule detail");
        }
        const data = await response.json();
        setDetail(data);

        if (data.date) {
          const dateTime = new Date(data.date);
          setDate(dateTime.toISOString().split("T")[0]);
          // Convert UTC time to local time for display
          const localTime = new Date(
            dateTime.getTime() - dateTime.getTimezoneOffset() * 60000
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
          setTime(localTime);
        }
      } catch (error) {
        console.error("Error fetching schedule detail:", error);
      }
    };

    const getAvailableScenarios = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/admin/scenarioSchedule/available/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch available scenarios");
        }
        const data = await response.json();
        setScenarios(data.scenarios);
      } catch (error) {
        console.error("Error fetching available scenarios:", error);
      }
    };

    getDetail();
    getAvailableScenarios();
  }, [id]);

  const handleDelete = async (scenarioId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/admin/scenarioSchedule/${id}/${scenarioId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to remove scenario from schedule");
      }

      alert("Scenario removed from schedule successfully!");
      // Reload the page to reflect the updated list of scenarios
      window.location.reload();

      // Update the detail and available scenarios after deletion
      const updatedDetail = { ...detail };
      updatedDetail.scenarios = updatedDetail.scenarios.filter(
        (item) => item._id !== scenarioId
      );
      setDetail(updatedDetail);

      const updatedScenarios = scenarios.filter(
        (scenario) => scenario._id !== scenarioId
      );
      setScenarios(updatedScenarios);
    } catch (error) {
      console.error("Error removing scenario from schedule:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleAddScenario = async (e) => {
    e.preventDefault();
    const { scenarioId } = formData;
    try {
      const response = await fetch(
        `http://localhost:3000/admin/scenarioSchedule/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            scenario_id: scenarioId,
            schedule_id: id,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add scenario to schedule");
      }
      const result = await response.json();
      alert(result.message);
      // Reload the page to reflect the updated list of scenarios
      window.location.reload();

      // Refresh available scenarios after addition
      const getAvailableScenarios = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/admin/scenarioSchedule/available/${id}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch available scenarios");
          }
          const data = await response.json();
          setScenarios(data.scenarios);
        } catch (error) {
          console.error("Error fetching available scenarios:", error);
        }
      };
      getAvailableScenarios();
    } catch (error) {
      console.error("Error adding scenario to schedule:", error);
    }
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.detail}>
        <h1 className={styles.scenarioTitle}>SCENARIO SCHEDULE INFORMATION</h1>
        <div id="detail" className={styles.detailContent}></div>
        <div className={styles.booking}>
          <h2>Date: {date}</h2>
          <h2>Time: {time}</h2>
        </div>
        <div className={styles.formFormat2}>
          {scenarios.length > 0 ? (
            <form onSubmit={handleAddScenario}>
              <div className={`mb-3 ${styles.m3}`}>
                <select
                  className={`form-select form-select-lg mb-3 ${styles.formColor}`}
                  aria-label="Large select example"
                  id="scenario"
                  name="scenarioId"
                  value={formData.scenarioId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a scenario</option>
                  {scenarios.map((scenario) => (
                    <option key={scenario._id} value={scenario._id}>
                      {scenario.title}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className={`btn btn-primary ${styles.btnForm}`}
                  style={{ marginBottom: "10px" }}
                >
                  Add
                </button>
              </div>
            </form>
          ) : (
            <p>All scenarios have been added to this schedule.</p>
          )}
        </div>
        <table
          className={`table table-dark table-striped ${styles.contentTable}`}
        >
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Scenario</th>
              <th scope="col">Players</th>
              <th scope="col">Time</th>
              <th scope="col">#</th>
            </tr>
          </thead>
          <tbody>
            {detail.scenarios?.map((scenarioItem) => (
              <tr key={scenarioItem._id}>
                <th scope="row">{scenarioItem._id}</th>
                <td>{scenarioItem.scenario.title}</td>
                <td>{scenarioItem.scenario.players}</td>
                <td>{scenarioItem.scenario.time}</td>
                <td className={styles.format}>
                  <div className={styles.action}>
                    <button
                      onClick={() => handleDelete(scenarioItem.scenario_id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
