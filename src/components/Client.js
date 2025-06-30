import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://database-production-3a68.up.railway.app/");

const Client = () => {
  const [imageURL, setImageURL] = useState(null);
  const userEmail = localStorage.getItem("userEmail"); // Get email from localStorage

  useEffect(() => {
    // Listen for approved images
    socket.on("receiveImage", (url) => {
      setImageURL(url);
    });

    return () => {
      socket.off("receiveImage");
    };
  }, []);

  const requestPermission = () => {
    if (userEmail) {
      socket.emit("sendPermissionRequest", { clientSocketId: socket.id, clientEmail: userEmail });
    } else {
      console.error("User email not found!");
    }
  };

  return (
    <div>
      <h2>Client Panel</h2>
      <p>Logged in as: {userEmail}</p>
      <button onClick={requestPermission}>Request Image Access</button>
      {imageURL && <img src={imageURL} alt="Authorized Content" width="300px" />}
    </div>
  );
};

export default Client;

