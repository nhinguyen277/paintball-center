import styles from "../css/styles.module.css";
import "../css/signin.css";
import React from "react";
import { Link } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { IoIosLock } from "react-icons/io";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/admin", { email, password })
      .then((result) => {
        if (result.data === "Success") {
          navigate("/admin/dashboard");
          window.location.reload(); // Force a reload to update the state in the Header component
        } else if (result.data === "The password is incorrect") {
          alert("Please enter the correct password");
        } else {
          alert("You are not registered for this service");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="signIn">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Sign In</h1>
          <div className="inputBox">
            <input
              type="email"
              placeholder="Email"
              id="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FiUser className="icon" />
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
            <IoIosLock className="icon" />
          </div>
          <button type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
}
