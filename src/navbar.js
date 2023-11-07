import React from "react";
import { useSelector } from "react-redux";
import Logout from "./logout";

const Navbar = () => {
    const currentName = useSelector(
        (state) => state.user && state.user.currentName
      );

    return(
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark justify-content-between px-3 fixed-top">
                <a class="navbar-brand" href="/home">OurTime</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div class="navbar-nav">
                        <a class="nav-item nav-link active">Home <span class="sr-only">(current)</span></a>
                        <a class="nav-item nav-link">Mission</a>
                        <a class="nav-item nav-link">Contact Us</a>
                        <a class="nav-item nav-link disabled">Coming Soon</a>
                     </div>
                </div>
                <div className="p-2 mx-3 bg-light">{currentName}</div>
                <form className="d-flex gap-3 w-25">
                    <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"></input>
                    <button class="btn btn-outline-success my-2 my-sm-0" type="button">Search</button>
                </form>
                <Logout />
            </nav>
        
    )
}

export default Navbar;