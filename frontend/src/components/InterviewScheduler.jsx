import React, { useState, useEffect } from "react";
import { Button, Card, Input } from "./ui/Button";
import axios from "axios";

const InterviewScheduler = () => {
  const [slots, setSlots] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loadingSlots, setLoadingSlots] = useState({}); 
  const [message, setMessage] = useState("");

  // Fetch available slots on component mount
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.get("http://50.17.224.101:5020/slots");
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
    const response = await axios.post("http://50.17.224.101:5020/book", {
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
  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Select an Interview Slot</h2>
      {message && (
        <p
          className={`mb-4 ${
            message.includes("successfully") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-2"
        />
        <Input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {slots.length > 0 ? (
        slots.map((slot) => (
          <Card key={slot.id} className="mb-2 p-4 flex justify-between">
            <span>{new Date(slot.date_time).toLocaleString()}</span>
            <Button
  onClick={() => bookSlot(slot.id)}
  disabled={loadingSlots[slot.id]} // Disable only this button
>
  {loadingSlots[slot.id] ? "Booking..." : "Book"}
</Button>
          </Card>
        ))
      ) : (
        <p>No available slots.</p>
      )}
    </div>
  );
};

export default InterviewScheduler;
