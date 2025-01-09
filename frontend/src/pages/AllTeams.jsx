import React, { useEffect ,useState} from 'react'
import axios from 'axios';
import * as XLSX from 'xlsx';

const AllTeams = () => {

        const [projects, setProjects] = useState([]);
        const [error, setError] = useState(null);

    useEffect(() => {
        fetchProjects()
    }, []);


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


    const exportToExcel = () => {
        const dataToExport = projects.map((project) => ({
            'Project Title': project.projectTitle,
            Leader: project.leaderName,
            'Team Members': project.teamMemberNames.join(', '),
            'Assigned Guide': project.guideName || 'Not Assigned',
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Projects');

        XLSX.writeFile(workbook, 'ProjectsList.xlsx');
    };
    return (
        <div>
            <button onClick={exportToExcel}>Import as excel</button>
            {projects.length > 0 ? (
                <table border="1">
                    <thead>
                        <tr>
                            <th>Project Title</th>
                            <th>Leader</th>
                            <th>Team Members</th>
                            <th> Guides </th>
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
                                            <span> {project.guideName}</span>
                                        </>
                                    ) : (
                                        <p>{project.guideName}</p>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No projects available</p>
            )}

        </div>
    )
}

export default AllTeams
