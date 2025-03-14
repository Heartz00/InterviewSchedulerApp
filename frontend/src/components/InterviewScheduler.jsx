import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./InterviewScheduler.css"; // Import the CSS file

const InterviewScheduler = () => {
  const [slots, setSlots] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loadingSlots, setLoadingSlots] = useState({});
  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.get("https://attendance-app-phi.vercel.app/api/slots");
        setSlots(response.data);
      } catch (error) {
        setMessage("Failed to fetch available slots. Please try again later.");
      }
    };
    fetchSlots();
  }, []);

  const bookSlot = async (slotId) => {
    if (!name || !email) {
      setMessage("Please enter your name and email before booking.");
      return;
    }

    setLoadingSlots((prev) => ({ ...prev, [slotId]: true }));

    try {
      await axios.post("https://attendance-app-phi.vercel.app/api/book", { slotId, name, email });
      setMessage("Interview slot booked successfully!");
      setSlots(slots.filter((slot) => slot.id !== slotId));
    } catch (error) {
      setMessage("Failed to book slot. Someone may have taken it already.");
    } finally {
      setLoadingSlots((prev) => ({ ...prev, [slotId]: false }));
    }
  };

  return (
    <div className={`interview-scheduler ${darkMode ? "dark-mode" : "light-mode"}`}>
      <div className="container">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="heading">
          Welcome
        </motion.h1>
        <p className="subheading">Book a comfortable time slot for your interview</p>
        <button onClick={() => setDarkMode(!darkMode)} className="dark-mode-toggle">
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        {message && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`message ${message.includes("success") ? "success" : "error"}`}>
            {message}
          </motion.p>
        )}

        <div className="form">
          <form className="space-y-4">
            <div className="form-group">
              <label className="form-label">Name:</label>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email:</label>
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>
          </form>
        </div>

        <h2 className="slots-heading">Available Slots</h2>
        <div className="slots-container">
          {slots.length > 0 ? (
            <table className="slots-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {slots.map((slot) => (
                  <motion.tr
                    key={slot.id}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="slot-row"
                  >
                    <td>{new Date(slot.date_time).toLocaleString()}</td>
                    <td>
                      <button
                        onClick={() => bookSlot(slot.id)}
                        disabled={loadingSlots[slot.id]}
                        className="book-button"
                      >
                        {loadingSlots[slot.id] ? "Booking..." : "Book Now"}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-slots">No available slots.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewScheduler;
