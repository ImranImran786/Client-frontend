// import React from "react";
// import { Link, useNavigate } from "react-router-dom";

// const Navbar = () => {
//     const navigate = useNavigate();
//     const isAuthenticated = !!localStorage.getItem("userToken");

//     const handleLogout = () => {
//         localStorage.removeItem("userToken");
//         navigate("/login"); // Redirect to login page
//     };

//     return (
//         <nav className="navbar">
//             <h2 className="logo">Client Panel</h2>
//             <ul className="nav-links">
//                 <li><Link to="/"></Link></li>
//                 {isAuthenticated ? (
//                     <>
//                         <li><Link to="/dashboard">Dashboard</Link></li>
//                         <li><button onClick={handleLogout}>Logout</button></li>
//                     </>
//                 ) : (
//                     <>
//                     <li><Link to="/login">Login</Link></li>
//                     <li><Link to="/signup">signup</Link></li>
//                     </>
//                 )}
//             </ul>
//         </nav>
//     );
// };

// export default Navbar;





import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem("userToken");

    const handleLogout = () => {
        localStorage.removeItem("userToken");
        navigate("/login");
    };

    const styles = {
        navbar: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 20px',
            backgroundColor: '#2c3e50',
            color: 'white',
            flexWrap: 'wrap',
        },
        logo: {
            fontSize: '20px',
            fontWeight: 'bold',
            flex: '1',
            textAlign: 'left',
        },
        navLinks: {
            listStyle: 'none',
            display: 'flex',
            gap: '15px',
            margin: 0,
            padding: 0,
            flex: 1,
            justifyContent: 'flex-end',
        },
        navItem: {
            display: 'inline-block',
        },
        link: {
            color: 'white',
            textDecoration: 'none',
            fontSize: '14px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
        },
        // Responsive overrides for mobile
        responsiveContainer: {
            width: '100%',
            textAlign: 'center',
        },
        responsiveLogo: {
            flex: '100%',
            textAlign: 'center',
            marginBottom: '10px',
        },
        responsiveNavLinks: {
            width: '100%',
            justifyContent: 'flex-end',
        }
    };

    // Media query check (manual for inline)
    const isMobile = window.innerWidth <= 768;

    return (
        <nav style={styles.navbar}>
            <h2 style={isMobile ? styles.responsiveLogo : styles.logo}>Client Panel</h2>

            <ul style={isMobile ? { ...styles.navLinks, ...styles.responsiveNavLinks } : styles.navLinks}>
                {isAuthenticated ? (
                    <>
                        <li style={styles.navItem}>
                            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
                        </li>
                        <li style={styles.navItem}>
                            <button onClick={handleLogout} style={styles.link}>Logout</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li style={styles.navItem}>
                            <Link to="/login" style={styles.link}>Login</Link>
                        </li>
                        <li style={styles.navItem}>
                            <Link to="/signup" style={styles.link}>Signup</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
