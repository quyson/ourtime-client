import React, { useState, useEffect, useRef } from "react";
import signalRService from "./signalR";
import { useSelector } from "react-redux";
import Navbar from "./navbar";

function VideoRoom() {
  const username = useSelector((state) => state.user && state.user.currentUser);

  const [localStream, setLocalStream] = useState(null);
  const globalPeerConnection = useRef(null);
  const [myConnectionId, setMyConnectionId] = useState(null);
  const [peerId, setPeerId] = useState("");
  const [connected, setConnected] = useState(false);
  const [connectionState, setConnectionState] = useState(null);

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
  };

  const handleAnswer = async (calleeId, answer, calleeUsername) => {
    setConnected(true);

    setConnectionState(globalPeerConnection.current.iceConnectionState);
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
      console.log("candidate", candidate);
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
          createAnswer(callerId, offer, callerUsername);
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

  //Listens for Decline Call
  /*useEffect(() => {
    signalRService.signalConnection.on("Declined", (message) =>{
      handleDeclineCall(message);
    })
  }, [])*/

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
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                "Incoming Call!"
              </h5>
            </div>
            <div class="modal-body">...</div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-success"
                data-dismiss="modal"
              >
                Answer
              </button>
              <button
                type="button"
                class="btn btn-danger close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span> End
              </button>
            </div>
          </div>
        </div>
      </div>
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
      {connectionState ? (
        <div>{connectionState}</div>
      ) : (
        <div>Nothing to see</div>
      )}
    </div>
  );
}

export default VideoRoom;
