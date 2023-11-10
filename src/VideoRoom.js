import React, {useState, useEffect, useRef} from "react";
import signalRService from "./signalR";
import { useSelector } from "react-redux";
import Navbar from "./navbar";

function VideoRoom() {

  const username = useSelector(
    (state) => state.user && state.user.currentUser
  );

  const [localStream, setLocalStream] = useState(null);
  const [globalPeerConnection, setGlobalPeerConnection] = useState({});
  const [myConnectionId, setMyConnectionId] = useState(null);
  const [peerId, setPeerId] = useState("");
  const [connected, setConnected] = useState(true);

  const createOffer = async (peerId) => {
    let configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
    let peerConnection = new RTCPeerConnection(configuration);
    let remoteStream = new MediaStream();
    let remoteVideo = document.querySelector("#remoteVideo");
    remoteVideo.srcObject = remoteStream;
    let iceOffer;

    if(localStream){
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      })
    }
    
    peerConnection.ontrack = async (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      })
    }

    peerConnection.onicecandidate = async (event) => {
      if(event.candidate){
        iceOffer = JSON.stringify(peerConnection.localDescription);
      }
    }

    let offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    setGlobalPeerConnection(peerConnection);
    console.log(peerConnection)
    console.log(offer)
    signalRService.signalConnection.invoke("Offer", (peerId, iceOffer, username));
    
  }

  const createAnswer = async (callerId, offer, username) => {
    console.log(offer);
    let configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
    let peerConnection = new RTCPeerConnection(configuration);
    let remoteStream = new MediaStream();
    let remoteVideo = document.querySelector("#remoteVideo");
    remoteVideo.srcObject = remoteStream;
    let iceAnswer;

    if(localStream){
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      })
    }
    
    peerConnection.ontrack = async (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      })
    }

    peerConnection.onicecandidate = async (event) => {
      if(event.candidate){
        iceAnswer = JSON.stringify(peerConnection.localDescription);
      }
    }

    offer = JSON.parse(offer)

    await peerConnection.setRemoteDescription(offer);
    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    signalRService.signalConnection.invoke("Answer", (callerId, iceAnswer, username))
  };

  const handleAnswer = async (calleeId, answer, calleeUsername) => {
    console.log(answer);
    answer = JSON.parse(answer);

    if(!globalPeerConnection.currentRemoteDescription){
      await globalPeerConnection.setRemoteDescription(answer);
    }
  }


  //handle Peer ID
  const handlePeerId = (e) => {
    setPeerId(e.target.value);
  }

  //Listens for sdpOffers
  /*useEffect(() => {
    signalRService.signalConnection.on("ReceiveOffer", (callerId, offer, callerUsername) => {
      createAnswer(callerId, offer, callerUsername)});
  }, [connected]);*/

  //Listens for sdpAnswers
  /*useEffect(() => {
    signalRService.signalConnection.on("ReceiveAnswer", (calleeId, answer, calleeUsername) => {
      handleAnswer(calleeId, answer, calleeUsername)});
  }, [connected]);*/

  useEffect(() => {
      const myLocalVideo = document.querySelector("#localVideo");
      navigator.mediaDevices.getUserMedia({video: {"width": 640, "height": 480}, audio: true}).then((stream) => {
        myLocalVideo.srcObject = stream
        setLocalStream(stream);
      }).catch((error) => {
        console.log("Error:", error);
      })
  }, [])
  
  useEffect(() => {
    signalRService.startConnection().then((response) => {
      console.log("Connection to WebRTC has been created!"); 
      setMyConnectionId(signalRService.signalConnection.connectionId);
    })
    .catch((error) => console.log(error));
  }, [])
 
  return (
    <div style={{paddingTop: "5rem"}}>
      <Navbar />
      <div className="d-flex justify-content-center gap-3">
        <div className="card border border-dark">
          <h3 className="card-header text-center">Your Video</h3>
          <video playsInline autoPlay id="localVideo"></video>
        </div>
        {connected == true ? <div className="card border border-dark">
          <h3 className="card-header">Friend's Video</h3>
          <video playsInline autoPlay id="remoteVideo"></video>
        </div> : null}
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
          <button type="button" onClick={() => createOffer(peerId)}>Call</button>
        </form>
      </div>
      <div>
        <h1>Answer</h1>
        <button type="button" onClick={createAnswer}>Create an Answer</button>
        <button type="button" onClick={handleAnswer}>Add an Answer</button>
        <textarea id="answer"></textarea>
      </div>
    </div>
  );
}

export default VideoRoom;
