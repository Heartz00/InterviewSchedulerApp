import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import InterviewScheduler from "./components/InterviewScheduler";
import AdminPanel from "./components/AdminPanel";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation Bar */}
        <nav className="bg-blue-600 text-white py-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center px-6">
            <h1 className="text-xl font-semibold">Pax Interview Scheduler</h1>
            <div>
              <Link to="/" className="px-4 py-2 hover:underline">Home</Link>
              <Link to="/admin" className="px-4 py-2 hover:underline">Admin Panel</Link>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <div className="container mx-auto p-6">
          <Routes>
            <Route path="/" element={<InterviewScheduler />} /> {/* Home page */}
            <Route path="/admin" element={<AdminPanel />} /> {/* Admin page */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
