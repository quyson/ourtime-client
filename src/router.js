import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VideoRoom from "./VideoRoom";
import Login from "./Login";
import Signup from "./Signup";
import Home from "./Home";
import Test from "./test";

const Router = () => {
    return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/videoRoom" element={<VideoRoom />}></Route>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/test" element={<Test />}></Route>
          </Routes>
        </BrowserRouter>
    );
}

export default Router;