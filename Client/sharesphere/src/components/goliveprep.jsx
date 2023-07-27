import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'peerjs';
import SideBar from './navbar';
import BackButton from './back';

const GoLive = ({ roomId }) => {
  const [isLive, setIsLive] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [isLiveStarted, setIsLiveStarted] = useState(false); // New state to track if live share has started
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
    setIsLiveStarted(true); // Set the live share started to true
  };

  const handleInvitePeople = () => {
    console.log('Invite People button clicked');
    setIsInviting(true);
  };

  const handleStopLive = () => {
    console.log('Stop Live button clicked');
    setIsLive(false);
    setIsInviting(false); // Reset the inviting state when stopping the live share
  };

  // Function to copy the room ID to the clipboard
  const copyRoomIdToClipboard = () => {
    const textarea = document.createElement('textarea');
    textarea.value = roomId;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    setIsLiveStarted(true); // Set the live share started to true after copying the room ID
  };

  return (
    <>
      <div className="golive">
        <div ref={videoGridRef} id="video-grid"></div>
        {!isLive && (
          <button className="golive-button go-live-btn" onClick={handleGoLive}>
            Go Live
          </button>
        )}
        {isLive && !isInviting && (
          <button className="golive-button invite-people-btn" onClick={handleInvitePeople}>
            Invite People
          </button>
        )}
        {isLive && (
          <button className="golive-button stop-live-btn" onClick={handleStopLive}>
            Stop Live
          </button>
        )}

        {isLive && (
          <div className="room-id-container">
            <p>Room ID: {roomId}</p>
            <button onClick={copyRoomIdToClipboard} className="golive-button copy-btn">
              Copy Room ID
            </button>
            {isLiveStarted && <span>Room ID copied to clipboard!</span>}
          </div>
        )}
      </div>
    </>
  );
};

export default GoLive;
