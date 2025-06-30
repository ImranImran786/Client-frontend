// import React from "react";
// import { Link, useNavigate } from "react-router-dom";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const handleLogout = () => {
//     localStorage.removeItem("userToken"); // Remove token
//     localStorage.removeItem("userInfo");  // Remove user info
//     navigate("/login"); // Redirect to login page
//   };

//   return (
//     <nav className="navbar navbar-expand-lg navbar-light bg-light">
//       <div className="container-fluid">
//         <Link className="navbar-brand" to="/">Home</Link>
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarSupportedContent"
//           aria-controls="navbarSupportedContent"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon" />
//         </button>
//         <div className="collapse navbar-collapse" id="navbarSupportedContent">
//           <ul className="navbar-nav me-auto mb-2 mb-lg-0">
//             <li className="nav-item">
//               <Link className="nav-link active" to="/login">Login</Link>
//             </li>
//             <li className="nav-item">
//               <Link className="nav-link" to="/signup">Signup</Link>
//             </li>
//             <li className="nav-item">
//               <Link className="nav-link" to="/clientlocation">Show Location</Link>
//             </li>
            
//             <li className="nav-item">
//               <Link className="nav-link" to="/imagerequest">image request</Link>
//             </li>
            
//             <li className="nav-item">
//               <Link className="nav-link" to="/videorequest">Video Request</Link>
//             </li>
//             <li className="nav-item">
//               <button
//                 onClick={handleLogout}
//                 className="btn btn-danger"
//                 style={{ marginLeft: "10px" }}
//               >
//                 Logout
//               </button>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;




import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem("userToken");

    const handleLogout = () => {
        localStorage.removeItem("userToken");
        navigate("/login"); // Redirect to login page
    };

    return (
        <nav className="navbar">
            <h2 className="logo">Client Panel</h2>
            <ul className="nav-links">
                <li><Link to="/"></Link></li>
                {isAuthenticated ? (
                    <>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><button onClick={handleLogout}>Logout</button></li>
                    </>
                ) : (
                    <>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/signup">signup</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
