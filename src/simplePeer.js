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
  const [messages, setMessages] = useState([]);

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

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
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
};
