import { useState, useEffect } from "react";
import Customer from "./Customer";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const getCustomers = async () => {
      let response = await fetch("http://localhost:3000/api/customers");
      let data = await response.json();
      setCustomers(data);
    };
    getCustomers();
  }, []);

  return customers.map((customer, index) => (
    <Customer
      key={
        customer._id +
        customer.firstname +
        customer.lastname +
        customer.email +
        customer.phone
      }
      id={index + 1}
      _id={customer._id}
      firstname={customer.firstname}
      lastname={customer.lastname}
      email={customer.email}
      phone={customer.phone}
    />
  ));
}
