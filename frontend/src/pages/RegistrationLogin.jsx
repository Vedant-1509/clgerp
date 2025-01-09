import React, { useState } from "react";
import axios from "axios";
import "../css/Registration.css";

const RegistrationLogin = () => {
  const [isRegistered, setIsRegistered] = useState(true);
  const [formData, setFormData] = useState({
    pnrNo: "",
    name: "",
    email: "",
    department: "",
    year: "",
    setPassword: "",
    confirmPassword: "",
    loginEmail: "",
    loginPassword: "",
  });

  const [modalContent, setModalContent] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  // const handleRegister = async (e) => {
  //   e.preventDefault();
  //   if (formData.setPassword !== formData.confirmPassword) {
  //     showModal("Passwords do not match!");
  //     return;
  //   }
  //   try {
  //     const response = await axios.post("http://localhost:5000/api/user/register", formData, {
  //       headers: { "Content-Type": "application/json" },
  //     });
  //     const data = response.data;
  //     if (data.success) {
  //       showModal("Registration successful! You can now log in.");
  //       setIsRegistered(true);
  //     } else {
  //       showModal(data.message || "Registration failed!");
  //     }
  //   } catch (error) {
  //     showModal("An error occurred during registration.");
  //   }
  // };

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
        setIsRegistered(true);
      } else {
        showModal(data.message || "Registration failed!");
      }
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      showModal(error.response?.data?.message || "An error occurred during registration.");
    }
  };
  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/user/login", {
        email: formData.loginEmail,
        password: formData.loginPassword,
      }, {
        headers: { "Content-Type": "application/json" },
      });
      const data = response.data;
      if (data.success) {
        showModal("Login successful!");
      } else {
        showModal(data.message || "Login failed!");
      }
    } catch (error) {
      showModal("An error occurred during login.");
    }
  };

  return (
    <div className="container">
      <h2>{isRegistered ? "Login" : "Register"}</h2>

      {isRegistered ? (
        <form onSubmit={handleLogin} className="form">
          <div className="form-group">
            <label>Email: </label>
            <input
              type="email"
              name="loginEmail"
              value={formData.loginEmail}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password: </label>
            <input
              type="password"
              name="loginPassword"
              value={formData.loginPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="btn">Login</button>
          <p>
            Not registered yet? <button type="button" onClick={() => setIsRegistered(false)} className="link-btn">Register</button>
          </p>
        </form>
      ) : (
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
              type="text"
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
            Already registered? <button type="button" onClick={() => setIsRegistered(true)} className="link-btn">Login</button>
          </p>
        </form>
      )}

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

export default RegistrationLogin;
