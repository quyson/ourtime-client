import React, {useState, useEffect, useRef} from "react";


function VideoRoom() {

  const [displayVideo, setDisplayVideo] = useState(false);

  const allowVideo = (e) => {
    setDisplayVideo(true);
  }

  useEffect(() => {
    if(displayVideo){
      navigator.mediaDevices.getUserMedia({video: true, audio: true}).then((stream) => {
        const myLocalVideo = document.querySelector("#localVideo");
        myLocalVideo.srcObject = stream;
      })
    }
  }, [displayVideo])
 
  return (
    <div>
      <div>
        <button type="button" onClick={allowVideo}>Use Camera</button>
        {displayVideo ? <video playsInline autoPlay muted id="localVideo"></video> : <div>No Video</div>}
      </div>
    </div>
  );
}

export default VideoRoom;
