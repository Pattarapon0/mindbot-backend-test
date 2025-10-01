ออกแบบ schema อย่างไร
- CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

- CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    room_id INT NOT NULL REFERENCES rooms(id),
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    created_at TIMESTAMP DEFAULT now()
    CONSTRAINT check_in_before_out CHECK (check_out > check_in)
);
- นี้ก็เป็น schema เบื้องต้นมีการเพิ่่มจากต้นแบบโดยมีการเพิ่ม constraint เพื่อให้แน่ใจว่า check_out จะต้องมากกว่า check_in และ room_id จะต้อง exit ก่อนถึงจะทำการจองได้
ป้องกัน double booking แบบไหน
- ใช้ transaction isolation level เป็น SERIALIZABLE เพื่อ block ไม่ให้ process อื่นเข้ามาเกี่ยวข้องกับข้อมูลที่ process นี้กำลังทำงานอยู่
trade-off ที่เลือก
- การใช้ SERIALIZABLE เป็นการ block concurrency process ทั้งหมดที่เกี่ยวข้องกับ transaction นี้ทั้งหมด มีความมันใจว่าจะไม่มี double booking เกิดขึ้นแน่นอน แต่ก็แลกมาด้วย performance ที่ลดลงจากการ blocking
