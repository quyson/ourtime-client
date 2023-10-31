import React, { useEffect } from "react";
import axios from "axios";
import Button from "./button";

const Home = () => {

    const Test = async () => {
        const response = await axios.get(`http://localhost:5169/user/lol`)
        if(response){
            console.log(response);
        };
    }
    return(
        <div>
            <div>
                <div>
                    <h1>This is Our Time.</h1>
                    <a href="/login">login</a>
                    <a href="/signup">register</a>
                    <Button handleClick={Test} text={"TEST"}/>
                </div>
            </div>
        </div>
    )
}

export default Home;