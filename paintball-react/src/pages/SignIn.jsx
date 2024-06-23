import styles from "../css/styles.module.css";
import "../css/signin.css";
import React from "react";
import { Link } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { IoIosLock } from "react-icons/io";
import { useState, useContext } from "react";
import Auth from "../customer/Auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const { setAuthenticatedUser } = useContext(Auth);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/signin", { email, password })
      .then((result) => {
        // console.log(result);
        if (result.data === "Success") {
          setAuthenticatedUser(result);
          navigate("/customer/dashboard");
        } else if (result.data === "The password is incorrect") {
          navigate("/signin");
          alert("please enter the right password");
        } else {
          navigate("/register");
          alert("You are not registered to this service");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
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
            {/* <div className="forgot">
              <label>
                <Link to="/forgot">Forgot password?</Link>
              </label>
            </div> */}
            <button type="submit">Sign In</button>
            <div className="register">
              <p>
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
