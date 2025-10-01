import test from "node:test";
import assert from "node:assert";
import fetch from "node-fetch";

const API = "http://localhost:3000";

test("healthcheck works", async () => {
  const res = await fetch(`${API}/health`);
  const body = await res.json();
  assert.strictEqual(body.status, "ok");
});

// TODO: Candidate must add tests for reservation flow
test("create a reservation successfully", async () => {
  const res = await fetch(`${API}/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      room_id: 1,
      check_in: "2024-07-01",
      check_out: "2024-07-05",
    }),
  });
  assert.strictEqual(res.status, 201);
  const body = await res.json();
  assert.strictEqual(body.message, "Reservation created successfully");
});

test("fail to create a reservation with missing fields", async () => {
  const res = await fetch(`${API}/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      room_id: 2,
      check_in: "2024-07-01",
    }),
  });
  assert.strictEqual(res.status, 400);
  const body = await res.json();
  assert.strictEqual(body.error, "Missing required fields");
});

test("fail to create a reservation for an already booked room", async () => {
  // First, create a reservation
  await fetch(`${API}/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      room_id: 3,
      check_in: "2024-07-10",
      check_out: "2024-07-15",
    }),
  });
  // Then, try to create another reservation that overlaps
  const res = await fetch(`${API}/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      room_id: 3,
      check_in: "2024-07-12",
      check_out: "2024-07-18",
    }),
  });
  assert.strictEqual(res.status, 409);
  const body = await res.json();
  assert.strictEqual(
    body.error,
    "Room is already booked for the selected dates",
  );
});
