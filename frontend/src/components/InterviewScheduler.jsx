import React, { useState, useEffect } from "react";
import { Button, Card, Input } from "./ui/Button";
import axios from "axios";

const InterviewScheduler = () => {
  const [slots, setSlots] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loadingSlots, setLoadingSlots] = useState({});
  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Fetch available slots on component mount
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.get("https://attendance-app-phi.vercel.app/api/slots");
        setSlots(response.data);
      } catch (error) {
        console.error("Failed to fetch slots:", error);
        setMessage("Failed to fetch available slots. Please try again later.");
      }
    };

    fetchSlots();
  }, []);

  // Handle slot booking
  const bookSlot = async (slotId) => {
    if (!name || !email) {
      setMessage("Please enter your name and email before booking.");
      return;
    }

    // Set loading state for this specific slot
    setLoadingSlots((prev) => ({ ...prev, [slotId]: true }));

    try {
      const response = await axios.post("https://attendance-app-phi.vercel.app/api/book", {
        slotId,
        name,
        email,
      });
      setMessage("Interview slot booked successfully!");
      setSlots(slots.filter((slot) => slot.id !== slotId)); // Remove the booked slot
    } catch (error) {
      setMessage("Failed to book slot. Someone may have taken it already.");
    } finally {
      // Reset loading state for this specific slot
      setLoadingSlots((prev) => ({ ...prev, [slotId]: false }));
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Interview Scheduler</h1>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
          >
            {darkMode ? "🌙" : "☀️"}
          </button>
        </div>

        {/* Message */}
        {message && (
          <p
            className={`mb-4 p-4 rounded-lg ${
              message.includes("successfully")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </p>
        )}

        {/* Form */}
        <div className="mb-8">
          <Input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`mb-4 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}
          />
          <Input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}
          />
        </div>

        {/* Slots */}
        <h2 className="text-2xl font-bold mb-4">Available Slots</h2>
        {slots.length > 0 ? (
          slots.map((slot) => (
            <Card
              key={slot.id}
              className={`mb-4 p-6 flex justify-between items-center transition-transform transform hover:scale-105 ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <span className="text-lg">{new Date(slot.date_time).toLocaleString()}</span>
              <Button
                onClick={() => bookSlot(slot.id)}
                disabled={loadingSlots[slot.id]}
                className={`${
                  loadingSlots[slot.id]
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white font-semibold py-2 px-4 rounded-lg transition-colors`}
              >
                {loadingSlots[slot.id] ? "Booking..." : "Book"}
              </Button>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No available slots.</p>
        )}
      </div>
    </div>
  );
};

export default InterviewScheduler;
