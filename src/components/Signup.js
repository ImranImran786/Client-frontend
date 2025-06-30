// import React, { useState } from "react";
// import axios from "axios";

// const Signup = () => {
//     const [name, setName] = useState("");
//     const [fatherName, setFatherName] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [cnic, setCnic] = useState("");
//     const [phone, setPhone] = useState("");
//     const [otherPhone, setOtherPhone] = useState("");
//     const [homeAddress, setHomeAddress] = useState("");
//     const [licenseNumber, setLicenseNumber] = useState("");
//     // const [role, setRole] = useState("client");
//     const [message, setMessage] = useState("");

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const { data } = await axios.post("http://localhost:5005/api/auth/register", {
//                 name,
//                 fatherName,
//                 email,
//                 password,
//                 cnic,
//                 phone,
//                 otherPhone,
//                 homeAddress,
//                 licenseNumber,
//                 // role,
//             });

//             localStorage.setItem("userToken", data.token);
//             setMessage("Signup successful!");
//         } catch (error) {
//             setMessage(error.response?.data?.message || "Signup failed");
//         }
//     };

//     return (
//         <div>
//             <form onSubmit={handleSubmit}>
//                 <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
//                 <input type="text" placeholder="Father's Name" value={fatherName} onChange={(e) => setFatherName(e.target.value)} required />
//                 <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//                 <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//                 <input type="text" placeholder="CNIC" value={cnic} onChange={(e) => setCnic(e.target.value)} required />
//                 <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
//                 <input type="text" placeholder="Other Phone (optional)" value={otherPhone} onChange={(e) => setOtherPhone(e.target.value)} />
//                 <input type="text" placeholder="Home Address" value={homeAddress} onChange={(e) => setHomeAddress(e.target.value)} required />
//                 {/* <select value={role} onChange={(e) => setRole(e.target.value)} required>
//                     <option value="client">Client</option>
//                 </select> */}
//                 <button type="submit">Signup</button>
//             </form>
//             {message && <p>{message}</p>}
//         </div>
//     );
// };

// export default Signup;


import React, { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cnic, setCnic] = useState("");
  const [phone, setPhone] = useState("");
  const [otherPhone, setOtherPhone] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  // const [role, setRole] = useState("client");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5005/api/auth/register", {
        name,
        fatherName,
        email,
        password,
        cnic,
        phone,
        otherPhone,
        homeAddress,
        licenseNumber,
        // role,
      });

      localStorage.setItem("userToken", data.token);
      setMessage("Signup successful!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.heading}>Signup</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Father's Name"
          value={fatherName}
          onChange={(e) => setFatherName(e.target.value)}
          required
          style={styles.input}
        />
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
        <input
          type="text"
          placeholder="CNIC"
          value={cnic}
          onChange={(e) => setCnic(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Other Phone (optional)"
          value={otherPhone}
          onChange={(e) => setOtherPhone(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Home Address"
          value={homeAddress}
          onChange={(e) => setHomeAddress(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="text"
          placeholder="License Number"
          value={licenseNumber}
          onChange={(e) => setLicenseNumber(e.target.value)}
          style={styles.input}
        />
        {/* 
        <select value={role} onChange={(e) => setRole(e.target.value)} required style={styles.input}>
          <option value="client">Client</option>
        </select>
        */}
        <button type="submit" style={styles.button}>
          Signup
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

export default Signup;
