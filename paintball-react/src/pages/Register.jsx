import "../css/signin.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
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

  return (
    <>
      <div className="signIn">
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <h1>Register</h1>
            <div className="inputBox">
              <input
                type="text"
                placeholder="First Name"
                id="firstname"
                name="firstname"
                onChange={(e) => setFname(e.target.value)}
                required
              />
            </div>
            <div className="inputBox">
              <input
                type="text"
                placeholder="Last Name"
                id="lastname"
                name="lastname"
                onChange={(e) => setLname(e.target.value)}
                required
              />
            </div>
            <div className="inputBox">
              <input
                type="email"
                placeholder="Email"
                id="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="inputBox">
              <input
                type="password"
                placeholder="Password"
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="inputBox">
              <input
                type="text"
                placeholder="Phone Number"
                id="phone"
                name="phone"
                maxLength="11"
                onChange={(e) => setNumber(e.target.value)}
                required
              />
            </div>
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </>
  );
}
