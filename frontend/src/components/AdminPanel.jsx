import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPanel = () => {
  // State for creating slots
  const [days, setDays] = useState([""]); // Start with one day
  const [times, setTimes] = useState([""]); // Start with one time
  const [createMessage, setCreateMessage] = useState("");
  const [isCreatingSlots, setIsCreatingSlots] = useState(false);
  const [isClearingSlots, setIsClearingSlots] = useState(false);

  // State for viewing booked slots
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isFetchingBookedSlots, setIsFetchingBookedSlots] = useState(false);

  // Fetch booked slots on component mount
  useEffect(() => {
    const fetchBookedSlots = async () => {
      setIsFetchingBookedSlots(true);
      try {
        const response = await axios.get("https://attendance-app-phi.vercel.app/api/booked-slots");
        setBookedSlots(response.data);
      } catch (error) {
        console.error("Failed to fetch booked slots:", error);
        setCreateMessage("Failed to fetch booked slots. Please try again later.");
      } finally {
        setIsFetchingBookedSlots(false);
      }
    };
    fetchBookedSlots();
  }, []);

  // Handle day input change
  const handleDayChange = (index, value) => {
    const newDays = [...days];
    newDays[index] = value;
    setDays(newDays);
  };

  // Handle time input change
  const handleTimeChange = (index, value) => {
    const newTimes = [...times];
    newTimes[index] = value;
    setTimes(newTimes);
  };

  // Add a new day
  const addDay = () => {
    setDays([...days, ""]);
  };

  // Remove a day
  const removeDay = (index) => {
    const newDays = days.filter((_, i) => i !== index);
    setDays(newDays);
  };

  // Add a new time
  const addTime = () => {
    setTimes([...times, ""]);
  };

  // Remove a time
  const removeTime = (index) => {
    const newTimes = times.filter((_, i) => i !== index);
    setTimes(newTimes);
  };

  // Create slots
  const createSlots = async () => {
    if (days.some((day) => !day) || times.some((time) => !time)) {
      setCreateMessage("Please fill in all days and times.");
      return;
    }

    setIsCreatingSlots(true);
    try {
      await axios.post("https://attendance-app-phi.vercel.app/api/create-slots", { days, times });
      setCreateMessage("Slots created successfully!");
      setDays([""]); // Reset to one day
      setTimes([""]); // Reset to one time
    } catch (error) {
      setCreateMessage("Failed to create slots. Please try again.");
    } finally {
      setIsCreatingSlots(false);
    }
  };

  // Clear all slots
  const clearSlots = async () => {
    if (!window.confirm("Are you sure you want to clear all slots? This action cannot be undone.")) {
      return;
    }

    setIsClearingSlots(true);
    try {
      await axios.post("https://attendance-app-phi.vercel.app/api/clear-slots");
      setCreateMessage("All slots cleared successfully!");
      setBookedSlots([]); // Clear the booked slots list
    } catch (error) {
      setCreateMessage("Failed to clear slots. Please try again.");
    } finally {
      setIsClearingSlots(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      {/* Create Slots Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Interview Slots</h2>
        {createMessage && (
          <p
            className={`mb-4 p-3 rounded-lg ${
              createMessage.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {createMessage}
          </p>
        )}

        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-4 text-gray-700">Select Days</h3>
          {days.map((day, index) => (
            <div key={index} className="mb-3 flex items-center">
              <input
                type="date"
                value={day}
                onChange={(e) => handleDayChange(index, e.target.value)}
                className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => removeDay(index)}
                className="ml-3 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-all"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={addDay}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
          >
            Add Day
          </button>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-4 text-gray-700">Specify Times</h3>
          {times.map((time, index) => (
            <div key={index} className="mb-3 flex items-center">
              <input
                type="time"
                value={time}
                onChange={(e) => handleTimeChange(index, e.target.value)}
                className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => removeTime(index)}
                className="ml-3 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-all"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={addTime}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
          >
            Add Time
          </button>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={createSlots}
            disabled={isCreatingSlots}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all disabled:bg-blue-300"
          >
            {isCreatingSlots ? "Creating..." : "Create Slots"}
          </button>
          <button
            onClick={clearSlots}
            disabled={isClearingSlots}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all disabled:bg-red-300"
          >
            {isClearingSlots ? "Clearing..." : "Clear All Slots"}
          </button>
        </div>
      </div>

      {/* View Booked Slots Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Booked Slots</h2>
        {isFetchingBookedSlots ? (
          <p className="text-gray-600">Loading booked slots...</p>
        ) : bookedSlots.length > 0 ? (
          bookedSlots.map((slot) => (
            <div key={slot.id} className="mb-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
              <p className="text-gray-700"><span className="font-semibold">Date:</span> {new Date(slot.date_time).toLocaleString()}</p>
              <p className="text-gray-700"><span className="font-semibold">Name:</span> {slot.applicant_name}</p>
              <p className="text-gray-700"><span className="font-semibold">Email:</span> {slot.applicant_email}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No slots have been booked yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
