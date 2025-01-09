import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Register from './pages/Register';
import Login from './pages/Login';
import StudentDashboard from "./pages/Miniproject";
import ProjectsList from "./pages/Displaylist";
import Middlepage from "./pages/middlepage";
import AllTeams from "./pages/AllTeams";
function App() {
  return (
      <div>
        <Router>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path='/login'element={<Login/>}/>
          <Route path="/miniproject"element={<StudentDashboard/>}/>
          <Route path="/list"element={<ProjectsList/>}/>
          <Route path="/middlepage"element={<Middlepage/>}/>
          <Route path="/allteams" element={<AllTeams/>}/>
        </Routes>
        </Router>
      </div>
    
  );
}

export default App;
