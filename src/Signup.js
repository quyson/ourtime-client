import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import Button from "./button";
import { useNavigate } from "react-router-dom";

const Signup = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState(null)
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [cPassword, setCPassword] = useState(null);

  const handleEmail = (e) => {
      setEmail(e.target.value);
  }

  const handleUsername = (e) => {
    setUsername(e.target.value);
  }

  const handleFirstName = (e) => {
    setFirstName(e.target.value);
  }

  const handleLastName = (e) => {
    setLastName(e.target.value);
  }

  const handlePassword = (e) => {
      setPassword(e.target.value);
  }

  const handleConfirmPassword = (e) => {
    setCPassword(e.target.value);
  }

  const handleSubmit = async (e) => {
    if (cPassword != password) {
      console.log("Passwords do not match");
      alert("Passwords do not match!");
      return;
    }
    try
    {
      const result = await axios.post("https://localhost:5169/user/register", 
      {
        Username: username,
        Email: email,
        Password: password,
        FirstName: firstName,
        LastName: lastName
      });
      if(result){
        console.log("Success!");
        navigate("/");
      }
    } catch(error)
    {
      console.log(error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 vw-100">
      <div className="h-75 w-50">
        <div className="d-flex flex-column gap-2 mb-3">
          <h5>Sign In to Our Time</h5>
          <button className="btn btn-sm btn-primary align-self-center w-100">Sign-in</button>
        </div>
        <form className="container">
          <div className="mb-5">
            <h4>Create a New Account</h4>
            <p>It's free and always will be.</p>
          </div>
          <div className="row">
            <div className="form-group col-6">
              <label for="email" className="form-label">
                  Email
              </label>
              <input
                  name="email"
                  id="email"
                  onChange={handleEmail}
                  required
                  className="form-control"
              ></input>
            </div>
            <div className="form-group col-6">
              <label for="username" className="form-label">
                Username
              </label>
              <input
                name="username"
                id="username"
                onChange={handleUsername}
                required
                placeholder="johntheman"
                className="form-control"
              ></input>
            </div>
          </div>
          <div className="row mt-1">
            <div className="form-group col-6">
              <label for="FirstName" className="form-label">
                First Name
              </label>
              <input
                name="FirstName"
                id="FirstName"
                onChange={handleFirstName}
                required
                placeholder="John"
                className="form-control"
              ></input> 
            </div>
            <div className="form-group col-6">
              <label for="LastName" className="form-label">
                Last Name
              </label>
              <input
                name="LastName"
                id="LastName"
                onChange={handleLastName}
                required
                placeholder="Smith"
                className="form-control"
              ></input>
            </div>
          </div>
          <div className="row mt-1">
            <div className="form-group col-6">
              <label for="password" className="form-label">
                Password
              </label>
              <input
                name="password"
                id="password"
                type={"password"}
                onChange={handlePassword}
                required
                placeholder="Password"
                className="form-control"
              ></input>
            </div>
            <div className="form-group col-6">
                <label for="cPassword" className="form-label">
                  Confirm Password
                </label>
                <input
                  name="cPassword"
                  id="cPassword"
                  type={"password"}
                  onChange={handleConfirmPassword}
                  required
                  placeholder="Confirm Password"
                  className="form-control"
                ></input>
            </div>
          </div>
          <Button handleClick={handleSubmit} text={"Register"} className={"btn btn btn-primary align-self-center btn-block w-100 mt-5"}/>
        </form>
      </div> 
    </div>
  );
};

export default Signup;