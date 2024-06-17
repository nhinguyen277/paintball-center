import { useState, useEffect } from "react";
import Staff from "./Staff";

export default function StaffList() {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const getStaff = async () => {
      let response = await fetch("http://localhost:3000/api/staff");
      let data = await response.json();
      setStaff(data);
    };
    getStaff();
  }, []);

  return staff.map((staff, index) => (
    <Staff
      key={
        staff._id +
        staff.firstname +
        staff.lastname +
        staff.email +
        staff.phone +
        staff.address
      }
      id={index + 1}
      _id={staff._id}
      firstname={staff.firstname}
      lastname={staff.lastname}
      email={staff.email}
      phone={staff.phone}
      address={staff.address}
    />
  ));
}
