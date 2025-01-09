const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());
app.use(cors());


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "clgerp",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to the database.");
  }
});

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  jwt.verify(token, "your_secret_key", (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token." });
    req.user = user;
    next();
  });
};

// User registration
app.post("/api/user/register", async (req, res) => {
  const { pnrNo, name, email, department, year, setPassword } = req.body;

  if (!pnrNo || !name || !email || !department || !year || !setPassword) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(setPassword, 10);
    const query = "INSERT INTO students (pnrNo, name, emailId, department, year, password) VALUES (?, ?, ?, ?, ?, ?)";
    await db.promise().query(query, [pnrNo, name, email, department, year, hashedPassword]);

    res.json({ success: true, message: "User registered successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Registration failed. Email might already be registered." });
  }
});

// User login
app.post("/api/user/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  try {
    const query = "SELECT * FROM students WHERE emailId = ?";
    const [results] = await db.promise().query(query, [email]);

    if (results.length === 0) {
      return res.status(400).json({ success: false, message: "User not found." });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user.id, email: user.emailId }, "your_secret_key", { expiresIn: "1h" });
    res.json({ success: true, message: "User logged in successfully.", token, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Login failed." });
  }
});

app.post("/api/students/same-department-year", authenticateToken, async (req, res) => {
  const { department, year } = req.body;

  try {
    const query = `
      SELECT name, emailId, pnrNo
      FROM students
      WHERE department = ? 
        AND year = ? 
        AND isAvailable = TRUE;
    `;


    const [students] = await db.promise().query(query, [department, year]);

    res.json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch classmates." });
  }
});

app.post('/minipro3', async (req, res) => {
  const { leaderId, title, description, tech_stack, teamMembers } = req.body;


  if (!leaderId || !title || !description || !tech_stack || teamMembers.length < 2) {
    return res.status(400).json({ success: false, message: "Invalid input, ensure team has at least 2 members and all fields are filled." });
  }


  try {
    await db.promise().query('START TRANSACTION');
    const projectQuery = `
      INSERT INTO projects (leader_id, title, description, tech_stack)
      VALUES (?, ?, ?, ?)
    `;
    const [projectResult] = await db.promise().query(projectQuery, [leaderId, title, description, tech_stack]);

    const projectId = projectResult.insertId;


    const teamMemberQuery = `
      INSERT INTO team_members (project_id, member_id)
      VALUES (?, ?)
    `;

    for (const memberId of teamMembers) {
      await db.promise().query(teamMemberQuery, [projectId, memberId]);
    }


    const updateAvailabilityQuery = `
      UPDATE students 
      SET isAvailable = false 
      WHERE pnrNo IN (?)
    `;
    await db.promise().query(updateAvailabilityQuery, [teamMembers]);





    await db.promise().query('COMMIT');

    res.json({ success: true, message: "Project and team saved successfully!" });
  } catch (error) {
    await db.promise().query('ROLLBACK');
    console.error('Error saving project and team:', error.message);
    res.status(500).json({ success: false, message: "Failed to save project and team. Please try again." });
  }
});

app.get('/projects', async (req, res) => {
  try {
    const query = `
      SELECT 
    p.id AS projectId,
    p.title AS projectTitle,
    s.name AS leaderName,
    GROUP_CONCAT(tmMembers.name) AS teamMemberNames,
    p.guideName AS guideName
FROM 
    projects p
JOIN 
    students s ON p.leader_id = s.pnrNo
LEFT JOIN 
    team_members tm ON p.id = tm.project_id
LEFT JOIN 
    students tmMembers ON tm.member_id = tmMembers.pnrNo
GROUP BY 
    p.id, p.title, s.name, p.guideName;

    `;

    const [results] = await db.promise().query(query);

    const projects = results.map(project => ({
      projectId: project.projectId,
      projectTitle: project.projectTitle,
      leaderName: project.leaderName,
      teamMemberNames: project.teamMemberNames ? project.teamMemberNames.split(',') : [],
      guideName: project.guideName
    }));

    res.json({ success: true, projects });
  } catch (error) {
    console.error('Error fetching projects:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch project data.' });
  }
});


app.get("/nogroup", async (req, res) => {
  try {
    const query = `
      SELECT name, emailId, pnrNo
      FROM students
      WHERE isAvailable = TRUE;
    `;


    const [students] = await db.promise().query(query);

    res.json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch classmates." });
  }
})

app.get('/guides', (req, res) => {
  const query = `
      SELECT name
      FROM guides;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching guides:', err);
      return res.json({ success: false, message: 'Error fetching guides' });
    }
    res.json({ success: true, guides: results });
  });
});


app.post('/assign-guide', (req, res) => {
  const { projectId, guideName } = req.body;

  if (!projectId || !guideName) {
    return res.json({ success: false, message: 'Project ID and guide name are required' });
  }

  const query = `
      UPDATE projects
      SET guideName = ?
      WHERE id = ?;
  `;

  db.query(query, [guideName, projectId], (err, results) => {
    if (err) {
      console.error('Error assigning guide:', err);
      return res.json({ success: false, message: 'Error assigning guide' });
    }

    if (results.affectedRows === 0) {
      return res.json({ success: false, message: 'No project found with the given ID' });
    }

    res.json({ success: true, message: 'Guide assigned successfully' });
  });
});

app.post("/fetchprojectdetails", async (req, res) => {
  const { pnrNo } = req.body;

  try {
    const query = `
      SELECT * 
      FROM projects 
      WHERE id IN (
        SELECT project_id 
        FROM team_members
        WHERE member_id = ?
      );
    `;

    const [results] = await db.promise().query(query, [pnrNo]); // Using db.promise().query for consistent syntax

    if (results.length === 0) {
      return res.json({ success: false, message: "No project found with the given PNR" });
    }

    res.json({ success: true, message: "Projects fetched successfully", projects: results });
  } catch (error) {
    console.error("Error fetching project details:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/exitteam", async (req, res) => {
  const { pnrNo } = req.body;

  if (!pnrNo) {
    return res.status(400).json({ success: false, message: "pnrNo is required." });
  }

  try {
    // Start a database transaction
    await db.promise().query('START TRANSACTION');

    // Delete from team_members table
    const exitQuery = `
      DELETE FROM team_members
      WHERE member_id = ?;
    `;
    const [deleteResults] = await db.promise().query(exitQuery, [pnrNo]);

    if (deleteResults.affectedRows === 0) {
      await db.promise().query('ROLLBACK');
      return res.status(404).json({ success: false, message: "PNR not found in team_members table." });
    }

    // Update the student's availability
    const updateStudent = `
      UPDATE students
      SET isAvailable = 1
      WHERE pnrNo = ?;
    `;
    const [updateResults] = await db.promise().query(updateStudent, [pnrNo]);

    console.log(updateResults)

    if (updateResults.affectedRows === 0) {
      await db.promise().query('ROLLBACK');
      return res.status(404).json({ success: false, message: "Student not found or already available." });
    }

    // Commit the transaction if both operations succeed
    await db.promise().query('COMMIT');

    res.json({ success: true, message: "Successfully exited the team and updated availability." });
  } catch (error) {
    // Rollback the transaction on error
    await db.promise().query('ROLLBACK');
    console.error("Error exiting the team:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});




app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
