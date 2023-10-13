import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState(null)
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [cPassword, setCPassword] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cPassword != password) {
      console.log("Passwords do not match");
      return;
    }
    const result = await axios.post("http://localhost:5169/api/user", {
      Name: username,
      Email: email,
      Password: password
    });

    if (result.data.success) {
      navigate("/login");
    }
  };

  const handleTest = async (e) => {
    const result = await axios.post("http://localhost:5169/api/user/test", {fuck: "fuck"})
  }

  return (
    <div
      className="container-fluid"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="form-group d-flex flex-column justify-content-center align-items-center"
        style={{ height: "50vh", width: "30vw" }}
      >
        <h2>Register</h2>
        <h5>Join OurTime.</h5>
        <div className="row mb-3">
          <div className="col">
            <label for="email" className="sr-only">
              Email
            </label>
            <input
              name="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
            ></input>
          </div>
        </div>
        <label for="username" className="sr-only">
          Username
        </label>
        <input
          name="username"
          id="username"
          onChange={(e) => setUsername(e.target.value)}
          className="form-control mb-3"
          required
          placeholder="Username"
        ></input>
        <div className="row mb-3">
          <div className="col">
            <label for="password" className="sr-only">
              Password
            </label>
            <input
              name="password"
              id="password"
              type={"password"}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
              placeholder="Password"
            ></input>
          </div>
          <div className="col">
            <label for="cPassword" className="sr-only">
              Confirm Password
            </label>
            <input
              name="cPassword"
              id="cPassword"
              type={"password"}
              onChange={(e) => setCPassword(e.target.value)}
              className="form-control"
              required
              placeholder="Confirm Password"
            ></input>
          </div>
        </div>
        <button className="btn btn-primary btn-block">Register</button>
      </form>
      <button className="btn btn-primary btn-block" onClick={(e) => handleTest()}>Test</button>
    </div>
  );
};

export default Signup;