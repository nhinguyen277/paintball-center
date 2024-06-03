import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Add() {
  useEffect(() => {
    // Dynamically import Bootstrap CSS
    import("bootstrap/dist/css/bootstrap.min.css");
  }, []);
  const [firstname, setFname] = useState();
  const [lastname, setLname] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [phone, setNumber] = useState();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/register", {
        firstname,
        lastname,
        email,
        password,
        phone,
      })
      .then((result) => {
        console.log(result);
        navigate("/signin");
      })
      .catch((err) => console.log(err));
  };

  return <></>;
}
