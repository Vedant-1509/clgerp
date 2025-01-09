import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../css/Registration.css";

const Register = ({ toggleView }) => {
  const [formData, setFormData] = useState({
    pnrNo: "",
    name: "",
    email: "",
    department: "",
    year: "",
    setPassword: "",
    confirmPassword: "",
  });

  const [modalContent, setModalContent] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
 // const [isRegistered, setIsRegistered] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const showModal = (message) => {
    setModalContent(message);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setModalContent("");
  };

//   const handleRegister = async (e) => {
//     e.preventDefault();

//     if (formData.setPassword !== formData.confirmPassword) {
//       showModal("Passwords do not match!");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/user/register",
//         {
//           pnrNo: formData.pnrNo,
//           name: formData.name,
//           email: formData.email,
//           department: formData.department,
//           year: formData.year,
//           setPassword: formData.setPassword,
//         },
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       const data = response.data;
//       if (data.success) {
//         showModal("Registration successful! You can now log in.");
//         setFormData({
//           pnrNo: "",
//           name: "",
//           email: "",
//           department: "",
//           year: "",
//           setPassword: "",
//           confirmPassword: "",
//         });
//         toggleView(); // Switch to login view
//       } else {
//         showModal(data.message || "Registration failed!");
//       }
//     } catch (error) {
//       showModal(error.response?.data?.message || "An error occurred during registration.");
//     }
//   };

const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.setPassword !== formData.confirmPassword) {
      showModal("Passwords do not match!");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5000/api/user/register", formData, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("API Response:", response.data);
      const data = response.data;
      if (data.success) {
        showModal("Registration successful! You can now log in.");
        //setIsRegistered(true);
      } else {
        showModal(data.message || "Registration failed!");
      }
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      showModal(error.response?.data?.message || "An error occurred during registration.");
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleRegister} className="form">
        <div className="form-group">
          <label>PNR No: </label>
          <input
            type="text"
            name="pnrNo"
            value={formData.pnrNo}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Name: </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email: </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Department: </label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Year: </label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Set Password: </label>
          <input
            type="password"
            name="setPassword"
            value={formData.setPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Password: </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="btn">Register</button>
        <p>
          Already registered?{" "}
          <Link to="/login">Login</Link>
        </p>
      </form>
      {isModalVisible && (
        <div className="modal">
          <div className="modal-content">
            <p>{modalContent}</p>
            <button className="btn" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
