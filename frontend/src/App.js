import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import InterviewScheduler from "./components/InterviewScheduler";
import AdminPanel from "./components/AdminPanel";
import "./App.css"; // Import the CSS file

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <nav className="navbar">
          <h1 className="nav-links">
            Pax Interview Scheduler
          </h1>
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
