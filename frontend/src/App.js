import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import InterviewScheduler from "./components/InterviewScheduler";
import AdminPanel from "./components/AdminPanel";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <nav className="navbar">
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link> {/* Link to the Home/Interview Scheduler page */}
            </li>
            <li>
              <Link to="/admin">Admin</Link> {/* Link to the Admin page */}
            </li>
          </ul>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<InterviewScheduler />} /> {/* Home page */}
          <Route path="/admin" element={<AdminPanel />} /> {/* Admin page */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
