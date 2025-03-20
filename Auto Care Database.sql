-- AutoCare dtabase code
-- Create database
CREATE DATABASE IF NOT EXISTS autocare;
-- Use the database
USE autocare;
-- users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100),
    vehicle_name VARCHAR(100),
    registration_number VARCHAR(100),
    address VARCHAR(255),
    phone VARCHAR(15),
    password VARCHAR(100) NOT NULL,
    role ENUM('customer', 'admin', 'mechanic') DEFAULT 'customer'
);

CREATE TABLE routine_maintenance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    location VARCHAR(255),
    vehicle_details VARCHAR(255),
    service_date DATE,
    service_time TIME,
    status ENUM('Pending', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE repairs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    location VARCHAR(255),
    vehicle_details VARCHAR(255),
    service_date DATE,
    service_time TIME,
    status ENUM('Pending', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE diagnostics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    location VARCHAR(255),
    vehicle_details VARCHAR(255),
    service_date DATE,
    service_time TIME,
    status ENUM('Pending', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE body_work (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    location VARCHAR(255),
    vehicle_details VARCHAR(255),
    service_date DATE,
    service_time TIME,
    status ENUM('Pending', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE towing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    location VARCHAR(255),
    vehicle_details VARCHAR(255),
    pickup_date DATE,
    pickup_time TIME,
    status ENUM('Pending', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    estimated_time INT
);

INSERT INTO services (service_name, description, price, estimated_time)
VALUES
('Routine Maintenance', 'Oil changes, tire rotations, and fluid checks to keep your vehicle running smoothly.', 2500.00, 60),
('Repairs', 'Comprehensive repair services to fix any issue your vehicle might have.', 5000.00, 120),
('Diagnostics', 'Full vehicle diagnostics to detect and solve any issue.', 1500.00, 90),
('Body Work', 'High-quality bodywork services to restore and repair your vehicle\'s exterior.', 3000.00, 180),
('Towing', 'Fast and reliable towing services available 24/7.', 2000.00, 30);

show tables;
