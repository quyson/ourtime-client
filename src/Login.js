import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./button";
import axios from "axios";

const Login = () => {

    const navigate = useNavigate();
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    const handleUsername = (e) => {
        setUsername(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleSignUp = (e) => {
        navigate("/signup");
    }

    const sendInfo = async (e) => {
        try
        {
            const response = await axios.post(`http://localhost:8000/DOTNETROUTE`, 
            {
                username: username,
                password: password,
            });
            localStorage.setItem("token", response.data.token);
            console.log("Successfully got token: ", response.data.token)
            navigate("/home");
        } catch(error)
        {
            throw error;
            console.log(error);
        }
    }
    
    return(
        <div className="d-flex flex-column vw-100 vh-100 align-items-center justify-content-center bg-secondary">
            <div className="row w-75">
                <div className="col-6">
                    <h1 className="display-3 text-primary mt-5">Our Time</h1>
                    <h3 className="mt=5">Reach the people you love at the touch of your fingertips</h3>
                </div>
                <div className="col-6">
                    <form className="d-flex flex-column container form-group bg-light p-5">
                        <label for={"username"} className="form-label">Username</label>
                        <input id="username" type="string" onChange={handleUsername} className="form-control"></input>
                        <label for={"password"} className="form-label">Password</label>
                        <input id="password" type="password" onChange={handlePassword} className="form-control"></input>
                        <Button handleClick={sendInfo} text={"Log In"} className={"btn btn btn-primary align-self-center btn-block w-100 mt-3"}/>
                        <div className="align-self-center mt-3">
                            <p>Forgot your password?</p>
                        </div>
                        <Button handleClick={handleSignUp} text={"Sign Up"} className={"btn btn btn-success align-self-center btn-block w-100"}/>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;