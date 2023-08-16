import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const checkEmailValidity = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(com|net)$/;
        return emailRegex.test(email);
    }

    const sendInfo = async (e) => {
        e.preventDefault();
        let valid = checkEmailValidity(email);
        if(!valid){
            alert("Invalid Email!")
            return
        };
        const response = await axios.post(`http://localhost:8000/DOTNETROUTE`, {
        email: email,
        password: password,
        });
        localStorage.setItem("token", response.data.token);
        if (response.data.success) {
            navigate("/");
        };
    }
    return(
        <div>
            <div>
                <form onSubmit={sendInfo}>
                    <label for={"email"}>Email</label>
                    <input id="email" type="email" onChange={handleEmail}></input>
                    <label for={"password"}>Password</label>
                    <input id="password" type="password" onChange={handlePassword}></input>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login;