// import React, { useEffect, useState } from "react";
// import { Link, Routes, Route } from "react-router-dom";
// import axios from "axios";
// import "./Dashboard.css";
// // import Signup from "./Signup";
// import VideoRequest from "./VideoRequest";
// import ClientLocation from "./ClientLocation";

// const Dashboard = () => {
//     const userEmail = localStorage.getItem("userEmail");
//     const userId = localStorage.getItem("userId");
//     const token = localStorage.getItem("userToken");

//     const [clientData, setClientData] = useState(null);

//     // Debugging: Log userId and token
//     console.log("UserID:", userId);
//     console.log("Token:", token);

//     useEffect(() => {
//         if (!userId || !token) {
//             console.log("User ID or Token is missing!");
//             return;
//         }

//         const fetchClientData = async () => {
//             try {
//                 const { data } = await axios.get(`https://database-production-3a68.up.railway.app/api/users/${userId}`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });

//                 // Debugging: Log the API response
//                 console.log("Client Data Response:", data);

//                 setClientData(data); // Save client data like name, email, etc.
//             } catch (error) {
//                 console.error("Error fetching client data:", error);
//             }
//         };

//         fetchClientData();
//     }, [userId, token]);

//     return (
//         <div className="dashboard-layout">
//             <div className="dashboard-container">
//                 <aside className="sidebar">
//                     <ul>
//                         <li><Link to="/dashboard/videorequest">Video Request</Link></li>
//                         {/* <li><Link to="/dashboard/signup">Signup</Link></li> */}
//                         <li>
//                             <Link
//                                 to="/dashboard/clientlocation"
//                                 state={{ userId }}
//                             >
//                                 Driver Location
//                             </Link>

//                         </li>
//                     </ul>
//                 </aside>


//                 {/* Main Content */}
//                 <main className="content">
//                     <Routes>
//                         <Route path="/" element={
//                             <div className="dashboard-home">
//                                 <h1 className="dashboard-title">Welcome to the Client Dashboard</h1>
//                                 <p className="dashboard-subtitle">Use the sidebar to manage your actions.</p>
//                                 <p className="logged-in">Logged in as: <strong>{userEmail}</strong></p>

//                                 {clientData ? (
//                                     <div className="client-card">
//                                         <h2 className="card-title">Client Information</h2>
//                                         <div className="client-info-row">
//                                             <span className="label">Name:</span>
//                                             <span className="value">
//                                                 {clientData.name || "N/A"} {clientData.fatherName || ""}
//                                             </span>

//                                         </div>
//                                         <div className="client-info-row">
//                                             <span className="label">Phone number:</span>
//                                             <span className="value">{clientData.phone || "N/A"}</span>
//                                         </div>
//                                         <div className="client-info-row">
//                                             <span className="label">Email:</span>
//                                             <span className="value">{clientData.email}</span>
//                                         </div>
//                                     </div>
//                                 ) : (
//                                     <p className="loading-text">Loading client data...</p>
//                                 )}
//                             </div>
//                         } />
//                         <Route path="videorequest" element={<VideoRequest userEmail={userEmail} />} />
//                         {/* <Route path="signup" element={<Signup />} /> */}
//                         <Route path="clientlocation" element={<ClientLocation userEmail={userEmail} />} />
//                     </Routes>
//                 </main>

//             </div>
//         </div>
//     );
// };

// export default Dashboard;











import React, { useEffect, useState } from "react";
import { Link, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";
import VideoRequest from "./VideoRequest";
import ClientLocation from "./ClientLocation";

const Dashboard = () => {
    const userEmail = localStorage.getItem("userEmail");
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("userToken");

    const [clientData, setClientData] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!userId || !token) return;

        const fetchClientData = async () => {
            try {
                const { data } = await axios.get(
                    `https://database-production-3a68.up.railway.app/api/users/${userId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setClientData(data);
            } catch (error) {
                console.error("Error fetching client data:", error);
            }
        };

        fetchClientData();
    }, [userId, token]);

    const handleLogout = async () => {
        try {
            await axios.put(
                `https://database-production-3a68.up.railway.app/api/users/update-status/${userId}`,
                { status: "Offline" }
            );
            localStorage.clear();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Failed to logout. Try again.");
        }
    };

    return (
        <div className="dashboard-layout">
            {/* Sidebar Toggle Button */}
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? "✖" : "☰"}
            </button>

            <div className={`dashboard-container ${sidebarOpen ? "sidebar-open" : ""}`}>
                {/* Sidebar (combined) */}
                <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
                    <ul>
                        <li><Link to="/dashboard/videorequest" onClick={() => setSidebarOpen(false)}>Video Request</Link></li>
                        <li>
                            <Link
                                to="/dashboard/clientlocation"
                                state={{ userId }}
                                onClick={() => setSidebarOpen(false)}
                            >
                                Driver Location
                            </Link>
                        </li>
                        <li><button className="logout-button" onClick={handleLogout}>Logout</button></li>
                    </ul>
                </aside>

                {/* Main Content */}
                <main className="content" onClick={() => sidebarOpen && setSidebarOpen(false)}>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <div className="dashboard-home">
                                    <h1 className="dashboard-title">Welcome to the Client Dashboard</h1>
                                    <p className="dashboard-subtitle">Use the sidebar to manage your actions.</p>
                                    <p className="logged-in">Logged in as: <strong>{userEmail}</strong></p>

                                    {clientData ? (
                                        <div className="client-card">
                                            <h2 className="card-title">Client Information</h2>
                                            <div className="client-info-row">
                                                <span className="label">Name:</span>
                                                <span className="value">{clientData.name || "N/A"} {clientData.fatherName || ""}</span>
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
                            }
                        />
                        <Route path="videorequest" element={<VideoRequest userEmail={userEmail} />} />
                        <Route path="clientlocation" element={<ClientLocation userEmail={userEmail} />} />
                    </Routes>
                </main>
            </div>

            {/* Bottom Navbar for Mobile Devices */}
            <nav className="bottom-nav">
                <Link to="/dashboard/videorequest" className={location.pathname.includes("videorequest") ? "active" : ""}>
                    <span>🎥</span>
                    <small>Video</small>
                </Link>
                <Link to="/dashboard/clientlocation" className={location.pathname.includes("clientlocation") ? "active" : ""}>
                    <span>📍</span>
                    <small>Location</small>
                </Link>
            </nav>
        </div>
    );
};

export default Dashboard;
