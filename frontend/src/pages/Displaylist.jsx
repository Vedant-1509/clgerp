import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


const ProjectsList = () => {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);
    const [students, setStudents] = useState([]);
    const [guides, setGuides] = useState([]);
    const [selectedGuides, setSelectedGuides] = useState({});

    useEffect(() => {
        fetchProjects();
        fetchGuides();
        nogroupstudents();
    }, []);

    const fetchGuides = async () => {
        try {
            const response = await axios.get('http://localhost:5000/guides');
            if (response.data.success) {
                setGuides(response.data.guides);
            } else {
                setError('Failed to fetch guides');
            }
        } catch (err) {
            setError('Error fetching guides');
            console.error(err);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:5000/projects');
            if (response.data.success) {
                setProjects(response.data.projects);
            } else {
                setError('Failed to fetch project data');
            }
        } catch (err) {
            setError('Error fetching projects');
            console.error(err);
        }
    };

    const nogroupstudents = async () => {
        try {
            const response = await axios.get('http://localhost:5000/nogroup');
            if (response.data.success) {
                setStudents(response.data.students);
            } else {
                setError('Failed to fetch project data');
            }
        } catch (err) {
            setError('Error fetching projects');
            console.error(err);
        }
    };

    const handleGuideChange = (projectId, guideName) => {
        setSelectedGuides((prev) => ({
            ...prev,
            [projectId]: guideName,
        }));
    };

    const assignGuide = async (projectId) => {
        const guideName = selectedGuides[projectId];
        if (!guideName) {
            alert('Please select a guide.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/assign-guide', {
                projectId,
                guideName,
            });

            if (response.data.success) {
                alert('Guide assigned successfully.');
                fetchProjects(); // Refresh project data
            } else {
                alert('Failed to assign guide.');
            }
        } catch (err) {
            console.error('Error assigning guide:', err);
            alert('Error assigning guide.');
        }
    };

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="projects-list">
            <h1>Projects</h1>
            {projects.length > 0 ? (
                <table border="1">
                    <thead>
                        <tr>
                            <th>Project Title</th>
                            <th>Leader</th>
                            <th>Team Members</th>
                            <th>Assign Guide</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project) => (
                            <tr key={project.projectId}>
                                <td>{project.projectTitle}</td>
                                <td>{project.leaderName}</td>
                                <td>
                                    {project.teamMemberNames.length > 0 ? (
                                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                            {project.teamMemberNames.map((name, index) => (
                                                <li key={index}>{name}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span>No team members</span>
                                    )}
                                </td>
                                <td>
                                    {project.guideName ? (
                                        <>
                                            <span>Guide Assigned: {project.guideName}</span>
                                        </>
                                    ) : (
                                        <>
                                            <select
                                                value={selectedGuides[project.projectId] || ''}
                                                onChange={(e) =>
                                                    handleGuideChange(project.projectId, e.target.value)
                                                }
                                            >
                                                <option value="">Select Guide</option>
                                                {guides.map((guide) => (
                                                    <option key={guide.name} value={guide.name}>
                                                        {guide.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={() => assignGuide(project.projectId)}
                                                disabled={!selectedGuides[project.projectId]}
                                            >
                                                Assign
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No projects available</p>
            )}

            <p>Below students yet to form the Team</p>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>PNR</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length > 0 ? (
                        students.map((student) => (
                            <tr key={student.pnrNo}>
                                <td>{student.name}</td>
                                <td>{student.emailId}</td>
                                <td>{student.pnrNo}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">All students have formed the team</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <Link to="/allteams"> SEE ALL Teams</Link>
        </div>
    );
};

export default ProjectsList;
