// this code is enter driver id in input field the click button and display live video of driver
// import React, { useEffect, useRef, useState } from "react";
// import io from "socket.io-client";
// import "./VideoVerification.css"; // Import the CSS file

// const VideoVerification = ({ userEmail }) => {
//   const videoRef = useRef(null);
//   const peerConnection = useRef(null);
//   const socket = useRef(null);
//   const [driverId, setDriverId] = useState("");

//   useEffect(() => {
//     socket.current = io("https://mongo-db-backend-production.up.railway.app/", { transports: ["websocket", "polling"] });
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
//           socket.current.emit("send_ice_candidate", { candidate: event.candidate, driverSocket });
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
//     if (!driverId) {
//       alert("Enter Driver ID");
//       return;
//     }
//     console.log(`📡 Requesting video from Driver ${driverId} with email ${userEmail}`);
//     socket.current.emit("request_video", { clientEmail: userEmail, driverId });
//   };

//   return (
//     <div className="video-container">
//       <h2>Client Video Viewer</h2>
//       <p>Logged in as: {userEmail}</p>
//       <input
//         type="text"
//         placeholder="Enter Driver ID"
//         value={driverId}
//         onChange={(e) => setDriverId(e.target.value)}
//       />
//       <button onClick={requestVideo}>Request Video</button>
//       <div className="video-box">
//         <video ref={videoRef} autoPlay playsInline />
//       </div>
//       <ul>
//         <li>Ensure stable internet connection</li>
//         <li>Enable camera permissions</li>
//       </ul>
//     </div>
//   );
// };

// export default VideoVerification;






















// this code is set only click buton then display live video of driver 
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./VideoVerification.css"; // Import the CSS file

const VideoVerification = ({ userEmail }) => {
  const videoRef = useRef(null);
  const peerConnection = useRef(null);
  const socket = useRef(null);
  const [driverId] = useState("driver123"); // Automatically set to "driver123"

  useEffect(() => {
    socket.current = io("https://mongo-db-backend-production.up.railway.app/", { transports: ["websocket", "polling"] });
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
// import { useLocation } from "react-router-dom";
// import axios from "axios";
// import io from "socket.io-client";
// import "./VideoVerification.css";

// const VideoVerification = ({ clientEmail }) => {
//   const location = useLocation();
//   const clientId = location.state?.userId;
//   const [driverInfo, setDriverInfo] = useState(null);
//   const [notConnected, setNotConnected] = useState(false);
//   // const [clientEmail, setClientEmail] = useState(location.state?.userEmail || "unknown@example.com");

//   const socket = useRef(null);
//   const peerConnection = useRef(null);
//   const videoRef = useRef(null);

//   useEffect(() => {
//     const checkDriverConnection = async () => {
//           try {
//             const res = await axios.get(`https://mongo-db-backend-production.up.railway.app/api/client/check-connection/${clientId}`);
//             if (res.data && res.data.driver && res.data.driver._id) {
//               const driver = res.data.driver;
//               setDriverInfo(driver);
//               initializeSocket(driver._id);
//             } else {
//               setNotConnected(true);
//             }
//           } catch (error) {
//             console.error("❌ Error checking connection:", error);
//             setNotConnected(true);
//           }
//         };
    
//         if (clientId) checkDriverConnection();
//       }, [clientId]);

//   const initializeSocket = (driverId) => {
//     socket.current = io("mongo-db-backend-production.up.railway.app", { transports: ["websocket", "polling"] });

//     socket.current.on("connect", () => {
//       console.log("✅ Client connected to WebSocket server");
//       socket.current.emit("register_client", clientEmail);
//     });

//     socket.current.on("disconnect", () => {
//       console.warn("⚠️ WebSocket disconnected");
//     });

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
//           socket.current.emit("send_ice_candidate", { candidate: event.candidate, driverSocket });
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
//   };

//   const requestVideo = () => {
//     if (!driverInfo) {
//       alert("❌ You are not connected to any driver.");
//       return;
//     }
//     console.log(`📡 Requesting video from Driver ${driverInfo._id} with email ${clientEmail}`);
//     socket.current.emit("request_video", { clientEmail, driverId: driverInfo._id });
//   };

//   useEffect(() => {
//     return () => {
//       if (socket.current) {
//         socket.current.disconnect();
//         console.log("❌ Client disconnected.");
//       }
//       if (peerConnection.current) {
//         peerConnection.current.close();
//       }
//     };
//   }, []);

//   return (
//     <div className="video-container">
//       <h2>Client Video Viewer</h2>

//       {notConnected ? (
//         <p style={{ color: "red" }}>
//           ❌ You are not connected to any driver. Please contact the admin.
//         </p>
//       ) : (
//         <>
//           <div style={{ backgroundColor: "#f9f9f9", padding: "10px", borderRadius: "8px", marginBottom: "15px" }}>
//             <p><strong>Driver Name:</strong> {driverInfo?.name}</p>
//             <p><strong>Status:</strong> {driverInfo?.status}</p>
//             <p><strong>Driver ID:</strong> {driverInfo?._id}</p>
//             <p><strong>Connected Client ID:</strong> {driverInfo?.connectedClientId}</p>
//           </div>

//           <button onClick={requestVideo}>Request Video</button>
//         </>
//       )}

//       <div className="video-box">
//         <video ref={videoRef} autoPlay playsInline />
//       </div>

//       <ul>
//         <li>Ensure stable internet connection</li>
//         <li>Enable camera permissions</li>
//       </ul>
//     </div>
//   );
// };

// export default VideoVerification;

