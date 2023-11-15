import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToken } from "./redux/slices/tokenSlice";
import { setCurrentUser } from "./redux/slices/userSlice";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = (e) => {
    dispatch(setCurrentUser(null));
    dispatch(setToken(null));
    localStorage.setItem("token", null);
    console.log("Logged Out");
    navigate("/");
  };

  return (
    <div>
      <button onClick={handleClick}>Log Out</button>
    </div>
  );
};

export default Logout;
