import React, {useState, useEffect, useRef} from "react";


function VideoRoom() {

  const [displayVideo, setDisplayVideo] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const createOffer = async () => {
    let configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
    let peerConnection = new RTCPeerConnection(configuration);
    let remoteStream = new MediaStream();
    let remoteVideo = document.querySelector("#remoteVideo");
    remoteVideo.srcObject = remoteStream;

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    })

    peerConnection.ontrack = async (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      })
    }

    let offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    document.getElementById("offer").value = JSON.stringify(offer);
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
 
  return (
    <div>
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
    </div>
  );
}

export default VideoRoom;
