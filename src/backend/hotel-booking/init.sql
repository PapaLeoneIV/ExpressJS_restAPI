DROP TABLE IF EXISTS room CASCADE;
DROP TABLE IF EXISTS date CASCADE;

CREATE TABLE date (
    id SERIAL PRIMARY KEY,
    booking_date DATE UNIQUE NOT NULL
);

CREATE TABLE room (
    id SERIAL PRIMARY KEY,
    room_number VARCHAR(10) NOT NULL,
    is_available BOOLEAN NOT NULL,
    date_id INT REFERENCES date(id) ON DELETE CASCADE
);

INSERT INTO date (booking_date)
SELECT CURRENT_DATE + i
FROM generate_series(0, (24 * 30) - 1) AS t(i);

INSERT INTO room (room_number, is_available, date_id)
SELECT 
    ('10' || r)::VARCHAR,              
    (random() > 0.5)::BOOLEAN,           
    d.id                                
FROM date d
CROSS JOIN generate_series(1, 5) AS r;   
