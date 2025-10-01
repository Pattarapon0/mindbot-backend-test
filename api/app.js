import express from "express";
import bodyParser from "body-parser";
import { pool } from "./db.js";

const app = express();
app.use(bodyParser.json());

// Healthcheck
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// TODO: implement POST /reservations
app.post("/reservations", async (req, res) => {
  var { room_id, check_in, check_out } = req.body;
  // Validate input
  if (!room_id || !check_in || !check_out) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      `SELECT 1 FROM reservations
      WHERE room_id = $1
      AND check_in < $3
      AND check_out > $2
      LIMIT 1`,
      [room_id, check_in, check_out],
    );
    if (result.rows.length > 0) {
      await client.query("ROLLBACK");
      client.release();
      return res
        .status(409)
        .json({ error: "Room is already booked for the selected dates" });
    }
    await client.query(
      `INSERT INTO reservations (room_id, check_in, check_out)
      VALUES ($1, $2, $3)`,
      [room_id, check_in, check_out],
    );
    await client.query("COMMIT");
    client.release();
    res.status(201).json({ message: "Reservation created successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    client.release();
    if (error.code === "23503") {
      return res.status(400).json({ error: "Invalid room_id" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});
app.listen(3000, () => console.log("API running on http://localhost:3000"));
