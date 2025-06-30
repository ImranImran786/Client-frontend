// import React, { useEffect, useState } from "react";
// import { Link, Routes, Route } from "react-router-dom";
// import axios from "axios";
// import "./Dashboard.css";
// import Signup from "./Signup";
// import VideoRequest from "./VideoRequest";
// import ClientLocation from "./ClientLocation";
// import ImageRequest from "./ImageRequest";

// const Dashboard = () => {
//     const userEmail = localStorage.getItem("userEmail");
//     const userId = localStorage.getItem("userId");
//     const token = localStorage.getItem("userToken");

//     const [clientData, setClientData] = useState(null);

//     useEffect(() => {
//         const fetchClientData = async () => {
//             try {
//                 const { data } = await axios.get(`https://database-production-3a68.up.railway.app/api/users/${userId}`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 setClientData(data); // Save client data like name, email, etc.
//             } catch (error) {
//                 console.error("Error fetching client data", error);
//             }
//         };

//         if (userId && token) {
//             fetchClientData();
//         }
//     }, [userId, token]);

//     return (
//         <div className="dashboard-layout">
//             <div className="dashboard-container">
//                 <aside className="sidebar">
//                     <ul>
//                         <li><Link to="/dashboard/videorequest">Video Request</Link></li>
//                         <li><Link to="/dashboard/signup">Signup</Link></li>
//                         <li><Link to="/dashboard/clientlocation">Client Location</Link></li>
//                         <li><Link to="/dashboard/imagerequest">Image Request</Link></li>
//                     </ul>
//                 </aside>

//                 {/* Main Content */}
//                 <main className="content">
//                     <Routes>
//                         <Route path="/" element={
//                             <>
//                                 <h1>Welcome to the Client Dashboard</h1>
//                                 <p>Select an option from the sidebar to manage users and content.</p>
//                                 <p>Logged in as: <strong>{userEmail}</strong></p>

//                                 {/* Display fetched client info */}
//                                 {clientData && (
//                                     <div style={{ marginTop: "20px" }}>
//                                         <h3>Client Information</h3>
//                                         <p><strong>Name:</strong> {clientData.name || "N/A"}</p>
//                                         <p><strong>Email:</strong> {clientData.email}</p>
//                                         <p><strong>Status:</strong> {clientData.status || "N/A"}</p>
//                                         <p><strong>User ID:</strong> {clientData._id}</p>
//                                     </div>
//                                 )}
//                             </>
//                         } />
//                         <Route path="videorequest" element={<VideoRequest userEmail={userEmail} />} />
//                         <Route path="signup" element={<Signup />} />
//                         <Route path="clientlocation" element={<ClientLocation userEmail={userEmail} />} />
//                         <Route path="imagerequest" element={<ImageRequest userEmail={userEmail} />} />
//                     </Routes>
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;





import React, { useEffect, useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";
// import Signup from "./Signup";
import VideoRequest from "./VideoRequest";
import ClientLocation from "./ClientLocation";

const Dashboard = () => {
    const userEmail = localStorage.getItem("userEmail");
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("userToken");

    const [clientData, setClientData] = useState(null);

    // Debugging: Log userId and token
    console.log("UserID:", userId);
    console.log("Token:", token);

    useEffect(() => {
        if (!userId || !token) {
            console.log("User ID or Token is missing!");
            return;
        }

        const fetchClientData = async () => {
            try {
                const { data } = await axios.get(`https://database-production-3a68.up.railway.app/api/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Debugging: Log the API response
                console.log("Client Data Response:", data);

                setClientData(data); // Save client data like name, email, etc.
            } catch (error) {
                console.error("Error fetching client data:", error);
            }
        };

        fetchClientData();
    }, [userId, token]);

    return (
        <div className="dashboard-layout">
            <div className="dashboard-container">
                <aside className="sidebar">
                    <ul>
                        <li><Link to="/dashboard/videorequest">Video Request</Link></li>
                        {/* <li><Link to="/dashboard/signup">Signup</Link></li> */}
                        <li>
                            <Link
                                to="/dashboard/clientlocation"
                                state={{ userId }}
                            >
                                Driver Location
                            </Link>

                        </li>
                    </ul>
                </aside>


                {/* Main Content */}
                <main className="content">
                    <Routes>
                        <Route path="/" element={
                            <div className="dashboard-home">
                                <h1 className="dashboard-title">Welcome to the Client Dashboard</h1>
                                <p className="dashboard-subtitle">Use the sidebar to manage your actions.</p>
                                <p className="logged-in">Logged in as: <strong>{userEmail}</strong></p>

                                {clientData ? (
                                    <div className="client-card">
                                        <h2 className="card-title">Client Information</h2>
                                        <div className="client-info-row">
                                            <span className="label">Name:</span>
                                            <span className="value">
                                                {clientData.name || "N/A"} {clientData.fatherName || ""}
                                            </span>

                                        </div>
                                        <div className="client-info-row">
                                            <span className="label">Phone number:</span>
                                            <span className="value">{clientData.phone || "N/A"}</span>
                                        </div>
                                        <div className="client-info-row">
                                            <span className="label">Email:</span>
                                            <span className="value">{clientData.email}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="loading-text">Loading client data...</p>
                                )}
                            </div>
                        } />
                        <Route path="videorequest" element={<VideoRequest userEmail={userEmail} />} />
                        {/* <Route path="signup" element={<Signup />} /> */}
                        <Route path="clientlocation" element={<ClientLocation userEmail={userEmail} />} />
                    </Routes>
                </main>

            </div>
        </div>
    );
};

export default Dashboard;
