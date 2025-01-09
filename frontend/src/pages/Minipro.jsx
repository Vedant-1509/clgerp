import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Dashboard.css" // Import the CSS file

const StudentComponent = () => {


  //states initailization
  const [userData, setUserData] = useState(null);
  const [classmates, setClassmates] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [projectDetails, setProjectDetails] = useState({
    title: "",
    description: "",
    techStack: "",
  });



  //aaded for correction

  

  const navigate = useNavigate();



  //use effect


  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      navigate("/"); // Redirect to login if not authenticated
    } else {
      setUserData(user);
      fetchClassmates(user);
      setSelectedTeam([user]); // Add logged-in user to the team by default
    }
  }, []);



  const fetchClassmates = async (user) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/students/same-department-year",
        { department: user.department, year: user.year },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setClassmates(response.data.students);
    } catch (error) {
      console.error("Error fetching classmates:", error.message);
    }
  };

  // const handleAddToTeam = (classmate) => {
  //   if (selectedTeam.length >= 4) {
  //     alert("Maximum team size (4 members) reached!");
  //     return;
  //   }
  //   const isAlreadyInTeam = selectedTeam.some(
  //     (member) => member.id === classmate.id
  //   );
  //   if (isAlreadyInTeam) {
  //     alert("This classmate is already in the team!");
  //     return;
  //   }
  //   setSelectedTeam((prevTeam) => [...prevTeam, classmate]);
  // };



  const handleAddToTeam = (pnrNo) => {
    const selectedStudent = classmates.find((student) => student.pnrNo === pnrNo);
    if (selectedStudent && !selectedTeam.find((member) => member.pnrNo === pnrNo)) {
     setSelectedTeam((prevTeam) => [...prevTeam, selectedStudent]);
    }
  };







  const handleRemoveFromTeam = (id) => {
    setSelectedTeam(selectedTeam.filter((member) => member.id !== id));
  };

  const handleProjectInputChange = (e) => {
    const { name, value } = e.target;
    setProjectDetails({ ...projectDetails, [name]: value });
  };

  const handleSaveProject = async () => {
    if (selectedTeam.length < 2) {
      alert("Team must have at least 2 members (including you).");
      return;
    }
    if (!projectDetails.title || !projectDetails.description || !projectDetails.techStack) {
      alert("Please fill in all project details.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/project/save",
        {
          leaderId: userData.id,
          team: selectedTeam.map((member) => member.id),
          projectDetails,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert(response.data.message || "Project and team saved successfully!");
    } catch (error) {
      console.error("Error saving project:", error.message);
      alert("Failed to save the project. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };



  return (

    //logged person details
    <div className="dashboard-container">
      {/* Top Section: User Info */}
      <div className="top-section">
        <h1>Welcome, {userData?.name}!</h1>
        <p>
          Department: {userData?.department} | Year: {userData?.year} | PNR:
          {userData?.pnrNo}
        </p>
        <button onClick={handleLogout} className="btn logout-btn">
          Logout
        </button>
      </div>

      {/* Middle Section: Classmates Table */}
      <div className="classmates-section">
        <h2>Classmates</h2>
        {/* Re-usable StudentsTable component */}
        <StudentsTable
          students={classmates}
          handleAddToTeam={handleAddToTeam} 
        /> 
      </div>

      {/* Third Section: Selected Team */}
      <div className="team-section">
        <h2>Selected Team</h2>
        <ul>
          {selectedTeam.map((member) => (
            <li key={member.id}>
              {member.name} ({member.pnrNo})
              {member.id !== userData.id && (
                <button
                  onClick={() => handleRemoveFromTeam(member.id)}
                  className="btn-remove"
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Section: Project Details */}
      <div className="project-details-section">
        <h2>Project Details</h2>
        <form>
          <div className="form-group">
            <label>Project Title:</label>
            <input
              type="text"
              name="title"
              value={projectDetails.title}
              onChange={handleProjectInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Project Description:</label>
            <textarea
              name="description"
              value={projectDetails.description}
              onChange={handleProjectInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Tech Stack:</label>
            <input
              type="text"
              name="techStack"
              value={projectDetails.techStack}
              onChange={handleProjectInputChange}
              required
            />
          </div>
          <button type="button" onClick={handleSaveProject} className="btn-save">
            Save Project
          </button>
        </form>
      </div>
    </div>
  );
};

// Re-usable StudentsTable component
const StudentsTable = ({ students, handleAddToTeam }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>PNR</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {students.length > 0 ? (
          students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.emailId}</td>
              <td>{student.pnrNo}</td>
              <td>
                <button
                  onClick={() => handleAddToTeam(student)}
                  className="btn-add"
                >
                  Add to Team
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" style={{ textAlign: "center" }}>
              No classmates found for your department and year.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default StudentComponent;