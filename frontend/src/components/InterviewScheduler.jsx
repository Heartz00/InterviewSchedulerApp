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
      <div className="p-8 w-full max-w-2xl text-center">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="text-4xl font-semibold tracking-wide mb-6">Welcome</motion.h1>
        <p className="text-lg mb-6">Book a comfortable time slot for your interview</p>
        <button onClick={() => setDarkMode(!darkMode)} className="mb-6 p-2 rounded-full bg-gray-800 text-white hover:bg-gray-600 transition-all">
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        {message && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className={`mt-4 p-4 rounded-lg ${message.includes("success") ? "bg-green-600" : "bg-red-600"} text-white`}>{message}</motion.p>
        )}

        <div className="mt-6 w-full max-w-md mx-auto">
          <form className="space-y-4">
            <div className="flex flex-col space-y-2">
              <label className="text-left font-medium">Name:</label>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-200 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-left font-medium">Email:</label>
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-200 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>
        </div>

        <h2 className="text-2xl font-semibold mt-12 mb-6">Available Slots</h2>
        <div className="mt-4 space-y-4 w-full max-w-2xl">
          {slots.length > 0 ? slots.map((slot) => (
            <motion.div
              key={slot.id}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className="p-6 bg-white rounded-lg flex flex-col md:flex-row justify-between items-center shadow-lg hover:shadow-xl transition-shadow"
            >
              <span className="text-lg font-medium text-gray-800">{new Date(slot.date_time).toLocaleString()}</span>
              <button
                onClick={() => bookSlot(slot.id)}
                disabled={loadingSlots[slot.id]}
                className="px-6 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all"
              >
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
