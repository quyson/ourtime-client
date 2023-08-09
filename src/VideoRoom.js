import React, {useState, useEffect, useRef} from "react";
import signalRService from "./signalR";

function VideoRoom() {

  const [displayVideo, setDisplayVideo] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [globalPeerConnection, setGlobalPeerConnection] = useState({});
  const [myConnectionId, setMyConnectionId] = useState(null);

  const createOffer = async () => {
    let configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
    let peerConnection = new RTCPeerConnection(configuration);
    let remoteStream = new MediaStream();
    let remoteVideo = document.querySelector("#remoteVideo");
    remoteVideo.srcObject = remoteStream;

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
        document.getElementById("offer").value = JSON.stringify(peerConnection.localDescription);
        let iceOffer = JSON.stringify(peerConnection.localDescription);
        console.log(iceOffer);
      }
    }

    let offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    setGlobalPeerConnection(peerConnection);

    //signalRService.signalConnection.invoke("Offer", (peerId, iceOffer, username));
  }

  const createAnswer = async () => {
    let configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
    let peerConnection = new RTCPeerConnection(configuration);
    let remoteStream = new MediaStream();
    let remoteVideo = document.querySelector("#remoteVideo");
    remoteVideo.srcObject = remoteStream;

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
        document.getElementById("answer").value = JSON.stringify(peerConnection.localDescription);
      }
    }

    //get offer from peer that is calling through signal R, but in this case its gonna be DOM
    let offer = document.getElementById("offer").value
    offer= JSON.parse(offer)

    await peerConnection.setRemoteDescription(offer);

    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    document.getElementById("answer").value = JSON.stringify(answer)
  }

  const handleAnswer = async () => {
    let answer = document.getElementById("answer").value;
    if(!answer){alert("Retrieve Answer first")};

    answer = JSON.parse(answer);

    if(!globalPeerConnection.currentRemoteDescription){
      await globalPeerConnection.setRemoteDescription(answer);
    }
  }

  const allowVideo = (e) => {
    setDisplayVideo(true);
  }

  useEffect(() => {
    if(displayVideo){
      navigator.mediaDevices.getUserMedia({video: true, audio: true}).then((stream) => {
        const myLocalVideo = document.querySelector("#localVideo");
        myLocalVideo.srcObject = stream;
        setLocalStream(stream);
      })
    }
  }, [displayVideo])

  useEffect(() => {
    signalRService.startConnection().then((response) => {
      console.log("Connection to WebRTC has been created!"); 
      setMyConnectionId(signalRService.signalConnection.connectionId);
    })
    .catch((error) => console.log(error));
  }, [])
 
  return (
    <div>
      <div>
        {myConnectionId ? <div>My Connection ID: {myConnectionId}</div> : null}
      </div>
      <div>
        <button type="button" onClick={allowVideo}>Use Camera</button>
        {displayVideo ? <video playsInline autoPlay muted id="localVideo"></video> : <div>No Video</div>}
      </div>
      <div>
        <video playsInline autoPlay id="remoteVideo"></video>
      </div>
      <div>
        <h1>Offer</h1>
        <button type="button" onClick={createOffer}>Create an Offer</button>
        <textarea id="offer"></textarea>
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
