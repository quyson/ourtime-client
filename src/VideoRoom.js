import React, {useState, useEffect, useRef} from "react";


function VideoRoom() {

  
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({video: true, audio: true}).then((stream) => {
      const local = document.querySelector("#localVideo");
      local.srcObject = stream;
    })
  }, [])

  /*navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then((stream) => {
      const myVideo = document.querySelector("#local");
      myVideo.srcObject = stream;
    });*/
 

  return (
    <div>
      <div>
        <video playsInline autoPlay muted id="localVideo"></video>
      </div>
    </div>
  );
}

export default VideoRoom;
