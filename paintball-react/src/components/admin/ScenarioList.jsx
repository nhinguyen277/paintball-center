import { useState, useEffect } from "react";
import Scenario from "./Scenario";

export default function ScenarioList() {
  const [scenarios, setScenarios] = useState([]);

  useEffect(() => {
    const getScenarios = async () => {
      let response = await fetch("http://localhost:3000/api/scenarios");
      let data = await response.json();
      setScenarios(data);
    };
    getScenarios();
  }, []);

  return scenarios.map((scenario) => (
    <Scenario
      key={
        scenario._id +
        scenario.title +
        scenario.players +
        scenario.time +
        scenario.description +
        scenario.image
      }
      id={scenario._id}
      title={scenario.title}
      players={scenario.players}
      time={scenario.time}
      description={scenario.description}
      image={scenario.image}
    />
  ));
}
