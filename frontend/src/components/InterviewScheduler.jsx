import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

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
    <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? "bg-black text-white" : "bg-gray-50 text-gray-900"} transition-colors duration-500`}>
      <div className="p-8 w-full max-w-xl text-center">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="text-4xl font-semibold tracking-wide mb-6">Welcome</motion.h1>
        <p>Book a comfortable time slot for your interview</p>
        <button onClick={() => setDarkMode(!darkMode)} className="mb-6 p-2 rounded-full bg-gray-800 text-white hover:bg-gray-600 transition-all">
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        {message && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className={`mt-4 p-4 rounded-lg ${message.includes("success") ? "bg-green-600" : "bg-red-600"}`}>{message}</motion.p>
        )}

        <div className="mt-6 space-y-4">
          <form>
            <tr> Name: 
          <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500" />
            </tr>
            <tr> Email: 
          <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500" />
              </tr>
            </form>
        </div>

        <h2 className="text-2xl font-semibold mt-8">Available Slots</h2>
        <div className="mt-4 space-y-4">
          {slots.length > 0 ? slots.map((slot) => (
            <motion.div key={slot.id} whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}
              className="p-5 bg-gray-800 rounded-lg flex flex-col md:flex-row justify-between items-center shadow-xl space-y-3 md:space-y-0">
              <span className="text-lg font-medium">{new Date(slot.date_time).toLocaleString()}</span>
              <button onClick={() => bookSlot(slot.id)} disabled={loadingSlots[slot.id]}
                className="px-4 py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-all">
                {loadingSlots[slot.id] ? "Booking..." : "Book Now"}
              </button>
            </motion.div>
          )) : <p className="text-gray-400">No available slots.</p>}
        </div>
      </div>
    </div>
  );
};

export default InterviewScheduler;
