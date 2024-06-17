import { useState, useEffect } from "react";
import Schedule from "./Schedule";

export default function ScheduleList() {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const getSchedules = async () => {
      let response = await fetch("http://localhost:3000/api/schedule");
      let data = await response.json();
      setSchedules(data);
    };
    getSchedules();
  }, []);

  return schedules.map((schedule, index) => (
    <Schedule
      key={schedule._id + schedule.date + schedule.time}
      _id={schedule._id}
      id={index + 1}
      date={schedule.date}
      time={schedule.time}
    />
  ));
}
