// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";

// const MiddlePage = () => {
//   const [isAvailable, setIsAvailable] = useState(null);
//   const [projectDetails, setProjectDetails] = useState([]);
//   const [modalContent, setModalContent] = useState("");
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const user = JSON.parse(localStorage.getItem("user"));

//     if (!token || !user) {
//       navigate("/"); // Redirect to login if not authenticated
//     } else {
//       setIsAvailable(user.isAvailable);
//       if (user.isAvailable === 0) {
//         fetchProjectDetails(user); // Fetch project details only when user is part of a team
//       }
//     }
//     console.log(user)
//   }, [navigate]);

//   const fetchProjectDetails = async (user) => {
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/fetchprojectdetails",
//         { pnrNo: user.pnrNo },
        
//       );

//       if (response.data.success) {
//         setProjectDetails(response.data.projects); // Assuming response.data.projects contains project details
//       } else {
//         console.error("Error fetching project details:", response.data.error);
//       }
//     } catch (error) {
//       console.error("Error fetching project details:", error.message);
//     }
//   };

//   const exitmodal = () => {
//       setModalContent("Are you sure you want to exit?");
//       setIsModalVisible(true);

//   }

//   const sureexit=async(user)=>{
//     setIsModalVisible(false);
//     try {
//       const response = await axios.post("http://localhost:5000/exitteam",{ pnrNo: user.pnrNo },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//       )
//     if (response.data.success) {
//       setIsAvailable(true);
//       setModalContent("Exited from the team successfully")
//     }
//     } catch (error) {
      
//     }

//   }

//   const noexit =()=>{
//     setIsModalVisible(false);
//     setIsModalVisible("")
//   }

//   return (
//     <div>
//       {isAvailable === null ? (
//         <p>Loading...</p>
//       ) : isAvailable === 1 ? (
//         <>
//           <p>You haven't formed the team for the project yet.</p>
//           <Link to="/miniproject">Form the Team</Link>
//         </>
//       ) : (
//         <div>
//           <h2>Your Project Details:</h2>
//           {projectDetails.length > 0 ? (
//             <ul>
//               {projectDetails.map((project) => (
//                 <li key={project.id}>
//                   <p>
//                     <strong>Title:</strong> {project.title}
//                   </p>
//                   <p>
//                     <strong>Description:</strong> {project.description}
//                   </p>
//                   <p>
//                     <strong>Tech Stack:</strong> {project.tech_stack}
//                   </p>
//                   <p>
//                     <strong>Team guide:</strong>{project.guideName}
//                   </p>
//                   <button color={"red"} onClick={exitmodal}>Exit Team</button>
//                   {isModalVisible && (
//                   <div className="modal">
//                     <div className="modal-content">
//                       <p>{modalContent}</p>
//                       <button className="btn" onClick={sureexit}>yes</button>
//                       <button className="btn" onClick={noexit}>no</button>
//                     </div>
//                   </div>
//                 )}
//                 </li>
                
//               ))}
//             </ul>
//           ) : (
//             <p>No project details found.</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MiddlePage;



import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const MiddlePage = () => {
  const [isAvailable, setIsAvailable] = useState(null);
  const [projectDetails, setProjectDetails] = useState([]);
  const [modalContent, setModalContent] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      navigate("/"); // Redirect to login if not authenticated
    } else {
      setIsAvailable(user.isAvailable);
      if (user.isAvailable === 0) {
        fetchProjectDetails(user); // Fetch project details only when user is part of a team
      }
    }
  }, [navigate]);

  const fetchProjectDetails = async (user) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/fetchprojectdetails",
        { pnrNo: user.pnrNo },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        setProjectDetails(response.data.projects); // Assuming response.data.projects contains project details
      } else {
        console.error("Error fetching project details:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching project details:", error.message);
    }
  };

  const showExitModal = () => {
    setModalContent("Are you sure you want to exit?");
    setIsModalVisible(true);
  };

  const handleExit = async () => {
    setIsModalVisible(false);
    try {
      const user = JSON.parse(localStorage.getItem("user")); // Retrieve user details
      const response = await axios.post(
        "http://localhost:5000/exitteam",
        { pnrNo: user.pnrNo }
      );

      if (response.data.success) {
        setIsAvailable(1); // Update availability to true
        setModalContent("Exited from the team successfully.");
      } else {
        console.error("Error exiting the team:", response.data.message);
      }
    } catch (error) {
      console.error("Error exiting the team:", error.message);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setModalContent("");
  };

  return (
    <div>
      {isAvailable === null ? (
        <p>Loading...</p>
      ) : isAvailable === 1 ? (
        <>
          <p>You haven't formed the team for the project yet.</p>
          <Link to="/miniproject">Form the Team</Link>
        </>
      ) : (
        <div>
          <h2>Your Project Details:</h2>
          {projectDetails.length > 0 ? (
            <ul>
              {projectDetails.map((project) => (
                <li key={project.id} style={{ marginBottom: "20px", listStyle: "none" }}>
                  <p>
                    <strong>Title:</strong> {project.title}
                  </p>
                  <p>
                    <strong>Description:</strong> {project.description}
                  </p>
                  <p>
                    <strong>Tech Stack:</strong> {project.tech_stack}
                  </p>
                  <p>
                    <strong>Team Guide:</strong> {project.guideName}
                  </p>
                  <button style={{ backgroundColor: "red", color: "white" }} onClick={showExitModal}>
                    Exit Team
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No project details found.</p>
          )}
          {isModalVisible && (
            <div>
              <div className="modal-content">
                <p>{modalContent}</p>
                <button
                  className="btn"
                  onClick={handleExit}
                >
                  Yes
                </button>
                <button className="btn" onClick={closeModal}>
                  No
                </button>
              </div>
            </div>
          )}
         
        </div>
      )}
    </div>
  );
};

export default MiddlePage;
