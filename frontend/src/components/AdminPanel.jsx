import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPanel = () => {
  // State for creating slots
  const [days, setDays] = useState([""]); // Start with one day
  const [times, setTimes] = useState([""]); // Start with one time
  const [createMessage, setCreateMessage] = useState("");

  // State for viewing booked slots
  const [bookedSlots, setBookedSlots] = useState([]);

  // Fetch booked slots on component mount
  useEffect(() => {
    axios
      .get("https://attendance-app-phi.vercel.app/api/booked-slots")
      .then((response) => {
        setBookedSlots(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch booked slots:", error);
      });
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
  const createSlots = () => {
    if (days.some((day) => !day) || times.some((time) => !time)) {
      setCreateMessage("Please fill in all days and times.");
      return;
    }

    axios
      .post("https://attendance-app-phi.vercel.app/api/create-slots", { days, times })
      .then((response) => {
        setCreateMessage("Slots created successfully!");
        setDays([""]); // Reset to one day
        setTimes([""]); // Reset to one time
      })
      .catch((error) => {
        setCreateMessage("Failed to create slots.");
      });
  };

  // Clear all slots
  const clearSlots = () => {
    if (window.confirm("Are you sure you want to clear all slots? This action cannot be undone.")) {
      axios
        .post("https://attendance-app-phi.vercel.app/api/clear-slots")
        .then((response) => {
          setCreateMessage("All slots cleared successfully!");
          setBookedSlots([]); // Clear the booked slots list
        })
        .catch((error) => {
          setCreateMessage("Failed to clear slots.");
        });
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      {/* Create Slots Section */}
      <h2 className="text-xl font-bold mb-4">Create Interview Slots</h2>
      {createMessage && <p className="text-green-600 mb-4">{createMessage}</p>}

      <div className="mb-4">
        <h3 className="font-bold mb-2">Select Days</h3>
        {days.map((day, index) => (
          <div key={index} className="mb-2 flex items-center">
            <input
              type="date"
              value={day}
              onChange={(e) => handleDayChange(index, e.target.value)}
              className="border p-2 w-full"
            />
            <button
              onClick={() => removeDay(index)}
              className="ml-2 bg-red-500 text-white px-3 py-1 rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addDay}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Day
        </button>
      </div>

      <div className="mb-4">
        <h3 className="font-bold mb-2">Specify Times</h3>
        {times.map((time, index) => (
          <div key={index} className="mb-2 flex items-center">
            <input
              type="time"
              value={time}
              onChange={(e) => handleTimeChange(index, e.target.value)}
              className="border p-2 w-full"
            />
            <button
              onClick={() => removeTime(index)}
              className="ml-2 bg-red-500 text-white px-3 py-1 rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addTime}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Time
        </button>
      </div>

      <button
        onClick={createSlots}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Create Slots
      </button>

      {/* Clear All Slots Button */}
      <button
        onClick={clearSlots}
        className="bg-red-500 text-white px-4 py-2 rounded mt-4"
      >
        Clear All Slots
      </button>

      {/* View Booked Slots Section */}
      <h2 className="text-xl font-bold mt-8 mb-4">Booked Slots</h2>
      {bookedSlots.length > 0 ? (
        bookedSlots.map((slot) => (
          <div key={slot.id} className="mb-2 p-4 border">
            <p>Date: {new Date(slot.date_time).toLocaleString()}</p>
            <p>Name: {slot.applicant_name}</p>
            <p>Email: {slot.applicant_email}</p>
          </div>
        ))
      ) : (
        <p>No slots have been booked yet.</p>
      )}
    </div>
  );
};

export default AdminPanel;
