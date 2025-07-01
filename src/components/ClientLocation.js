// import axios from "axios";
// import { useLocation } from "react-router-dom";
// import React, { useEffect, useState, useRef } from "react";
// import { io } from "socket.io-client";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";
// import "./location.css";

// const ClientLocation = () => {
//   const location = useLocation();
//   const clientId = location.state?.userId;
//   const [driverInfo, setDriverInfo] = useState(null);
//   const [notConnected, setNotConnected] = useState(false);

//   const [driverLocations, setDriverLocations] = useState({});
//   const mapRef = useRef(null);
//   const markersRef = useRef({});
//   const socket = useRef(null);

//   // Setup socket connection
//   const initializeSocket = (driverId) => {
//     // socket.current = io("https://location-backend-production-058e.up.railway.app/");
//       socket.current = io("https://location-backend-production-058e.up.railway.app", {
//   transports: ["websocket"],       // ✅ Force WebSocket only
//   withCredentials: true            // ✅ Allow credentials for CORS
// });


//     socket.current.on("connect", () => {
//       console.log("✅ Client connected to WebSocket server");
//       socket.current.emit("register_client", clientId);
//     });

//     socket.current.on("receive-location", (locations) => {
//       console.log("Updated Driver Locations:", locations);
//       setDriverLocations(locations);
//     });

//     socket.current.on("disconnect", () => {
//       console.warn("⚠️ WebSocket disconnected");
//     });
//   };

//   useEffect(() => {
//     const checkDriverConnection = async () => {
//       try {
//         const res = await axios.get(`https://database-production-3a68.up.railway.app/api/client/check-connection/${clientId}`);
//         if (res.data && res.data.driver && res.data.driver._id) {
//           const driver = res.data.driver;
//           setDriverInfo(driver);
//           initializeSocket(driver._id);
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
//     <div className="driver-location-container">
//   <h2 className="location-title">Driver Live Location Updates</h2>

//   {notConnected ? (
//     <p className="not-connected">
//       ❌ You are not connected to any driver OR Driver is Offline. Please contact the admin.
//     </p>
//   ) : (
//     <>
//       {driverInfo && (
//         <div className="driver-info-card">
//           <p><strong>Driver Name:</strong> {driverInfo.name || 'N/A'}</p>
//           <p><strong>Phone:</strong> {driverInfo.phone || 'N/A'}</p>
//           <p><strong>Status:</strong> {driverInfo.status}</p>
//           <p><strong>Vehicle no:</strong> {driverInfo.licenseNumber || 'N/A'}</p>
//           {/* <p><strong>Driver ID:</strong> {driverInfo._id}</p> */}
//           {/* <p><strong>Connected Client ID:</strong> {driverInfo.connectedClientId}</p> */}
//         </div>
//       )}

//       <div>
//         <ul className="location-list">
//           {Object.entries(driverLocations).map(([id, { latitude, longitude }]) => (
//             <li key={id}>
//               {/* Display driver coordinates if needed */}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </>
//   )}

//   <div id="map" className="map-container" />
// </div>



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

  // Configure Leaflet default icon
  useEffect(() => {
    const DefaultIcon = L.icon({
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);

  // Initialize the map
  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map("map").setView([30.1575, 71.5249], 12); // Centered in Pakistan
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);
      mapRef.current = map;
    }
  }, []);

  // Check connection and set up socket
  useEffect(() => {
    const checkDriverConnection = async () => {
      try {
        const res = await axios.get(
          `https://database-production-3a68.up.railway.app/api/client/check-connection/${clientId}`
        );
        if (res.data?.driver?._id) {
          const driver = res.data.driver;
          setDriverInfo(driver);
          initializeSocket(driver._id);
        } else {
          setNotConnected(true);
        }
      } catch (error) {
        console.error("❌ Error checking driver connection:", error);
        setNotConnected(true);
      }
    };

    if (clientId) checkDriverConnection();
  }, [clientId]);

  // Initialize Socket.IO
  const initializeSocket = (driverId) => {
    socket.current = io("https://location-backend-production-058e.up.railway.app", {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.current.on("connect", () => {
      console.log("✅ Client connected to WebSocket");
      socket.current.emit("register_client", clientId);
    });

    socket.current.on("receive-location", (locations) => {
      console.log("📍 Received location updates:", locations);
      setDriverLocations(locations);
    });

    socket.current.on("disconnect", () => {
      console.warn("⚠️ Socket disconnected");
    });
  };

  // Update map markers on location change
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
              <p><strong>Name:</strong> {driverInfo.name || 'N/A'}</p>
              <p><strong>Phone:</strong> {driverInfo.phone || 'N/A'}</p>
              <p><strong>Status:</strong> {driverInfo.status || 'Offline'}</p>
              <p><strong>Vehicle:</strong> {driverInfo.licenseNumber || 'N/A'}</p>
            </div>
          )}
        </>
      )}

      <div id="map" className="map-container" />
    </div>
  );
};

export default ClientLocation;













