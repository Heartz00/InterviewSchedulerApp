const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

const app = express();

// Hardcoded SendGrid API key (not recommended for production)

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(express.json());
// Enable CORS for all routes
app.use(cors({
  origin: "https://interview-scheduler-frontend.vercel.app", // Allow requests from this origin
  methods: ["GET", "POST", "OPTIONS"], // Allow these HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
}));

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use environment variable for the connection string
  ssl: {
    rejectUnauthorized: false, // Required for Supabase and other cloud providers
  },
});

// API to get available slots
app.get("/api/slots", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM slots WHERE booked = FALSE");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API to get booked slots
app.get("/api/booked-slots", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM slots WHERE booked = TRUE");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API to create multiple slots for specific days and times
app.post("/api/create-slots", async (req, res) => {
  const { days, times } = req.body;

  if (!days || !times || !Array.isArray(days) || !Array.isArray(times)) {
    return res.status(400).json({ error: "Invalid input: days and times must be arrays" });
  }

  const slots = [];
  days.forEach((day) => {
    times.forEach((time) => {
      const dateTime = `${day}T${time}`; // Combine date and time
      slots.push([dateTime]);
    });
  });

  try {
    await pool.query("BEGIN");
    for (const slot of slots) {
      await pool.query("INSERT INTO slots (date_time) VALUES ($1)", [slot[0]]);
    }
    await pool.query("COMMIT");
    res.json({ success: true, message: "Slots created successfully" });
  } catch (err) {
    await pool.query("ROLLBACK");
    res.status(500).json({ error: "Failed to create slots" });
  }
});

// API to clear all slots from the database
app.post("/api/clear-slots", async (req, res) => {
  try {
    await pool.query("DELETE FROM slots");
    res.json({ success: true, message: "All slots cleared successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear slots" });
  }
});

// API to book a slot
app.post("/api/book", async (req, res) => {
  const { slotId, name, email } = req.body;

  try {
    // Check if the slot is already booked
    const { rows } = await pool.query("SELECT * FROM slots WHERE id = $1", [slotId]);
    const slot = rows[0];

    if (!slot) {
      return res.status(404).json({ error: "Slot not found" });
    }
    if (slot.booked) {
      return res.status(400).json({ error: "Slot is already booked" });
    }

    // Book the slot
    await pool.query(
      "UPDATE slots SET booked = TRUE, applicant_name = $1, applicant_email = $2 WHERE id = $3",
      [name, email, slotId]
    );

    // Send confirmation email with Zoom link
    const zoomLink = "https://us06web.zoom.us/j/7648724685?pwd=WkxmRGJrTkVBTEY3WE5lOGt1ZVBqQT09"; // Add your Zoom link here
    const msg = {
      to: email,
      from: "info@mailab.io", // Replace with your verified sender email
      subject: "Interview Slot Confirmation",
      text: `Hi ${name}, your interview is scheduled on ${new Date(
        slot.date_time
      ).toLocaleString()}. Join the meeting using this Zoom link: ${zoomLink}`,
      html: `<p>Hi ${name},</p>
             <p>Your interview is scheduled on <strong>${new Date(
               slot.date_time
             ).toLocaleString()}</strong>.</p>
             <p>Join the meeting using this Zoom link: <a href="${zoomLink}">${zoomLink}</a></p>
             <p>Meeting ID: 764 872 4685</p>
             <p>Passcode: 286339</p>
             <p>Charity Umoren,</p>
             <p>Manager,</p>
             <p>Medical Artificial Intelligence Laboratory,</p>`,
    };

    await sgMail.send(msg);
    console.log("Email sent successfully");
    res.json({ success: true, message: "Slot booked successfully" });
  } catch (err) {
    console.error("Failed to book slot or send email", err);
    res.status(500).json({ error: "Failed to book slot or send email" });
  }
});

// Export the Express app as a serverless function
module.exports = app;
