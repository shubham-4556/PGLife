CREATE DATABASE IF NOT EXISTS pglife;
USE pglife;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    college_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS cities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    gender VARCHAR(10) NOT NULL,
    rent INT NOT NULL,
    rating_clean DECIMAL(2,1) DEFAULT 0,
    rating_food DECIMAL(2,1) DEFAULT 0,
    rating_safety DECIMAL(2,1) DEFAULT 0,
    description TEXT,
    FOREIGN KEY (city_id) REFERENCES cities(id)
);

CREATE TABLE IF NOT EXISTS interested_users_properties (
    user_id INT NOT NULL,
    property_id INT NOT NULL,
    PRIMARY KEY (user_id, property_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (property_id) REFERENCES properties(id)
);

CREATE TABLE IF NOT EXISTS amenities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    icon VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS properties_amenities (
    property_id INT NOT NULL,
    amenity_id INT NOT NULL,
    PRIMARY KEY (property_id, amenity_id),
    FOREIGN KEY (property_id) REFERENCES properties(id),
    FOREIGN KEY (amenity_id) REFERENCES amenities(id)
);

CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (property_id) REFERENCES properties(id)
);

-- Insert cities
INSERT INTO cities (name) VALUES 
('Delhi'), ('Mumbai'), ('Bengaluru'), ('Hyderabad'), ('Chennai');

-- Insert amenities
INSERT INTO amenities (name, type, icon) VALUES
('WiFi', 'Building', 'wifi'),
('Parking', 'Building', 'parking'),
('Power Backup', 'Building', 'powerbackup'),
('Lift', 'Building', 'lift'),
('CCTV', 'Building', 'cctv'),
('Fire Extinguisher', 'Building', 'fireext'),
('Dining Area', 'Common Area', 'dining'),
('TV', 'Common Area', 'tv'),
('Washing Machine', 'Common Area', 'washingmachine'),
('RO Water', 'Common Area', 'rowater'),
('AC', 'Bedroom', 'ac'),
('Bed', 'Bedroom', 'bed'),
('Geyser', 'Washroom', 'geyser');

-- Insert properties
INSERT INTO properties (city_id, name, address, gender, rent, rating_clean, rating_food, rating_safety, description) VALUES
(1, 'Cozy PG for Boys', '123 Main Street, Connaught Place', 'male', 8000, 4.5, 4.0, 4.5, 'A comfortable PG with all modern amenities'),
(1, 'Girls PG near Metro', '456 Park Avenue, Karol Bagh', 'female', 9000, 4.0, 4.5, 4.0, 'Safe and secure PG for girls with metro connectivity'),
(2, 'Premium PG Andheri', '789 Link Road, Andheri West', 'unisex', 12000, 4.5, 4.5, 4.5, 'Luxury PG with premium facilities'),
(2, 'Budget PG Dadar', '321 Station Road, Dadar', 'male', 7000, 3.5, 3.0, 3.5, 'Affordable PG near Dadar station'),
(3, 'Tech Park PG', '555 IT Park Road, Whitefield', 'unisex', 15000, 4.5, 4.0, 4.5, 'PG near tech parks with great amenities'),
(3, 'Student PG Koramangala', '777 80 Feet Road, Koramangala', 'female', 10000, 4.0, 4.0, 4.0, 'Popular PG among students'),
(4, 'Hitech City PG', '999 Cyberabad Road, Hitech City', 'male', 11000, 4.0, 4.5, 4.0, 'Modern PG for working professionals'),
(4, 'Gachibowli PG', '111 Financial District, Gachibowli', 'unisex', 13000, 4.5, 4.0, 4.5, 'Premium PG in financial district'),
(5, 'Anna Nagar PG', '222 2nd Avenue, Anna Nagar', 'female', 8500, 4.0, 3.5, 4.0, 'Comfortable PG in prime location'),
(5, 'T Nagar PG', '333 Usman Road, T Nagar', 'male', 7500, 3.5, 3.5, 3.5, 'Budget friendly PG near shopping area');

-- Link properties to amenities (all properties get basic amenities)
INSERT INTO properties_amenities (property_id, amenity_id)
SELECT p.id, a.id FROM properties p CROSS JOIN amenities a WHERE a.type = 'Building';

INSERT INTO properties_amenities (property_id, amenity_id)
SELECT p.id, a.id FROM properties p CROSS JOIN amenities a WHERE a.type = 'Common Area' AND p.rent > 8000;

INSERT INTO properties_amenities (property_id, amenity_id)
SELECT p.id, a.id FROM properties p CROSS JOIN amenities a WHERE a.type = 'Bedroom' AND p.rent > 9000;

INSERT INTO properties_amenities (property_id, amenity_id)
SELECT p.id, a.id FROM properties p CROSS JOIN amenities a WHERE a.type = 'Washroom' AND p.rent > 10000;

-- Insert testimonials
INSERT INTO testimonials (property_id, user_name, content) VALUES
(1, 'Rahul Sharma', 'Great place to stay! Very clean and food is good.'),
(1, 'Amit Kumar', 'Nice PG with helpful staff.'),
(2, 'Priya Singh', 'Very safe and secure. Metro is nearby.'),
(2, 'Neha Gupta', 'Good food and clean rooms.'),
(3, 'Arjun Patel', 'Premium facilities, worth the price.'),
(3, 'Kavya Reddy', 'Best PG I have stayed in Bangalore.'),
(4, 'Vikram Singh', 'Budget friendly and decent.'),
(5, 'Sanjay Kumar', 'Excellent location near tech parks.'),
(5, 'Ravi Teja', 'Great amenities and clean environment.');
