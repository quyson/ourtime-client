import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VideoRoom from "./VideoRoom";

const Router = () => {
    return (
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/check" element={<Check />}></Route>
            <Route path="/videoRoom" element={<VideoRoom />}></Route>
            <Route path="/" element={<Home />}></Route>
          </Routes>
        </BrowserRouter>
    );
}

export default Router;