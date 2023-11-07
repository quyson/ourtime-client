import React, { useEffect } from "react";
import axios from "axios";
import Button from "./button";
import Navbar from "./navbar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { setCurrentUser } from "./redux/slices/userSlice";
import { useDispatch } from "react-redux";

const Home = () => {
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const currentToken = useSelector(
        (state) => state.token && state.user.currentToken
      );

    const handleVideoRoom = (e) => {
        navigate("/test");
    }

    const handleSignUp = (e) => {
        navigate('/signup')
    }

    useEffect(() => {
        let token;
        if(currentToken){
            token = currentToken;
        } else {
            token = localStorage.getItem("token");
        }
        axios.get(`http://localhost:5169/user/name`, {
                headers: { Authorization: `Bearer ${token}` },
              })
            .then((result) => {
                dispatch(setCurrentUser(result.data));
              });
    }, []);

    return(
        <div style={{paddingTop: "5rem"}}>
            <Navbar />
            <div className="container">
                <div className="row mt-5">
                    <div className="col-6">
                        <h1 className="display-3 font-weight-bold mb-5">Talk to Anyone All Over the <span className="text-primary">World</span></h1>
                        <h5><span className="font-weight-bold text-primary">OurTime</span> Technology is your loyal assistant in reaching anybody anywhere in the world. With the future of communication, you can meet anyone, anywhere, anytime without actually being there.</h5>
                        <div className="d-flex mt-5 w-100 gap-3">
                            <Button handleClick={handleVideoRoom} text={"Start a Call"} className={"btn btn-lg btn-success"}/>
                            <Button handleClick={handleSignUp} text={"Sign Up"} className={"btn btn-lg btn-primary"}/>
                        </div>
                    </div>
                    <div className="col-6 p-3">
                        <div class="card">
                            <img class="card-img-top" src="https://images.pexels.com/photos/1587014/pexels-photo-1587014.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Guy Screaming Into the Phone"></img>
                            <div class="card-body">
                                <h5 class="card-title">Cry Out With Joy</h5>
                                <p class="card-text">Imagine being stuck on an Island with shoddy 5G phone service. With OurTime, you can still call your mom to tell her you probably will not survive!</p>
                            </div>
                        </div>
                    </div>  
                </div>
            </div>
            <div className="bg-dark mt-5" style={{height: "30rem", width: "100%"}}>
                <div className="row w-100 h-100">
                    <div className="col-6">
                        <img className="rounded p-5" src="https://previews.123rf.com/images/sifotography/sifotography1707/sifotography170700142/82491443-business-man-stressed-and-nervous-from-to-many-work-calls-screaming-in-desperation-in-his-office.jpg" alt="Guy Surrounded By Tons of Phones" style={{maxHeight: "100%", maxWidth: "100%"}}></img>
                    </div>
                    <div className="col-6 d-flex flex-column justify-content-center">
                        <h1 className="display-3 text-light mb-5">Just <span className="font-weight-bold text-danger">One</span> source for all your phone needs!</h1>
                        <h6 className="text-light mt-5">Learn more about Our Time</h6>
                    </div>
                </div>
            </div>
            <div className="d-flex flex-column align-items-center mt-5"style={{height: "58rem"}}>
                <h1 className="display-5">Real-world stories of people working better together</h1>
                <div class="row mt-3 p-5">
                    <div class="col-sm-4">
                        <div class="card">
                            <img className="card-img-top" alt="Spider-Man" src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Tom_Holland_by_Gage_Skidmore.jpg" style={{width: "auto", height: "35rem"}}></img>
                            <div class="card-body">
                                <h5 class="card-title">Peter Parker</h5>
                                <p class="card-text">I am extremely poor! So having a phone service without all the pesky phone fees is a 5/5 spider-webs from me!</p>
                                <a href="#" class="btn btn-primary">Read More</a>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <div class="card">
                            <img className="card-img-top" src="https://upload.wikimedia.org/wikipedia/commons/b/b6/Queen_Elizabeth_II_in_March_2015.jpg" alt="Queen Elizabeth" style={{width: "auto", height: "35rem"}}></img>
                            <div class="card-body">
                                <h5 class="card-title">Queen Elizabeth</h5>
                                <p class="card-text">Technically, I am dead. But with Our Time, I can call my family from the underworld! The British Empire thanks you, Our Time!</p>
                                <a class="btn btn-primary">Read More</a>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <div class="card">
                            <img className="card-img-top" src="https://upload.wikimedia.org/wikipedia/commons/3/35/YuanEmperorAlbumGenghisPortrait.jpg" alt="Portrait of the Great Khan" style={{width: "auto", height: "35rem"}}></img>
                            <div class="card-body">
                                <h5 class="card-title">Ghenghis Khan</h5>
                                <p class="card-text">With Our Time Telecommunication Services, we don't need horse messengers anymore! Thanks for making conquering the world much easier!</p>
                                <a class="btn btn-primary">Read More</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-center w-100 mb-5"><button className="btn btn-outline-primary btn-lg">Get Inspired</button></div>
            <div className="d-flex flex-column justify-content-center align-items-center bg-primary gap-3" style={{width: "100%", height: "25rem"}}>
                <h1>Ready to Get Started?</h1>
                <div className="d-flex gap-3">
                    <Button handleClick={handleSignUp} text={"Sign Up"} className={"btn btn-lg btn-outline-light"}/>
                    <Button handleClick={handleSignUp} text={"Pricing"} className={"btn btn-lg btn-outline-warning"}/>
                </div>
            </div>
        </div>
       
    )
}

export default Home;