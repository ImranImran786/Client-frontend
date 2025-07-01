
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./VideoVerification.css"; // Import the CSS file

const VideoVerification = ({ userEmail }) => {
  const videoRef = useRef(null);
  const peerConnection = useRef(null);
  const socket = useRef(null);
  const [driverId] = useState("driver123"); // Automatically set to "driver123"

  useEffect(() => {
    socket.current = io("https://database-production-3a68.up.railway.app/", { transports: ["websocket", "polling"] });
    socket.current.emit("register_client", userEmail);
    console.log(`📌 Client registered: ${userEmail}`);

    socket.current.on("receive_offer", async ({ signal, driverSocket }) => {
      console.log(`📡 Received WebRTC offer from Driver: ${driverSocket}`);

      peerConnection.current = new RTCPeerConnection();

      peerConnection.current.ontrack = (event) => {
        console.log("🎥 Receiving video stream...");
        videoRef.current.srcObject = event.streams[0];
      };

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("📡 Sending ICE candidate to Driver...");
          socket.current.emit("send_ice_candidate", { candidate: event.candidate, driverSocket });
        }
      };

      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(signal));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      console.log("📡 Sending WebRTC answer to Driver...");
      socket.current.emit("send_answer", { signal: answer, driverSocket });
    });

    socket.current.on("receive_ice_candidate", ({ candidate }) => {
      console.log("📡 Received ICE candidate from Driver.");
      if (peerConnection.current) {
        peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        console.log("❌ Client disconnected.");
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, [userEmail]);

  const requestVideo = () => {
    console.log(`📡 Requesting video from Driver ${driverId} with email ${userEmail}`);
    socket.current.emit("request_video", { clientEmail: userEmail, driverId });
  };

  return (
    <div className="video-container">
      <h2 className="video-title">Client Video Viewer</h2>
      <p className="user-email">Logged in as: {userEmail}</p>
      <button className="request-btn" onClick={requestVideo}>
        Request Video
      </button>
      <div className="video-box">
        <video ref={videoRef} autoPlay playsInline />
      </div>
      <ul className="info-list">
        {/* <li>Ensure stable internet connection</li>
        <li>Enable camera permissions</li> */}
      </ul>
    </div>
  );
};

export default VideoVerification;



















// import React, { useEffect, useRef, useState } from "react";
// import io from "socket.io-client";
// import "./VideoVerification.css"; // Import the CSS file

// const VideoVerification = ({ userEmail }) => {
//   const videoRef = useRef(null);
//   const peerConnection = useRef(null);
//   const socket = useRef(null);
//   const [driverId] = useState("driver123"); // Automatically set to "driver123"

//   useEffect(() => {
//     // 🔴 Request camera permission on load
//     const requestCameraPermission = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
//         console.log("✅ Camera access granted.");
//         // Optionally attach stream to video for preview
//         // videoRef.current.srcObject = stream;
//       } catch (error) {
//         console.error("❌ Camera access denied or error:", error);
//       }
//     };

//     requestCameraPermission(); // ✅ Prompt for camera on mobile when component loads

//     // 🔗 Initialize socket connection
//     socket.current = io("https://database-production-3a68.up.railway.app/", {
//       transports: ["websocket", "polling"],
//     });

//     socket.current.emit("register_client", userEmail);
//     console.log(`📌 Client registered: ${userEmail}`);

//     socket.current.on("receive_offer", async ({ signal, driverSocket }) => {
//       console.log(`📡 Received WebRTC offer from Driver: ${driverSocket}`);

//       peerConnection.current = new RTCPeerConnection();

//       peerConnection.current.ontrack = (event) => {
//         console.log("🎥 Receiving video stream...");
//         videoRef.current.srcObject = event.streams[0];
//       };

//       peerConnection.current.onicecandidate = (event) => {
//         if (event.candidate) {
//           console.log("📡 Sending ICE candidate to Driver...");
//           socket.current.emit("send_ice_candidate", {
//             candidate: event.candidate,
//             driverSocket,
//           });
//         }
//       };

//       await peerConnection.current.setRemoteDescription(new RTCSessionDescription(signal));
//       const answer = await peerConnection.current.createAnswer();
//       await peerConnection.current.setLocalDescription(answer);

//       console.log("📡 Sending WebRTC answer to Driver...");
//       socket.current.emit("send_answer", { signal: answer, driverSocket });
//     });

//     socket.current.on("receive_ice_candidate", ({ candidate }) => {
//       console.log("📡 Received ICE candidate from Driver.");
//       if (peerConnection.current) {
//         peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
//       }
//     });

//     // 🧹 Cleanup
//     return () => {
//       if (socket.current) {
//         socket.current.disconnect();
//         console.log("❌ Client disconnected.");
//       }
//       if (peerConnection.current) {
//         peerConnection.current.close();
//       }
//     };
//   }, [userEmail]);

//   const requestVideo = () => {
//     console.log(`📡 Requesting video from Driver ${driverId} with email ${userEmail}`);
//     socket.current.emit("request_video", { clientEmail: userEmail, driverId });
//   };

//   return (
//     <div className="video-container">
//       <h2 className="video-title">Client Video Viewer</h2>
//       <p className="user-email">Logged in as: {userEmail}</p>
//       <button className="request-btn" onClick={requestVideo}>
//         Request Video
//       </button>
//       <div className="video-box">
//         <video ref={videoRef} autoPlay playsInline />
//       </div>
//       <ul className="info-list">
//         {/* <li>Ensure stable internet connection</li>
//         <li>Enable camera permissions</li> */}
//       </ul>
//     </div>
//   );
// };

// export default VideoVerification;
