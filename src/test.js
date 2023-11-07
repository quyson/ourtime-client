import React, { useEffect, useState } from "react";
import axios from "axios";

const Test = () => {

    const [name, setName] = useState(null)

   
    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get(`http://localhost:5169/user/name`, {
                headers: { Authorization: `Bearer ${token}` },
              })
            .then((result) => {
                setName(result.data);
              });
    }, []);
        
 

    return(
        <div>{name}</div>
    )
}

export default Test;