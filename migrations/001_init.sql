CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    room_id INT NOT NULL REFERENCES rooms(id),
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    created_at TIMESTAMP DEFAULT now()
    CONSTRAINT check_in_before_out CHECK (check_out > check_in)
);

CREATE INDEX idx_reservations_room_id ON reservations(room_id, check_in, check_out);

INSERT INTO rooms (name) VALUES ('Room 101'), ('Room 102'), ('Room 103');
