-- CHGOURI CAR Database Schema (MySQL - Simplified Commercial Version)
-- Created for Abdelali LACHGAR - Marrakech Economy Car Rental Platform

CREATE DATABASE IF NOT EXISTS chgouri_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE chgouri_db;

-- Disable foreign key checks temporarily to allow clean drops
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS availability_calendar;
DROP TABLE IF EXISTS seasonal_pricing;
DROP TABLE IF EXISTS booking_options;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS cars;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS messages;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. USERS TABLE (Single Admin Store)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. CARS TABLE (Fleet Catalog)
CREATE TABLE cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    category VARCHAR(100) DEFAULT 'Economy',
    price_per_day DECIMAL(10, 2) NOT NULL,
    price_per_week DECIMAL(10, 2) NOT NULL,
    price_per_month DECIMAL(10, 2) NOT NULL,
    image_url TEXT NOT NULL, -- Stored as JSON string array: ["/uploads/file1.jpg", "/uploads/file2.jpg"]
    features TEXT NULL, -- String list: "AC, Manual, Petrol, 5 Seats"
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. BOOKINGS TABLE (Public Reservations requests without client login)
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    car_id INT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    pickup_date DATE NOT NULL,
    return_date DATE NOT NULL,
    pickup_location VARCHAR(255) NOT NULL,
    booking_status ENUM('pending', 'contacted', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
    INDEX idx_booking_status (booking_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. MESSAGES TABLE (Contact Inquiry Form submissions)
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================================
-- SEED DATA SETUP (Single Admin + economy cars)
-- =========================================================================

-- 1. Insert Administrator: Abdelali LACHGAR
-- Password hash is generated for "ChgouriAdmin2026!" using bcrypt
INSERT INTO users (name, email, password_hash, phone, role) VALUES 
('Abdelali LACHGAR', 'admin@chgouricar.com', '$2a$12$YJz1oTzb74Ju5YFg1HExQeWy.YBURJ6oS8WF3KKAbLNd60uk5BVtS', '+212661901873', 'admin');

-- 2. Insert Initial Fleet (JSON representation of image arrays for slider)
INSERT INTO cars (brand, model, year, category, price_per_day, price_per_week, price_per_month, image_url, features) VALUES 
('Hyundai', 'i10', 2024, 'Economy', 250.00, 220.00, 180.00, '["https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=600"]', 'Climatisation, Manuelle, Essence, 5 Places'),
('Dacia', 'Sandero Stepway', 2024, 'Economy', 300.00, 270.00, 220.00, '["https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&q=80&w=600"]', 'Climatisation, Manuelle, Diesel, 5 Places'),
('Renault', 'Clio 5', 2023, 'Economy', 320.00, 290.00, 240.00, '["https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=600"]', 'Climatisation, Manuelle, Diesel, 5 Places'),
('Kia', 'Picanto', 2024, 'Economy', 260.00, 230.00, 190.00, '["https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&q=80&w=600"]', 'Climatisation, Automatique, Essence, 5 Places');
