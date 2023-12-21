import React, { useState, useEffect, useRef } from "react";
import signalRService from "./signalR";
import { useSelector } from "react-redux";
import Navbar from "./navbar";
import CallingModal from "./callingModal";
import CallModal from "./callModal";
import Peer from "simple-peer";

const VideoRoom = () => {
  const username = useSelector((state) => state.user && state.user.currentUser);

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

  const callPeer = (peerId) => {
    setCalling(true);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: localStream,
    });

    peer.on("signal", (data) => {
      const callInformation = {
        userToCall: peerId,
        signalData: data,
        from: myConnectionId,
      };
      signalRService.signalConnection.invoke("callUser", callInformation);
    });

    peer.on("stream", (stream) => {
      if (peerVideo.current) {
        peerVideo.current.srcObject = stream;
      }
    });

    signalRService.signalConnection.on("callAccepted", (signal) => {
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
      signalRService.signalConnection.invoke("acceptCall", (data, caller));
    });
    peer.on("stream", (stream) => {
      peerVideo.current.srcObject = stream;
    });
    peer.signal(callerSignal);
  };

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

    signalRService.signalConnection.on("incoming call", (data) => {
      setBeingCalled(true);
      setCaller(data.from);
      setCallerData(data.signal);
    });
  }, []);

  signalRService.signalConnection.on("new message", (peerUsername, message) => {
    const newMessage = `${peerUsername} - ${message}`;
    setMessages([...messages, newMessage]);
  });

  let mainView;

  if (callAccepted) {
    mainView = (
      <Video
        playsInline
        ref={peerVideo}
        autoPlay
        style={{ width: "100%", height: "100%" }}
      />
    );
  } else if (beingCalled) {
    mainView = (
      <div>
        <h1>Friend is calling you</h1>
        <button onClick={acceptCall}>
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
      <form>
        <label for={"peerId"}>Friend ID</label>
        <input
          name="peerId"
          id="peerId"
          onChange={(e) => setPeerId(e.target.value)}
        ></input>
        <button onClick={callPeer(peerId)}>Call</button>
      </form>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="d-flex justify-content-center gap-3">
        <div className="card border border-dark">
          <h3 className="card-header text-center">{username}</h3>
          <video playsInline autoPlay id="userVideo" ref={userVideo}></video>
        </div>
        {mainView}
      </div>
      <div className="my-5 d-flex gap-5 justify-content-center align-items-center bg-secondary p-3 rounded">
        <h3>My Connection ID</h3>
        {myConnectionId ? <div>{myConnectionId}</div> : <button>Click</button>}
      </div>
    </div>
  );
};
