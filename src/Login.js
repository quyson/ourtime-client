import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./button";
import axios from "axios";

const Login = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const handleEmail = (e) => {
        setEmail(e.target.value);
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
            console.log(email);
            console.log(password);
            const response = await axios.post(`http://localhost:8000/DOTNETROUTE`, 
            {
                email: email,
                password: password,
            });
            localStorage.setItem("token", response.data.token);
            console.log("Successfully got token: ", response.data.token)
            navigate("/");
        } catch(error)
        {
            console.log(error);
        }
    }
    
    return(
        <div>
            <form>
                <label for={"email"}>Email</label>
                <input id="email" type="email" onChange={handleEmail}></input>
                <label for={"password"}>Password</label>
                <input id="password" type="password" onChange={handlePassword}></input>
                <Button handleClick={sendInfo} text={"Log In"} />
                <Button handleClick={handleSignUp} text={"Sign Up"} />
            </form>
        </div>
    )
}

export default Login;