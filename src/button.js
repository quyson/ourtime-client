import React from "react";

const Button = ({handleClick, text, className}) => {
    return(
        <div>
            <button type="button" onClick={handleClick} className={className}>{text}</button>
        </div>
    )
}

export default Button;