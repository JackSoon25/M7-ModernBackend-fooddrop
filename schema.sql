-- SQL Schema for FoodDrop Platform Service

CREATE DATABASE IF NOT EXISTS fooddrop;
USE fooddrop;

-- cuisines
CREATE TABLE IF NOT EXISTS cuisines (
    cuisine_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cuisine_name VARCHAR(50) NOT NULL
);

-- vendors
CREATE TABLE IF NOT EXISTS vendors (
    vendor_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vendor_name VARCHAR(100) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    pwd VARCHAR(255) NOT NULL,
    unit_number VARCHAR(20) NOT NULL,
    building_number VARCHAR(100),
    street_name VARCHAR(150) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    latitude DECIMAL(9,6) NOT NUll,
    longitude DECIMAL(9,6) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    cuisine_id INT,
    FOREIGN KEY (cuisine_id) REFERENCES cuisines (cuisine_id) ON DELETE SET NULL
);

-- offers
CREATE TABLE IF NOT EXISTS offers (
    offer_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    offer_description TEXT NOT NULL,
    expiry_time DATETIME NOT NULL,
    created_at TIMESTAMP NOT NULL,
    vendor_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id) ON DELETE CASCADE
);

-- users
CREATE TABLE IF NOT EXISTS users (
    user_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    mobile_number VARCHAR(20) NOT NULL,
    pwd VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL
);

-- redemptions
CREATE TABLE IF NOT EXISTS redemptions (
    redemption_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    offer_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (offer_id) REFERENCES offers (offer_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id)  REFERENCES users (user_id) ON DELETE CASCADE
);

-- notes
CREATE TABLE IF NOT EXISTS notes (
    note_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    note_text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    redemption_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (redemption_id) REFERENCES redemptions(redemption_id) ON DELETE CASCADE
);


