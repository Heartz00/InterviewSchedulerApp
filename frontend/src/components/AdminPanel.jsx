import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPanel.css"; // Import the CSS file

const AdminPanel = () => {
  const [days, setDays] = useState([""]); // Start with one day
  const [times, setTimes] = useState([""]); // Start with one time
  const [createMessage, setCreateMessage] = useState("");
  const [isCreatingSlots, setIsCreatingSlots] = useState(false);
  const [isClearingSlots, setIsClearingSlots] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isFetchingBookedSlots, setIsFetchingBookedSlots] = useState(false);

  // Fetch booked slots on component mount
  useEffect(() => {
    const fetchBookedSlots = async () => {
      setIsFetchingBookedSlots(true);
      try {
        const response = await axios.get("https://attendance-app-phi.vercel.app/api/booked-slots");
        // Sort slots by date (closest first)
        const sortedSlots = response.data.sort(
          (a, b) => new Date(a.date_time) - new Date(b.date_time)
        );
        setBookedSlots(sortedSlots);
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

  // Delete a specific slot
  const deleteSlot = async (slotId) => {
    if (!window.confirm("Are you sure you want to delete this slot?")) {
      return;
    }

    try {
      await axios.delete(`https://attendance-app-phi.vercel.app/api/delete-slot/${slotId}`);
      setCreateMessage("Slot deleted successfully!");
      setBookedSlots(bookedSlots.filter((slot) => slot.id !== slotId)); // Remove the deleted slot from the list
    } catch (error) {
      setCreateMessage("Failed to delete slot. Please try again.");
    }
  };

  // Mark an interview as done
  const markAsDone = async (slotId) => {
    if (!window.confirm("Are you sure you want to mark this interview as done?")) {
      return;
    }

    try {
      await axios.post(`https://attendance-app-phi.vercel.app/api/mark-as-done/${slotId}`);
      setCreateMessage("Interview marked as done successfully!");
      // Update the booked slots list to reflect the change
      setBookedSlots(bookedSlots.filter((slot) => slot.id !== slotId));
    } catch (error) {
      setCreateMessage("Failed to mark interview as done. Please try again.");
    }
  };

  return (
    <div className="admin-panel">
      {/* Create Slots Section */}
      <div className="create-slots-section">
        <h2 className="create-slots-heading">Create Interview Slots</h2>
        {createMessage && (
          <p className={`create-slots-message ${createMessage.includes("success") ? "success" : "error"}`}>
            {createMessage}
          </p>
        )}

        <div className="days-times-section">
          <h4 className="days-times-heading" style={{ fontStyle: "italic" }}>
            Note that the times you create will be applicable for each day you create.
          </h4>
          <h3 className="days-times-heading">Select Days</h3>
          {days.map((day, index) => (
            <div key={index} className="input-group">
              <input
                type="date"
                value={day}
                onChange={(e) => handleDayChange(index, e.target.value)}
                className="input-field"
              />
              <button onClick={() => removeDay(index)} className="remove-button">
                Remove
              </button>
            </div>
          ))}
          <button onClick={addDay} className="add-button">
            Add Day
          </button>
        </div>

        <div className="days-times-section">
          <h3 className="days-times-heading">Specify Times</h3>
          {times.map((time, index) => (
            <div key={index} className="input-group">
              <input
                type="time"
                value={time}
                onChange={(e) => handleTimeChange(index, e.target.value)}
                className="input-field"
              />
              <button onClick={() => removeTime(index)} className="remove-button">
                Remove
              </button>
            </div>
          ))}
          <button onClick={addTime} className="add-button">
            Add Time
          </button>
        </div>

        <div className="action-buttons">
          <button
            onClick={createSlots}
            disabled={isCreatingSlots}
            className="create-button"
          >
            {isCreatingSlots ? "Creating..." : "Create Slots"}
          </button>
          <button
            onClick={clearSlots}
            disabled={isClearingSlots}
            className="clear-button"
          >
            {isClearingSlots ? "Clearing..." : "Clear All Slots"}
          </button>
        </div>
      </div>

      {/* View Booked Slots Section */}
      <div className="booked-slots-section">
        <h2 className="booked-slots-heading">Booked Slots</h2>
        {isFetchingBookedSlots ? (
          <p className="loading-text">Loading booked slots...</p>
        ) : bookedSlots.length > 0 ? (
          <table className="booked-slots-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookedSlots.map((slot) => (
                <tr key={slot.id} className="booked-slot-row">
                  <td>{new Date(slot.date_time).toLocaleString()}</td>
                  <td>{slot.applicant_name}</td>
                  <td>{slot.applicant_email}</td>
                  <td>
                    <button
                      onClick={() => deleteSlot(slot.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => markAsDone(slot.id)}
                      className="mark-done-button"
                    >
                      Mark as Done
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="loading-text">No slots have been booked yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
