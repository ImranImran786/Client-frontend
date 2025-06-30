import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const { data } = await axios.post("https://database-production-3a68.up.railway.app/api/auth/login", {
  //       email,
  //       password,
  //     });

  //     // ✅ Store token, email, and userId (MongoDB _id) in localStorage
  //     localStorage.setItem("userToken", data.token);
  //     localStorage.setItem("userEmail", email);
  //     localStorage.setItem("userId", data.user._id);

  //     setMessage("Login successful!");
  //     navigate("/dashboard"); // Redirect to client page
  //   } catch (error) {
  //     setMessage(error.response?.data?.message || "Login failed");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("https://database-production-3a68.up.railway.app/api/auth/login", {
        email,
        password,
      });
  
      console.log("Login Response Data:", data); // Debugging: Check the structure of data
  
      // Store token, email, and userId (MongoDB _id) in localStorage
      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userId", data.driverId); // Ensure user._id is correct
  
      setMessage("Login successful!");
      navigate("/dashboard"); // Redirect to client page
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };
  
  
  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.heading}>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Login
        </button>
        {message && <p style={styles.message}>{message}</p>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  message: {
    marginTop: "15px",
    textAlign: "center",
    color: "#d9534f",
  },
};

export default Login;
