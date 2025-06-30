// import React from "react"; // ✅ Add this line
// import Home from "./components/Home";
// import Navbar from "./components/Navbar";

// const App = () => {
//   return (
//     <>
//     <h1>CLient App</h1>
//     <Navbar/>
//     <Home/>
//     </>
//   );
// };

// export default App;




// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Login from "./components/Login";
// import Dashboard from "./components/Dashboard";
// import Home from "./components/Home";

// const App = () => {
//   const isAuthenticated = !!localStorage.getItem("userToken");

//   return (
//     <>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
//         <Route path="/*" element={<Home />} />
//       </Routes>
//     </>
//   );
// };

// export default App;



import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Signup from "./components/Signup";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("userToken"));
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for token changes in localStorage
    const checkAuth = () => setIsAuthenticated(!!localStorage.getItem("userToken"));

    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/dashboard/*" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
};

export default App;
