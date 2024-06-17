import { useState, useEffect } from "react";
import Membership from "./Membership";

export default function MembershipList() {
  const [memberships, setMemberships] = useState([]);

  useEffect(() => {
    const getMemberships = async () => {
      let response = await fetch("http://localhost:3000/api/memberships");
      let data = await response.json();
      setMemberships(data);
    };
    getMemberships();
  }, []);

  return memberships.map((membership, index) => (
    <Membership
      key={membership._id + membership.type + membership.image}
      id={index + 1}
      _id={membership._id}
      type={membership.type}
      image={membership.image}
    />
  ));
}
