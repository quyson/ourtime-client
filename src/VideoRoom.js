import React, {useState, useEffect, useRef} from "react";
import signalRService from "./signalR";

function VideoRoom() {

  const [localStream, setLocalStream] = useState(null);
  const [globalPeerConnection, setGlobalPeerConnection] = useState({});
  const [myConnectionId, setMyConnectionId] = useState(null);
  const [peerId, setPeerId] = useState("");
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);

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

  // Displays Media
  useEffect(() => {
      navigator.mediaDevices.getUserMedia({video: true, audio: true}).then((stream) => {
        const myLocalVideo = document.querySelector("#localVideo");
        myLocalVideo.srcObject = stream;
        setLocalStream(stream);
      })
  }, [])
  
  //Starts server connection
  useEffect(() => {
    signalRService.startConnection().then((response) => {
      console.log("Connection to WebRTC has been created!"); 
      setMyConnectionId(signalRService.signalConnection.connectionId);
      setConnected(true);
    })
    .catch((error) => console.log(error));
  }, [])
 
  return (
    <div>
      <div>
        {myConnectionId ? <div>My Connection ID: {myConnectionId}</div> : null}
      </div>
      <div>
        <h1>Your Video</h1>
        <video playsInline autoPlay muted id="localVideo"></video>
      </div>
      <div>
        <h1>Peer</h1>
        <video playsInline autoPlay id="remoteVideo"></video>
      </div>
      <div>
        <h1>Call</h1>
        <form>
          <label>User ID</label>
          <input type="text" onChange={handlePeerId}></input>
          <button onClick={() => createOffer(peerId)}>Call</button>
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
