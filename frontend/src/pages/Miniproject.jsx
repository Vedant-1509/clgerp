import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Dashboard.css"

const StudentComponent = () => {
  const navigate = useNavigate()

  const [userData, setUserData] = useState(null)
  const [students, setStudents] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

    const [projectDetails, setProjectDetails] = useState({
      title: "",
      description: "",
      techStack: "",
    });

  useEffect(() => {
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user"));
    if (!token || !user) {
      navigate("/"); // Redirect to login if not authenticated
    } else {
      setUserData(user)
      fetchstudents(user)
    }
  }, [])


  const fetchstudents = async (user) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/students/same-department-year",
        { department: user.department, year: user.year },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setStudents(response.data.students);
    } catch (error) {
      console.error("Error fetching classmates:", error.message);
    }

  }

  const handleAddToTeam = (pnrNo) => {
    if (teamMembers.length === 4) {
      alert("Team size is full")
      return
    }
    const teamMember = students.find((student) => student.pnrNo === pnrNo)
    if (teamMember && !teamMembers.find((member) => member.pnrNo === pnrNo)) {
      setTeamMembers([...teamMembers, teamMember])
    }
  }


  const handleRemoveFromTeam = (pnrNo) => {
    setTeamMembers((prevTeam) => prevTeam.filter((member) => member.pnrNo !== pnrNo));
  };


  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleProjectInputChange = (e) => {
    const { name, value } = e.target;
    setProjectDetails({ ...projectDetails, [name]: value });
  };

  
  const handleSaveProject = async () => {
    
    if (teamMembers.length < 2) {
      alert("Team should have at least 2 members.");
      return;
    }
  
    
    if (!projectDetails.title || !projectDetails.description || !projectDetails.techStack) {
      alert("Please fill in all project details.");
      return;
    }
  
    try {
      
      const response = await axios.post(
        "http://localhost:5000/minipro3",
        {
          leaderId: userData.pnrNo,
          title: projectDetails.title,
          description: projectDetails.description,
          tech_stack: projectDetails.techStack,
          teamMembers: teamMembers.map((member) => member.pnrNo), // Send all team members as an array
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
      const data = response.data;
      if (data.success) {
        alert("Project saved successfully!");
      } else {
        alert("Failed to save project.");
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred while saving the project. Please try again.");
    }
  };
  
  


  return (
    <div>
      <div className="id-card-container">
        <h1>Welcome, {userData?.name}</h1>
        <p><strong>Department:</strong> {userData?.department}</p>
        <p><strong>Year:</strong> {userData?.year}</p>
        <p><strong>PNR:</strong> {userData?.pnrNo}</p>
        <button onClick={handleLogout} className="btn logout-btn">Logout</button>
      </div>


      <div>
        <h2>Classmates</h2><br />
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
                <tr key={student.pnrNo}>
                  <td>{student.name}</td>
                  <td>{student.emailId}</td>
                  <td>{student.pnrNo}</td>
                  <td>
                    <button
                      onClick={() => handleAddToTeam(student.pnrNo)}
                    >
                      Add to Team
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No classmates found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div>
        <h2>Team Members</h2><br />
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
            {teamMembers.length > 0 ? (teamMembers.map((member) => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.emailId}</td>
                <td>{member.pnrNo}</td>
                <td>
                  <button
                    onClick={() => handleRemoveFromTeam(member.pnrNo)}
                  >
                    remove
                  </button>
                </td>
              </tr>
            ))) : (
              <tr>
                <td colSpan="4">team member yet to add</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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
  )
}

export default StudentComponent
