import React, { useState, useEffect, useRef } from "react";
import signalRService from "./signalR";
import { useSelector } from "react-redux";
import Navbar from "./navbar";
import CallingModal from "./callingModal";
import CallModal from "./callModal";

function VideoRoom() {
  const username = useSelector((state) => state.user && state.user.currentUser);

  const [localStream, setLocalStream] = useState(null);
  const globalPeerConnection = useRef(null);
  const callerInfo = useRef(null);
  const [beingCalled, setBeingCalled] = useState(false);
  const [calling, setCalling] = useState(false);
  const [myConnectionId, setMyConnectionId] = useState(null);
  const [peerId, setPeerId] = useState("");
  const [connected, setConnected] = useState(false);
  const [friendId, setFriendId] = useState(null);

  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  const createOffer = async (configuration, peerId) => {
    let peerConnection = new RTCPeerConnection(configuration);

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });
    }

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    let iceOffer = JSON.stringify(peerConnection.localDescription);

    peerConnection.onicecandidate = async (event) => {
      let iceCandidate;
      if (event.candidate) {
        iceCandidate = JSON.stringify(event.candidate);
        signalRService.signalConnection.invoke(
          "SendIceCandidate",
          peerId,
          username,
          iceCandidate
        );
      }
    };
    globalPeerConnection.current = peerConnection;
    signalRService.signalConnection.invoke("Offer", peerId, iceOffer, username);
    setCalling(true);
  };

  const createAnswer = async (callerId, offer, callerUsername) => {
    setConnected(true);
    let peerConnection = new RTCPeerConnection(configuration);

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });
    }

    if (connected) {
      let remoteStream = new MediaStream();
      let remoteVideo = document.querySelector("#remoteVideo");
      remoteVideo.srcObject = remoteStream;

      peerConnection.ontrack = async (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
      };
    }

    await peerConnection.setRemoteDescription(JSON.parse(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    let iceAnswer = JSON.stringify(peerConnection.localDescription);

    peerConnection.onicecandidate = async (event) => {
      let iceCandidate;
      if (event.candidate) {
        iceCandidate = JSON.stringify(event.candidate);
        signalRService.signalConnection.invoke(
          "SendIceCandidate",
          callerId,
          username,
          iceCandidate
        );
      }
    };

    globalPeerConnection.current = peerConnection;
    signalRService.signalConnection.invoke(
      "Answer",
      callerId,
      iceAnswer,
      username
    );
    setBeingCalled(false);
    setFriendId(callerId);
  };

  const declineCall = (peerId) => {
    /*const callModal = new Modal(document.getElementById("callModal"));
    if (typeof callModal != "undefined" && callModal != null) {
      callModal.hide();
    }
    const callingModal = new Modal(document.getElementById("#callingModal"));
    if (typeof callingModal != "undefined" && callingModal != null) {
      callingModal.hide();
    }*/
    console.log("fu");
    setCalling(false);
    setBeingCalled(false);
    signalRService.signalConnection.invoke("Decline", peerId);
  };

  const handleDeclineCall = () => {
    console.log("User declined call!");
    if (callerInfo.current) {
      callerInfo.current = null;
    }
    /*
    const callModal = new Modal(document.getElementById("callModal"));
    if (typeof callModal != "undefined" && callModal != null) {
      callModal.hide();
    }
    const callingModal = new Modal(document.getElementById("#callingModal"));
    if (typeof callingModal != "undefined" && callingModal != null) {
      callingModal.hide();
    }*/
    setCalling(false);
    setBeingCalled(false);

    if (globalPeerConnection.current != null) {
      globalPeerConnection.current = null;
      globalPeerConnection = null;
    }
  };

  const handleAnswer = async (calleeId, answer, calleeUsername) => {
    setFriendId(calleeId);
    setConnected(true);
    if (connected) {
      let remoteStream = new MediaStream();
      let remoteVideo = document.querySelector("#remoteVideo");
      remoteVideo.srcObject = remoteStream;

      globalPeerConnection.current.ontrack = async (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
      };
    }

    if (!globalPeerConnection.current.currentRemoteDescription) {
      await globalPeerConnection.current.setRemoteDescription(
        JSON.parse(answer)
      );
    }
  };

  const handleIceCandidate = (iceCandidate) => {
    console.log(iceCandidate);
    if (globalPeerConnection.current) {
      const candidate = new RTCIceCandidate(JSON.parse(iceCandidate));
      console.log("adding candidate", candidate);
      globalPeerConnection.current
        .addIceCandidate(candidate)
        .then(() => {
          console.log("ICE candidate added successfully");
        })
        .catch((error) => {
          console.error("Error adding ICE candidate:", error);
        });
    }
  };

  const disconnect = (peerId) => {
    console.log(globalPeerConnection.current.connectionState);
    globalPeerConnection.current.forEach((peer) => {
      // Close each track
      peer.getTracks().forEach((track) => {
        track.stop();
      });

      // Remove all event listeners
      peer.ontrack = null;
      peer.onremovetrack = null;
      peer.onicecandidate = null;
      peer.oniceconnectionstatechange = null;
      peer.onsignalingstatechange = null;

      // Close the connection
      peer.close();
    });
    globalPeerConnection.current = null;
    setConnected(false);
    setFriendId(false);
    if (callerInfo.current) {
      callerInfo.current = null;
    }
    signalRService.signalConnection.invoke("Disconnect", peerId);
  };

  const handleDisconnected = () => {
    console.log(globalPeerConnection.current.connectionState);
    globalPeerConnection.current.forEach((peer) => {
      // Close each track
      peer.getTracks().forEach((track) => {
        track.stop();
      });

      // Remove all event listeners
      peer.ontrack = null;
      peer.onremovetrack = null;
      peer.onicecandidate = null;
      peer.oniceconnectionstatechange = null;
      peer.onsignalingstatechange = null;

      // Close the connection
      peer.close();
    });
    globalPeerConnection.current = null;
    setConnected(false);
    setFriendId(false);
    if (callerInfo.current) {
      callerInfo.current = null;
    }
  };

  //handle Peer ID
  const handlePeerId = (e) => {
    setPeerId(e.target.value);
  };

  //Listens for sdpOffers
  useEffect(() => {
    if (myConnectionId) {
      signalRService.signalConnection.on(
        "ReceiveOffer",
        (callerId, offer, callerUsername) => {
          callerInfo.current = {
            callerId: callerId,
            offer: offer,
            callerUsername: callerUsername,
          };
          setBeingCalled(true);
        }
      );
    }
  }, [myConnectionId]);

  //Listens for sdpAnswers
  useEffect(() => {
    if (myConnectionId) {
      signalRService.signalConnection.on(
        "ReceiveAnswer",
        (calleeId, answer, calleeUsername) => {
          setCalling(false);
          handleAnswer(calleeId, answer, calleeUsername);
        }
      );
    }
  }, [myConnectionId]);

  //Listens for IceConnection
  useEffect(() => {
    if (myConnectionId) {
      signalRService.signalConnection.on("ReceiveIceCandidate", (candidate) => {
        handleIceCandidate(candidate);
      });
    }
  }, [myConnectionId]);

  //Listens for declined call
  useEffect(() => {
    if (myConnectionId) {
      signalRService.signalConnection.on("Declined", (message) => {
        console.log(message);
        handleDeclineCall(message);
      });
    }
  }, []);

  //Listens for End Call
  useEffect(() => {
    if (myConnectionId) {
      signalRService.signalConnection.on("Disconnected", (message) => {
        console.log(message);
        handleDisconnected();
      });
    }
  }, []);

  useEffect(() => {
    const myLocalVideo = document.querySelector("#localVideo");
    navigator.mediaDevices
      .getUserMedia({ video: { width: 640, height: 480 }, audio: true })
      .then((stream) => {
        myLocalVideo.srcObject = stream;
        setLocalStream(stream);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, []);

  useEffect(() => {
    signalRService
      .startConnection()
      .then((response) => {
        console.log("Connection to WebRTC has been created!");
        setMyConnectionId(signalRService.signalConnection.connectionId);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div style={{ paddingTop: "5rem" }}>
      <Navbar />
      {calling ? (
        <CallModal
          declineCall={declineCall}
          peerId={peerId}
          calling={calling}
        />
      ) : null}
      {beingCalled ? (
        <CallingModal
          createAnswer={createAnswer}
          callerInfo={callerInfo}
          declineCall={declineCall}
        />
      ) : null}
      <div className="d-flex justify-content-center gap-3">
        <div className="card border border-dark">
          <h3 className="card-header text-center">Your Video</h3>
          <video playsInline autoPlay id="localVideo"></video>
        </div>
        {connected == true ? (
          <div className="card border border-dark">
            <h3 className="card-header">Friend's Video</h3>
            <video playsInline autoPlay id="remoteVideo"></video>
          </div>
        ) : null}
      </div>
      <div>
        <h1>My Connection ID</h1>
        {myConnectionId ? <div>{myConnectionId}</div> : <button>Click</button>}
      </div>
      <div>
        <h1>Call</h1>
        <form>
          <label>User ID</label>
          <input type="text" onChange={handlePeerId}></input>
          <button
            type="button"
            onClick={() => createOffer(configuration, peerId)}
          >
            Call
          </button>
        </form>
      </div>
      {globalPeerConnection.current && connected && friendId ? (
        <button onClick={disconnect(friendId)}>Disconnect</button>
      ) : null}
    </div>
  );
}

export default VideoRoom;
