import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import signalRService from "./signalR";
import { useSelector } from "react-redux";
import Navbar from "./navbar";
import Peer from "simple-peer";

const VideoRoom = () => {
  const username = useSelector((state) => state.user && state.user.currentUser);
  const navigate = useNavigate();

  const userVideo = useRef();
  const peerVideo = useRef();

  const [localStream, setLocalStream] = useState(null);
  const [myConnectionId, setMyConnectionId] = useState(null);
  const [beingCalled, setBeingCalled] = useState(null);
  const [calling, setCalling] = useState(null);
  const [caller, setCaller] = useState(null);
  const [callerData, setCallerData] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [peerId, setPeerId] = useState(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      });

    signalRService
      .startConnection()
      .then((response) => {
        console.log("Connection to WebRTC has been created!");
        setMyConnectionId(signalRService.signalConnection.connectionId);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    signalRService.signalConnection.on("IncomingCall", (from, signalData) => {
      setBeingCalled(true);
      setCaller(from);
      setCallerData(signalData);
    });
    signalRService.signalConnection.on(
      "NewMessage",
      (peerUsername, message) => {
        const newMessage = `${peerUsername} - ${message}`;
        setMessages([...messages, newMessage]);
      }
    );
  }, [myConnectionId]);

  const callPeer = (peerId) => {
    setCalling(true);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: localStream,
    });
    peer.on("signal", (data) => {
      console.log("data", data);
      console.log("peerId", peerId);
      console.log("myid", myConnectionId);
      signalRService.signalConnection.invoke(
        "CallUser",
        peerId,
        JSON.stringify(data),
        myConnectionId
      );
    });

    peer.on("stream", (stream) => {
      if (peerVideo.current) {
        peerVideo.current.srcObject = stream;
      }
    });

    peer.on("close", () => {
      peer.destroy();
    });

    signalRService.signalConnection.on("CallAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
  };

  const acceptCall = () => {
    setCallAccepted(true);
    setCalling(false);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: localStream,
    });
    peer.on("signal", (data) => {
      signalRService.signalConnection.invoke(
        "AcceptCaller",
        JSON.stringify(data),
        caller
      );
    });
    peer.on("stream", (stream) => {
      peerVideo.current.srcObject = stream;
    });

    peer.on("close", () => {
      peer.destroy();
    });
    peer.signal(callerData);
  };

  const disconnect = () => {
    window.location.reload();
  };

  let mainView;

  if (callAccepted) {
    mainView = (
      <div className="card border border-dark">
        <h3 className="card-header text-center">Friend's Video</h3>
        <video
          playsInline
          autoPlay
          id="peerVideo"
          ref={peerVideo}
          style={{ width: "100%", height: "100%" }}
        ></video>
      </div>
    );
  } else if (beingCalled) {
    mainView = (
      <div>
        <h1>Friend is calling you</h1>
        <button className="btn btn-success" onClick={acceptCall}>
          <h1>Accept</h1>
        </button>
      </div>
    );
  } else if (calling) {
    mainView = (
      <div>
        <h1>Currently calling friend...</h1>
      </div>
    );
  } else {
    mainView = (
      <form className="form-group d-flex gap-2">
        <label style={{ color: "white" }} for={"peerId"}>
          Friend ID
        </label>
        <input
          name="peerId"
          id="peerId"
          onChange={(e) => setPeerId(e.target.value)}
        ></input>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => callPeer(peerId)}
        >
          Call
        </button>
      </form>
    );
  }

  return (
    <div
      style={{ paddingTop: "5rem", background: "black" }}
      className="d-flex flex-column align-items-center"
    >
      <Navbar />
      <div className="d-flex justify-content-center gap-3">
        <div className="card border border-dark">
          <h3 className="card-header text-center">{username}</h3>
          <video playsInline autoPlay id="userVideo" ref={userVideo}></video>
        </div>
        <div className="align-self-center">{mainView}</div>
      </div>
      <div className="my-5 d-flex gap-5 justify-content-center align-items-center bg-secondary p-3 rounded">
        <h3>My Connection ID</h3>
        {myConnectionId ? <div>{myConnectionId}</div> : null}
        {callAccepted ? (
          <button className="btn btn-danger" onClick={disconnect}>
            Disconnect
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default VideoRoom;
