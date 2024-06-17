import { useState, useEffect } from "react";
import Equipment from "./Equipment";

export default function EquipmentList() {
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    const getEquipment = async () => {
      let response = await fetch("http://localhost:3000/api/equipment");
      let data = await response.json();
      setEquipment(data);
    };
    getEquipment();
  }, []);

  return equipment.map((equip, index) => (
    <Equipment
      key={equip._id + equip.name + equip.quantity + equip.image}
      id={index + 1}
      _id={equip._id}
      name={equip.name}
      quantity={equip.quantity}
      image={equip.image}
    />
  ));
}
