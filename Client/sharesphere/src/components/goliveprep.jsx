import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'peerjs';
import SideBar from './navbar';
import BackButton from './back';

const GoLive = ({ roomId }) => {
  const [isLive, setIsLive] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const videoGridRef = useRef(null);
  const myPeerRef = useRef(null);
  const myVideoRef = useRef(null);
  const socketRef = useRef(null);
  const peersRef = useRef({});
  

  useEffect(() => {
    socketRef.current = io('/');
    const videoGrid = videoGridRef.current;
    myPeerRef.current = new Peer(undefined, {
      host: '/',
      port: '5004',
    });

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      const myVideo = document.createElement('video');
      myVideo.srcObject = stream;
      myVideo.muted = true;
      myVideo.addEventListener('loadedmetadata', () => {
        myVideo.play();
      });
      myVideoRef.current = myVideo;
      videoGrid.appendChild(myVideo);

      myPeerRef.current.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
          addVideoStream(video, userVideoStream);
        });
      });

      socketRef.current.on('user-connected', userId => {
        connectToNewUser(userId, stream);
      });

      socketRef.current.on('user-disconnected', userId => {
        if (peersRef.current[userId]) peersRef.current[userId].close();
      });

      myPeerRef.current.on('open', id => {
        socketRef.current.emit('join-room', roomId, id);
      });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  function connectToNewUser(userId, stream) {
    const call = myPeerRef.current.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream);
    });
    call.on('close', () => {
      video.remove();
    });

    peersRef.current[userId] = call;
  }

  function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
    videoGridRef.current.appendChild(video);
  }
  const handleGoLive = () => {
    console.log('Go Live button clicked');
    setIsLive(true);
  };
  
  const handleInvitePeople = () => {
    console.log('Invite People button clicked');
    setIsInviting(true);
  };
  
  const handleStopLive = () => {
    console.log('Stop Live button clicked');
    setIsLive(false);
  };
  

  return (
    <>
    <div className="golive">
      <div ref={videoGridRef} id="video-grid"></div>
      {!isLive && (
        <button onClick={handleGoLive}>Go Live</button>
      )}
      {isLive && !isInviting && (
        <button onClick={handleInvitePeople}>Invite People</button>
      )}
      {isLive && (
        <button onClick={handleStopLive}>Stop Live</button>
      )}
    </div>
    </>
  );
};

export default GoLive;
