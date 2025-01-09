import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from React Router
import axios from "axios";
import { Link } from 'react-router-dom'
import "../css/Registration.css";

const Login = ({ toggleView }) => {
  const [formData, setFormData] = useState({
    loginEmail: "",
    loginPassword: "",
  });

  const [modalContent, setModalContent] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const navigate = useNavigate(); 

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
    navigate("/middlepage");
  };

const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/login",
        {
          email: formData.loginEmail,
          password: formData.loginPassword,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
      const data = response.data;
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
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
      <h2>Login</h2>
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
          Not registered yet?{" "}
          <Link to="/">Login</Link>
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

export default Login;
