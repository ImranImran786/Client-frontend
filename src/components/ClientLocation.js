// import React, { useState, useEffect, useRef } from "react";
// import { io } from "socket.io-client";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";

// const ClientLocation = ({ userEmail }) => {
//     const [driverLocation, setDriverLocation] = useState(null);
//     const [socket, setSocket] = useState(null);
//     const [message, setMessage] = useState("");
//     const mapRef = useRef(null);
//     const markerRef = useRef(null);
    
//     const ws = useRef(null);
//     const adminId = "admin-123";

//     useEffect(() => {
//         // WebSocket for receiving location updates
//         const socketInstance = io("http://localhost:5000/");
//         socketInstance.on("client-receive-location", (location) => {
//             console.log("Received Driver Location in Client App:", location);
//             if (location && typeof location.latitude === "number" && typeof location.longitude === "number") {
//                 setDriverLocation(location);
//             } else {
//                 console.warn("Invalid location received:", location);
//             }
//         });
//         setSocket(socketInstance);

//         return () => {
//             socketInstance.disconnect();
//         };
//     }, []);

//     useEffect(() => {
//         const newSocket = io("http://localhost:5005/client", {
//             reconnection: true,
//             reconnectionAttempts: 10,
//             reconnectionDelay: 3000
//         });
    
//         newSocket.on("connect", () => {
//             console.log("Connected to WebSocket Server");
//             newSocket.emit("registerClient", userEmail); // Register using email
//             requestLocation(newSocket); // Automatically send request on connect
//         });
    
//         newSocket.on("requestStatus", (data) => {
//             console.log("Request Status:", data.message);
//             setMessage(data.message);
//         });
    
//         setSocket(newSocket);
    
//         return () => {
//             newSocket.disconnect();
//         };
//     }, []);
    
//     const requestLocation = (socketInstance = socket) => {
//         if (!socketInstance) {
//             console.error("WebSocket is not initialized. Try again.");
//             setMessage("WebSocket is not initialized. Please wait...");
//             return;
//         }
    
//         if (socketInstance.connected) {
//             socketInstance.emit("requestLocation", { 
//                 adminId, 
//                 clientEmail: userEmail  // Send email instead of clientId
//             });
//         } else {
//             console.error("WebSocket is closed. Reconnecting...");
//             setMessage("WebSocket is not ready. Please refresh the page.");
//         }
//     };
    
//     useEffect(() => {
//         if (!driverLocation || typeof driverLocation.latitude !== "number" || typeof driverLocation.longitude !== "number") {
//             console.warn("Skipping map update due to invalid location data.");
//             return;
//         }

//         const { latitude, longitude } = driverLocation;
//         console.log("Updated Latitude:", latitude, "Updated Longitude:", longitude);

//         if (!mapRef.current) {
//             mapRef.current = L.map("client-map").setView([latitude, longitude], 10);
//             L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//                 attribution: "© OpenStreetMap contributors",
//             }).addTo(mapRef.current);
//         }

//         const customIcon = L.icon({
//             iconUrl: markerIcon,
//             shadowUrl: markerShadow,
//             iconSize: [25, 41],
//             iconAnchor: [12, 41],
//         });

//         if (!markerRef.current) {
//             markerRef.current = L.marker([latitude, longitude], { icon: customIcon }).addTo(mapRef.current);
//         } else {
//             markerRef.current.setLatLng([latitude, longitude]);
//         }

//         mapRef.current.setView([latitude, longitude], 14);
//     }, [driverLocation]);
    
//     return (
//         <div style={{ textAlign: "center", padding: "20px" }}>
//             <h2>Client Location</h2>
//             <p>Logged in as: {userEmail}</p>
//             <button onClick={() => requestLocation()} style={{ marginBottom: "10px" }}>Request Location</button>
//             {message && <p>{message}</p>}
//             <div id="client-map" style={{ height: "60vh", width: "100%" }} />
//         </div>
//     );
// };

// export default ClientLocation;

























// import React, { useEffect, useState, useRef } from "react";
// import { io } from "socket.io-client";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";

// const ClientLocation = () => {
//   const [driverLocations, setDriverLocations] = useState({});
//   const [autoClickTimeouts, setAutoClickTimeouts] = useState({});
//   const [requests, setRequests] = useState([]);
//   const mapRef = useRef(null);
//   const markersRef = useRef({});
//   const socket = useRef(null);
//   const adminSocket = useRef(null);
//   const adminId = "admin-123"; // Unique Admin ID

//   useEffect(() => {
//     const mapContainer = document.getElementById("map");
//     if (!mapContainer) {
//       console.error("Map container not found!");
//       return;
//     }

//     const DefaultIcon = L.icon({
//       iconUrl: markerIcon,
//       shadowUrl: markerShadow,
//       iconSize: [25, 41],
//       iconAnchor: [12, 41],
//     });
//     L.Marker.prototype.options.icon = DefaultIcon;

//     if (!mapRef.current) {
//       mapRef.current = L.map("map").setView([0, 0], 10);
//       L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         attribution: "© OpenStreetMap contributors",
//       }).addTo(mapRef.current);
//     }

//     // socket.current = io("http://localhost:5000/");
//     // adminSocket.current = io("ws://localhost:5005/admin");
//     // const SERVER_URL = "ws://http://localhost:5005/"; // Change this to your Railway deployment URL in production
// socket.current = io("http://localhost:5000/");
// adminSocket.current = io("http://localhost:5005/admin");

//     socket.current.on("connect", () => {
//       console.log("Connected to WebSocket server");
//     });

//     adminSocket.current.on("connect", () => {
//       console.log("✅ Admin connected to WebSocket Server");
//       adminSocket.current.emit("registerAdmin", adminId);
//     });

//     socket.current.on("receive-location", (locations) => {
//       console.log("Updated Driver Locations:", locations);
//       setDriverLocations(locations);
//     });

//     // adminSocket.current.on("locationRequest", (data) => {
//     //   console.log("📍 Location request received:", data.clientId);
//     //   setRequests((prevRequests) => [...prevRequests, data.clientId]);
//     // });
//     adminSocket.current.on("locationRequest", (data) => {
//       console.log(`📍 Location request received from ${data.clientEmail}`);
      
//       // Store request with email
//       setRequests((prevRequests) => [...prevRequests, {clientEmail: data.clientEmail }]);
//   });
  

//     return () => {
//       socket.current.disconnect();
//       adminSocket.current.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     if (!mapRef.current) return;

//     Object.entries(driverLocations).forEach(([id, { latitude, longitude }]) => {
//       if (isNaN(latitude) || isNaN(longitude)) {
//         console.warn(`Skipping invalid coordinates for driver ${id}:`, latitude, longitude);
//         return;
//       }

//       console.log(`Driver ${id} updated position -> Latitude: ${latitude}, Longitude: ${longitude}`);
      
//       if (markersRef.current[id]) {
//         markersRef.current[id].setLatLng([latitude, longitude]);
//       } else {
//         markersRef.current[id] = L.marker([latitude, longitude], {
//           title: `Driver ID: ${id}`,
//         }).addTo(mapRef.current);
//       }
//     });

//     const latestDriver = Object.entries(driverLocations).pop();
//     if (latestDriver) {
//       const [, { latitude, longitude }] = latestDriver;
//       mapRef.current.setView([latitude, longitude], 14);
//     }
//   }, [driverLocations]);

//   const forwardLocationToClient = (driverId) => {
//     if (!driverId) return;
//     socket.current.emit("forward-location", { driverId });

//     const timeoutId = setTimeout(() => {
//       document.getElementById(`send-client-${driverId}`).click();
//     }, 1000);

//     setAutoClickTimeouts((prevTimeouts) => ({
//       ...prevTimeouts,
//       [driverId]: timeoutId,
//     }));
//   };

//   const stopAutoClick = (driverId) => {
//     if (autoClickTimeouts[driverId]) {
//       clearTimeout(autoClickTimeouts[driverId]);
//       setAutoClickTimeouts((prevTimeouts) => {
//         const updatedTimeouts = { ...prevTimeouts };
//         delete updatedTimeouts[driverId];
//         return updatedTimeouts;
//       });
//       console.log(`Auto-click stopped for driver ${driverId}`);
//     }
//   };

//   const handleResponse = (clientEmail, action) => {
//   if (adminSocket.current) {
//     const eventType = action === "approve" ? "approveRequest" : "denyRequest";
//     console.log(`📤 Emitting ${eventType} for ${clientEmail}`);
//     adminSocket.current.emit(eventType, { clientEmail });

//     setRequests((prevRequests) => prevRequests.filter((req) => req.clientEmail !== clientEmail));
//   }
// };

  

//   return (
//     <div style={{ padding: "20px", fontSize: "18px" }}>
//       <h2>Driver Live Location Updates</h2>
//       {Object.keys(driverLocations).length === 0 ? (
//         <p>No drivers currently online.</p>
//       ) : (
//         <ul>
//           {Object.entries(driverLocations).map(([id, { latitude, longitude }]) => (
//             <li key={id}>
//               <strong>Driver ID:</strong> {id} <br />
//               <strong>Latitude:</strong> {latitude} <br />
//               <strong>Longitude:</strong> {longitude} <br />
//               <button id={`send-client-${id}`} onClick={() => forwardLocationToClient(id)}>
//                 Send to Client
//               </button>
//               <button
//                 onClick={() => stopAutoClick(id)}
//                 style={{ marginLeft: "10px", padding: "5px 10px", backgroundColor: "red", color: "white" }}
//               >
//                 Stop Auto Click
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}

//       <h2>Admin Dashboard</h2>
//       {/* {requests.length > 0 ? (
//         requests.map((clientId) => (
//           <div key={clientId} style={{ marginBottom: "10px", padding: "10px", border: "1px solid black" }}>
//             <p>Client {clientId} requested location access.</p>
//             <button onClick={() => handleResponse(clientId, "approve")}>✅ Approve</button>
//             <button onClick={() => handleResponse(clientId, "deny")} style={{ marginLeft: "10px", background: "red", color: "white" }}>
//               ❌ Deny
//             </button>
//           </div>
//         ))
//       ) : (
//         <p>No pending requests</p>
//       )} */}

// {requests.length > 0 ? (
//   requests.map(({ clientEmail }) => (
//     <div key={clientEmail} style={{ marginBottom: "10px", padding: "10px", border: "1px solid black" }}>
//       <p>Client: {clientEmail} requested location access.</p>
//       <button onClick={() => handleResponse(clientEmail, "approve")}>✅ Approve</button>
//       <button onClick={() => handleResponse(clientEmail, "deny")} style={{ marginLeft: "10px", background: "red", color: "white" }}>
//         ❌ Deny
//       </button>
//     </div>
//   ))
// ) : (
//   <p>No pending requests</p>
// )}


//       <div id="map" style={{ height: "60vh", width: "100%", marginTop: "20px" }} />
//     </div>
//   );
// };

// export default ClientLocation;












// // this is the driver selection list code ok 
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:5005"); // Update to your backend WebSocket server if different

// const ClientLocation = ({ onDriverSelect }) => {
//   const [drivers, setDrivers] = useState([]);
//   const [selectedDriver, setSelectedDriver] = useState("");

//   useEffect(() => {
//     const fetchDrivers = async () => {
//       try {
//         const { data } = await axios.get("http://localhost:5005/api/users/public/drivers");
//         setDrivers(data);
//       } catch (err) {
//         console.error("Error fetching drivers:", err);
//       }
//     };

//     fetchDrivers();
//   }, []);

//   // const handleChange = (e) => {
//   //   const driverId = e.target.value;
//   //   setSelectedDriver(driverId);

//   //   const clientId = localStorage.getItem("userId"); // or however you're storing the client ID

//   //   if (driverId && clientId) {
//   //     socket.emit("connect_to_driver", { driverId, clientId });
//   //     if (onDriverSelect) {
//   //       onDriverSelect(driverId);
//   //     }
//   //   }
//   // };
//   const handleChange = (e) => {
//     const driverId = e.target.value;
//     setSelectedDriver(driverId);
  
//     // const clientId = localStorage.getItem("userId"); // Replace with actual key you're using
//     // const clientId = localStorage.getItem("userId"); // This should be '68091673e8b7d577b37b4fe7'
//     const clientId = localStorage.getItem("userId"); // Make sure this key matches how you're storing user ID
//     console.log("Client ID from localStorage:", clientId);
//     console.log("Selected Driver ID:", driverId);
  
//     if (driverId && onDriverSelect) {
//       onDriverSelect(driverId);
//     }
  
//     if (driverId && clientId) {
//       socket.emit("connect_to_driver", { driverId, clientId });
//     }
//   };
  
//   return (
//     <div style={styles.container}>
//       <label style={styles.label}>Select an Available Driver:</label>
//       <select value={selectedDriver} onChange={handleChange} style={styles.select}>
//         <option value="">-- Select Driver --</option>
//         {drivers.length > 0 ? (
//           drivers.map((driver) => (
//             <option key={driver._id} value={driver._id}>
//               {driver.name}
//             </option>
//           ))
//         ) : (
//           <option value="">No available drivers</option>
//         )}
//       </select>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     width: "300px",
//     margin: "0 auto",
//     padding: "20px",
//     backgroundColor: "#f4f4f4",
//     borderRadius: "8px",
//     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//   },
//   label: {
//     display: "block",
//     marginBottom: "10px",
//     fontSize: "16px",
//     fontWeight: "bold",
//     color: "#333",
//   },
//   select: {
//     width: "100%",
//     padding: "10px",
//     fontSize: "16px",
//     borderRadius: "5px",
//     border: "1px solid #ddd",
//     backgroundColor: "#fff",
//     cursor: "pointer",
//   },
// };

// export default ClientLocation;












// // this code is used only for location 
// import React, { useEffect, useState, useRef } from "react";
// import { io } from "socket.io-client";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";

// const ClientLocation = () => {
//   const [driverLocations, setDriverLocations] = useState({});
//   const mapRef = useRef(null);
//   const markersRef = useRef({});
//   const socket = useRef(null);

//   useEffect(() => {
//     const mapContainer = document.getElementById("map");
//     if (!mapContainer) {
//       console.error("Map container not found!");
//       return;
//     }

//     const DefaultIcon = L.icon({
//       iconUrl: markerIcon,
//       shadowUrl: markerShadow,
//       iconSize: [25, 41],
//       iconAnchor: [12, 41],
//     });
//     L.Marker.prototype.options.icon = DefaultIcon;

//     if (!mapRef.current) {
//       mapRef.current = L.map("map").setView([0, 0], 10);
//       L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         attribution: "© OpenStreetMap contributors",
//       }).addTo(mapRef.current);
//     }

//     socket.current = io("http://localhost:5000/");

//     socket.current.on("connect", () => {
//       console.log("Connected to WebSocket server");
//     });

//     socket.current.on("receive-location", (locations) => {
//       console.log("Updated Driver Locations:", locations);
//       setDriverLocations(locations);
//     });

//     return () => {
//       socket.current.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     if (!mapRef.current) return;

//     Object.entries(driverLocations).forEach(([id, { latitude, longitude }]) => {
//       if (isNaN(latitude) || isNaN(longitude)) return;

//       if (markersRef.current[id]) {
//         markersRef.current[id].setLatLng([latitude, longitude]);
//       } else {
//         markersRef.current[id] = L.marker([latitude, longitude], {
//           title: `Driver ID: ${id}`,
//         }).addTo(mapRef.current);
//       }
//     });

//     const latestDriver = Object.entries(driverLocations).pop();
//     if (latestDriver) {
//       const [, { latitude, longitude }] = latestDriver;
//       mapRef.current.setView([latitude, longitude], 14);
//     }
//   }, [driverLocations]);

//   return (
//     <div style={{ padding: "20px", fontSize: "18px" }}>
//       <h2>Driver Live Location Updates</h2>
//       {Object.keys(driverLocations).length === 0 ? (
//         <p>No drivers currently online.</p>
//       ) : (
//         <ul>
//           {Object.entries(driverLocations).map(([id, { latitude, longitude }]) => (
//             <li key={id}>
//               <strong>Driver ID:</strong> {id} <br />
//               <strong>Latitude:</strong> {latitude} <br />
//               <strong>Longitude:</strong> {longitude}
//             </li>
//           ))}
//         </ul>
//       )}
//       <div id="map" style={{ height: "60vh", width: "100%", marginTop: "20px" }} />
//     </div>
//   );
// };

// export default ClientLocation;













// import React, { useEffect, useState, useRef } from "react";
// import { io } from "socket.io-client";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";
// import axios from "axios";
// import { useLocation } from "react-router-dom";

//     // const clientId = localStorage.getItem("userId");
// const ClientLocation = () => {

//   const location = useLocation();
//   const clientId = location.state?.userId;

//   const [driverLocations, setDriverLocations] = useState({});
//   const [connectedDriverId, setConnectedDriverId] = useState(null);
//   const [driverInfo, setDriverInfo] = useState(null);
//   const [notConnected, setNotConnected] = useState(false);
//   const mapRef = useRef(null);
//   const markersRef = useRef({});
//   const socket = useRef(null);

//   // STEP 1: Check client-driver connection from backend
//   useEffect(() => {
//     const checkConnection = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:5005/api/client/check-connection/${clientId}`
//         );

//         if (res.data && res.data.driver && res.data.driver._id) {
//           const driver = res.data.driver;
//           setConnectedDriverId(driver._id);
//           setDriverInfo(driver);
//           initMap();
//           setupSocket(driver._id);
//         } else {
//           setNotConnected(true);
//         }
//       } catch (err) {
//         console.error("❌ Connection check failed:", err);
//         setNotConnected(true);
//       }
//     };

//     checkConnection();
//   }, [clientId]);

//   // STEP 2: Initialize Leaflet Map
//   const initMap = () => {
//     if (!mapRef.current) {
//       const DefaultIcon = L.icon({
//         iconUrl: markerIcon,
//         shadowUrl: markerShadow,
//         iconSize: [25, 41],
//         iconAnchor: [12, 41],
//       });
//       L.Marker.prototype.options.icon = DefaultIcon;

//       mapRef.current = L.map("map").setView([0, 0], 10);
//       L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         attribution: "© OpenStreetMap contributors",
//       }).addTo(mapRef.current);
//     }
//   };

//   // STEP 3: Setup Socket.IO
//   const setupSocket = (driverId) => {
//     socket.current = io("http://localhost:5000/client");

//     socket.current.on("connect", () => {
//       console.log("✅ Connected to WebSocket server as client");
//       socket.current.emit("register_client", clientId);
//     });

//     socket.current.on("driver_location_update", ({ driverId: incomingId, latitude, longitude }) => {
//       if (incomingId === driverId) {
//         console.log(`📍 Driver ${incomingId} => Lat: ${latitude}, Lng: ${longitude}`);
//         setDriverLocations((prev) => ({
//           ...prev,
//           [incomingId]: { latitude, longitude },
//         }));
//       }
//     });

//     socket.current.on("disconnect", () => {
//       console.log("❌ WebSocket disconnected");
//     });
//   };

//   // STEP 4: Update Map Markers
//   useEffect(() => {
//     if (!mapRef.current) return;

//     Object.entries(driverLocations).forEach(([id, { latitude, longitude }]) => {
//       if (isNaN(latitude) || isNaN(longitude)) return;

//       if (markersRef.current[id]) {
//         markersRef.current[id].setLatLng([latitude, longitude]);
//       } else {
//         markersRef.current[id] = L.marker([latitude, longitude], {
//           title: `Driver ID: ${id}`,
//         }).addTo(mapRef.current);
//       }
//     });

//     const latestDriver = Object.entries(driverLocations).pop();
//     if (latestDriver) {
//       const [, { latitude, longitude }] = latestDriver;
//       mapRef.current.setView([latitude, longitude], 14);
//     }
//   }, [driverLocations]);

//   return (
//     <div style={{ padding: "20px", fontSize: "18px" }}>
//       <h2>Driver Live Location Updates</h2>

//       {notConnected ? (
//         <p style={{ color: "red" }}>
//           ❌ Please contact admin. You are not connected with any driver.
//         </p>
//       ) : (
//         <>
//           {driverInfo && (
//             <div style={{ marginBottom: "20px", backgroundColor: "#f4f4f4", padding: "10px", borderRadius: "8px" }}>
//               <p><strong>✅ Connected Driver Info:</strong></p>
//               <p><strong>Name:</strong> {driverInfo.name}</p>
//               <p><strong>Status:</strong> {driverInfo.status}</p>
//               <p><strong>Driver ID:</strong> {driverInfo._id}</p>
//               <p><strong>Connected Client ID:</strong> {driverInfo.connectedClientId}</p>
//             </div>
//           )}

//           <ul>
//             {Object.entries(driverLocations).map(([id, { latitude, longitude }]) => (
//               <li key={id}>
//                 <strong>Driver ID:</strong> {id} <br />
//                 <strong>Latitude:</strong> {latitude} <br />
//                 <strong>Longitude:</strong> {longitude}
//               </li>
//             ))}
//           </ul>

//           <div id="map" style={{ height: "60vh", width: "100%", marginTop: "20px" }} />
//         </>
//       )}
//     </div>
//   );
// };

// export default ClientLocation;




















import axios from "axios";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "./location.css";

const ClientLocation = () => {
  const location = useLocation();
  const clientId = location.state?.userId;
  const [driverInfo, setDriverInfo] = useState(null);
  const [notConnected, setNotConnected] = useState(false);

  const [driverLocations, setDriverLocations] = useState({});
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const socket = useRef(null);

  // Setup socket connection
  const initializeSocket = (driverId) => {
    socket.current = io("http://localhost:5000");

    socket.current.on("connect", () => {
      console.log("✅ Client connected to WebSocket server");
      socket.current.emit("register_client", clientId);
    });

    socket.current.on("receive-location", (locations) => {
      console.log("Updated Driver Locations:", locations);
      setDriverLocations(locations);
    });

    socket.current.on("disconnect", () => {
      console.warn("⚠️ WebSocket disconnected");
    });
  };

  useEffect(() => {
    const checkDriverConnection = async () => {
      try {
        const res = await axios.get(`http://localhost:5005/api/client/check-connection/${clientId}`);
        if (res.data && res.data.driver && res.data.driver._id) {
          const driver = res.data.driver;
          setDriverInfo(driver);
          initializeSocket(driver._id);
        } else {
          setNotConnected(true);
        }
      } catch (error) {
        console.error("❌ Error checking connection:", error);
        setNotConnected(true);
      }
    };

    if (clientId) checkDriverConnection();
  }, [clientId]);

  useEffect(() => {
    const mapContainer = document.getElementById("map");
    if (!mapContainer) {
      console.error("Map container not found!");
      return;
    }

    const DefaultIcon = L.icon({
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([0, 0], 10);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    Object.entries(driverLocations).forEach(([id, { latitude, longitude }]) => {
      if (isNaN(latitude) || isNaN(longitude)) return;

      if (markersRef.current[id]) {
        markersRef.current[id].setLatLng([latitude, longitude]);
      } else {
        markersRef.current[id] = L.marker([latitude, longitude], {
          title: `Driver ID: ${id}`,
        }).addTo(mapRef.current);
      }
    });

    const latestDriver = Object.entries(driverLocations).pop();
    if (latestDriver) {
      const [, { latitude, longitude }] = latestDriver;
      mapRef.current.setView([latitude, longitude], 14);
    }
  }, [driverLocations]);

  return (
    <div className="driver-location-container">
  <h2 className="location-title">Driver Live Location Updates</h2>

  {notConnected ? (
    <p className="not-connected">
      ❌ You are not connected to any driver OR Driver is Offline. Please contact the admin.
    </p>
  ) : (
    <>
      {driverInfo && (
        <div className="driver-info-card">
          <p><strong>Driver Name:</strong> {driverInfo.name || 'N/A'}</p>
          <p><strong>Phone:</strong> {driverInfo.phone || 'N/A'}</p>
          <p><strong>Status:</strong> {driverInfo.status}</p>
          <p><strong>Vehicle no:</strong> {driverInfo.licenseNumber || 'N/A'}</p>
          {/* <p><strong>Driver ID:</strong> {driverInfo._id}</p> */}
          {/* <p><strong>Connected Client ID:</strong> {driverInfo.connectedClientId}</p> */}
        </div>
      )}

      <div>
        <ul className="location-list">
          {Object.entries(driverLocations).map(([id, { latitude, longitude }]) => (
            <li key={id}>
              {/* Display driver coordinates if needed */}
            </li>
          ))}
        </ul>
      </div>
    </>
  )}

  <div id="map" className="map-container" />
</div>



  );
};

export default ClientLocation;
















// mix of driver into and location better 
// import React, { useEffect, useState, useRef } from "react";
// import { io } from "socket.io-client";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";
// import axios from "axios";
// import { useLocation } from "react-router-dom";

// const ClientLocation = () => {
//   const location = useLocation();
//   const clientId = location.state?.userId;

//   const [driverInfo, setDriverInfo] = useState(null);
//   // const [driverLocation, setDriverLocation] = useState(null);
//   const [notConnected, setNotConnected] = useState(false);
  
//   const [driverLocation, setDriverLocations] = useState({});
//   // const mapRef = useRef(null);
//   // const markerRef = useRef(null);
//   // const socketRef = useRef(null);
//   const mapRef = useRef(null);
//   const markerRef = useRef({});
//   const socket = useRef(null);

//   // Step 1: Check connection to a driver
//   useEffect(() => {
//     const checkDriverConnection = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5005/api/client/check-connection/${clientId}`);
//         const driver = res.data?.driver;

//         if (driver && driver._id) {
//           setDriverInfo(driver);
//           // initMap();
//           setupSocket(driver._id);
//         } else {
//           setNotConnected(true);
//         }
//       } catch (error) {
//         console.error("❌ Error checking connection:", error);
//         setNotConnected(true);
//       }
//     };

//     if (clientId) checkDriverConnection();
//   }, [clientId]);

//   // Step 2: Initialize Leaflet map
//   // const initMap = () => {
//   //   if (!mapRef.current) {
//   //     const DefaultIcon = L.icon({
//   //       iconUrl: markerIcon,
//   //       shadowUrl: markerShadow,
//   //       iconSize: [25, 41],
//   //       iconAnchor: [12, 41],
//   //     });
//   //     L.Marker.prototype.options.icon = DefaultIcon;

//   //     mapRef.current = L.map("map").setView([20, 78], 5);
//   //     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//   //       attribution: "© OpenStreetMap contributors",
//   //     }).addTo(mapRef.current);
//   //   }
//   // };
//   // const DefaultIcon = L.icon({
//   //         iconUrl: markerIcon,
//   //         shadowUrl: markerShadow,
//   //         iconSize: [25, 41],
//   //         iconAnchor: [12, 41],
//   //       });
//   //       L.Marker.prototype.options.icon = DefaultIcon;
    
//   //       if (!mapRef.current) {
//   //         mapRef.current = L.map("map").setView([0, 0], 10);
//   //         L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//   //           attribution: "© OpenStreetMap contributors",
//   //         }).addTo(mapRef.current);
//   //       }



  
//   useEffect(() => {
//     const mapContainer = document.getElementById("map");
//     if (!mapContainer) {
//       console.error("Map container not found!");
//       return;
//     }

//     const DefaultIcon = L.icon({
//       iconUrl: markerIcon,
//       shadowUrl: markerShadow,
//       iconSize: [25, 41],
//       iconAnchor: [12, 41],
//     });
//     L.Marker.prototype.options.icon = DefaultIcon;

//     if (!mapRef.current) {
//       mapRef.current = L.map("map").setView([0, 0], 10);
//       L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         attribution: "© OpenStreetMap contributors",
//       }).addTo(mapRef.current);
//     }

//     socket.current = io("http://localhost:5000/");

//     socket.current.on("connect", () => {
//       console.log("Connected to WebSocket server");
//     });

//     socket.current.on("receive-location", (locations) => {
//       console.log("Updated Driver Locations:", locations);
//       setDriverLocations(locations);
//     });

//     return () => {
//       socket.current.disconnect();
//     };
//   }, []);

//   // Step 3: Setup WebSocket connection and listen for location updates
//   // const setupSocket = (driverId) => {
//   //   socket.current = io("http://localhost:5000");

//   //   socket.current.on("connect", () => {
//   //     console.log("✅ Client connected to WebSocket server");
//   //     socket.current.emit("register_client", clientId);
//   //   });

//   //   socket.current.on("receive-location", (locations) => {
//   //           console.log("Updated Driver Locations:", locations);
//   //           setDriverLocations(locations);
//   //         });

//     // socketRef.current.on("driver_location_update", ({ latitude, longitude }) => {
//     //   // if (incomingId === driverId) {
//     //     console.log(`📍 Received location: ${latitude}, ${longitude}`);
//     //     setDriverLocation({ latitude, longitude });
//     //   // }
//     // });

//   //   socket.current.on("disconnect", () => {
//   //     console.warn("⚠️ WebSocket disconnected");
//   //   });
//   // };

//   // Step 4: Update map marker when new location arrives
//   useEffect(() => {
//     if (!mapRef.current || !driverLocation) return;

//     const { latitude, longitude } = driverLocation;

//     if (markerRef.current) {
//       markerRef.current.setLatLng([latitude, longitude]);
//     } else {
//       markerRef.current = L.marker([latitude, longitude], {
//         title: `Driver: ${driverInfo?.name}`,
//       }).addTo(mapRef.current);
//     }

//     mapRef.current.setView([latitude, longitude], 14);
//   }, [driverLocation, driverInfo]);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Driver Live Location</h2>

//       {notConnected ? (
//         <p style={{ color: "red" }}>
//           ❌ You are not connected to any driver. Please contact the admin.
//         </p>
//       ) : (
//         <>
//           {driverInfo && (
//             <div style={{ backgroundColor: "#f9f9f9", padding: "10px", borderRadius: "8px" }}>
//               <p><strong>Name:</strong> {driverInfo.name}</p>
//               <p><strong>Status:</strong> {driverInfo.status}</p>
//               <p><strong>Driver ID:</strong> {driverInfo._id}</p>
//               <p><strong>Connected Client ID:</strong> {driverInfo.connectedClientId}</p>
//             </div>
//           )}

//           {driverLocation && (
//             <div style={{ marginTop: "10px" }}>
//               <p><strong>Current Location:</strong></p>
//               <p>Latitude: {driverLocation.latitude}</p>
//               <p>Longitude: {driverLocation.longitude}</p>
//             </div>
//           )}
          
//            <ul>
//          {Object.entries(driverLocation).map(([id, { latitude, longitude }]) => (
//             <li key={id}>
//               <strong>Driver ID:</strong> {id} <br />
//               <strong>Latitude:</strong> {latitude} <br />
//               <strong>Longitude:</strong> {longitude}
//             </li>
//           ))}
//         </ul>

//           <div id="map" style={{ height: "60vh", width: "100%", marginTop: "20px" }}></div>
//         </>
//       )}
//     </div>
//   );
// };

// export default ClientLocation;

































// // this code is done for display available drivers but issue in display live location ofconnected driver with client
// import React, { useEffect, useState, useRef } from "react";
// import { io } from "socket.io-client";
// import axios from "axios";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";

// const ClientLocation = () => {
//   const [drivers, setDrivers] = useState([]);
//   const [selectedDriver, setSelectedDriver] = useState("");
//   const [driverLocation, setDriverLocation] = useState(null);
//   const mapRef = useRef(null);
//   const markerRef = useRef(null);
//   const socket = useRef(null);

//   useEffect(() => {
//     // Setup map only once

    
//     const mapContainer = document.getElementById("map");
//     if (!mapContainer) {
//       console.error("Map container not found!");
//       return;
//     }

//     const DefaultIcon = L.icon({
//       iconUrl: markerIcon,
//       shadowUrl: markerShadow,
//       iconSize: [25, 41],
//       iconAnchor: [12, 41],
//     });
//     L.Marker.prototype.options.icon = DefaultIcon;

//     if (!mapRef.current) {
//       mapRef.current = L.map("map").setView([0, 0], 2); // Default view
//       L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         attribution: "© OpenStreetMap contributors",
//       }).addTo(mapRef.current);
//     }

//     // Connect socket
//     socket.current = io("http://localhost:5005"); // Ensure this matches your backend port

//     socket.current.on("connect", () => {
//       console.log("Connected to WebSocket server");
//     });

//     socket.current.on("receive-location", ({ driverId, latitude, longitude }) => {
//       console.log("Received location:", { driverId, latitude, longitude });
//       if (driverId === selectedDriver) {
//         setDriverLocation({ latitude, longitude });
//       }
//     });

//     return () => {
//       socket.current.disconnect();
//     };
//   }, [selectedDriver]);

//   useEffect(() => {
//     const fetchDrivers = async () => {
//       try {
//         const res = await axios.get("http://localhost:5005/api/users/public/drivers");
//         setDrivers(res.data);
//       } catch (err) {
//         console.error("Failed to fetch drivers:", err);
//       }
//     };
//     fetchDrivers();
//   }, []);

//   useEffect(() => {
//     if (!mapRef.current || !driverLocation) return;

//     const { latitude, longitude } = driverLocation;

//     if (isNaN(latitude) || isNaN(longitude)) return;

//     if (markerRef.current) {
//       markerRef.current.setLatLng([latitude, longitude]);
//     } else {
//       markerRef.current = L.marker([latitude, longitude], {
//         title: `Selected Driver`,
//       }).addTo(mapRef.current);
//     }

//     mapRef.current.setView([latitude, longitude], 14);
//   }, [driverLocation]);

//   const handleChange = (e) => {
//     const driverId = e.target.value;
//     setSelectedDriver(driverId);

//     const clientId = localStorage.getItem("userId");
//     console.log("Selected Driver:", driverId);
//     console.log("Client ID:", clientId);

//     if (driverId && clientId) {
//       socket.current.emit("connect_to_driver", { driverId, clientId });
//     }
//   };

//   return (
//     <div style={{ padding: "20px", fontSize: "18px" }}>
//       <div style={styles.dropdownContainer}>
//         <label style={styles.label}>Select an Available Driver:</label>
//         <select value={selectedDriver} onChange={handleChange} style={styles.select}>
//           <option value="">-- Select Driver --</option>
//           {drivers.length > 0 ? (
//             drivers.map((driver) => (
//               <option key={driver._id} value={driver._id}>
//                 {driver.name}
//               </option>
//             ))
//           ) : (
//             <option value="">No available drivers</option>
//           )}
//         </select>
//       </div>

//       {driverLocation ? (
//         <div style={{ marginTop: "15px" }}>
//           <p><strong>Latitude:</strong> {driverLocation.latitude}</p>
//           <p><strong>Longitude:</strong> {driverLocation.longitude}</p>
//         </div>
//       ) : (
//         selectedDriver && <p>Waiting for driver's live location...</p>
//       )}

//       <div id="map" style={{ height: "60vh", width: "100%", marginTop: "20px" }} />
//     </div>
//   );
// };

// const styles = {
//   dropdownContainer: {
//     width: "300px",
//     margin: "0 auto",
//     padding: "20px",
//     backgroundColor: "#f4f4f4",
//     borderRadius: "8px",
//     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//   },
//   label: {
//     display: "block",
//     marginBottom: "10px",
//     fontSize: "16px",
//     fontWeight: "bold",
//     color: "#333",
//   },
//   select: {
//     width: "100%",
//     padding: "10px",
//     fontSize: "16px",
//     borderRadius: "5px",
//     border: "1px solid #ddd",
//     backgroundColor: "#fff",
//     cursor: "pointer",
//   },
// };

// export default ClientLocation;
