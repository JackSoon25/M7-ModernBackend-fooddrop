-- Mock data for FoodDrop Platform Service
--
-- NOTE ON PASSWORDS: every pwd value below is a real bcrypt hash (cost 10)
-- of the plaintext "password123" — generated with Python's bcrypt library.
-- Use "password123" to log in as any vendor or user while testing.
-- In your Express app, compare with bcrypt.compare(inputPwd, storedHash).

USE fooddrop;

SET FOREIGN_KEY_CHECKS = 0;

-- Clear out the existing data completely
TRUNCATE TABLE cuisines;
TRUNCATE TABLE vendors;
TRUNCATE TABLE offers;
TRUNCATE TABLE users;
TRUNCATE TABLE redemptions;
TRUNCATE TABLE notes;

-- 3. Turn foreign key checks back on
SET FOREIGN_KEY_CHECKS = 1;


-- cuisines (5)
-- ---------------------------------------------------------------------
INSERT INTO cuisines (cuisine_id, cuisine_name) VALUES
(1, 'Chinese'),
(2, 'Japanese'),
(3, 'Western'),
(4, 'Malay'),
(5, 'Indian');


-- vendors (3)
-- ---------------------------------------------------------------------
INSERT INTO vendors
(vendor_id, vendor_name, mobile_number, pwd, unit_number, building_number, street_name, postal_code, latitude, longitude, created_at, updated_at, cuisine_id)
VALUES
(1, 'Wok Wonders', '91234567', '$2b$10$FVqfubd9jpc4VXUqkH9EaOfNry76I3eT0z6xmf4ehqqdlD.0cApx.', '01-23', 'Maxwell Food Centre', 'Kadayanallur Street', '069184', 1.280095, 103.844990, '2026-06-01 09:00:00', '2026-06-01 09:00:00', 1),
(2, 'Sakura Bento', '92345678', '$2b$10$FVqfubd9jpc4VXUqkH9EaOfNry76I3eT0z6xmf4ehqqdlD.0cApx.', '02-15', 'Tanjong Pagar Plaza', 'Tanjong Pagar Road', '082001', 1.276926, 103.845123, '2026-06-02 10:30:00', '2026-06-02 10:30:00', 2),
(3, 'Nasi Lemak Corner', '93456789', '$2b$10$FVqfubd9jpc4VXUqkH9EaOfNry76I3eT0z6xmf4ehqqdlD.0cApx.', '01-05', NULL, 'Bedok North Street 1', '460001', 1.325180, 103.930250, '2026-06-03 08:15:00', '2026-06-03 08:15:00', 4);

-- offers (6) — vendor 1 x1, vendor 2 x2, vendor 3 x3
-- ---------------------------------------------------------------------
INSERT INTO offers (offer_id, offer_description, expiry_time, created_at, vendor_id) VALUES
(1, 'Buy 1 get 1 free char siu rice, while stocks last!', '2026-07-18 20:00:00', '2026-07-08 09:30:00', 1),
(2, '20% off salmon don, minimum 2 orders', '2026-07-19 21:00:00', '2026-07-08 10:00:00', 2),
(3, 'Free miso soup with any bento set', '2026-07-22 19:30:00', '2026-07-08 10:05:00', 2),
(4, 'Nasi lemak set meal at flash price of $3.50', '2026-07-19 14:00:00', '2026-07-08 08:00:00', 3),
(5, 'Buy 2 get 1 free curry puffs', '2026-07-21 18:00:00', '2026-07-08 08:10:00', 3),
(6, 'Weekend combo: nasi lemak + iced tea for $5', '2026-07-23 15:00:00', '2026-07-08 08:20:00', 3);

-- users (5)
-- ---------------------------------------------------------------------
INSERT INTO users (user_id, mobile_number, pwd, created_at) VALUES
(1, '81112222', '$2b$10$FVqfubd9jpc4VXUqkH9EaOfNry76I3eT0z6xmf4ehqqdlD.0cApx.', '2026-06-10 12:00:00'),
(2, '81223333', '$2b$10$FVqfubd9jpc4VXUqkH9EaOfNry76I3eT0z6xmf4ehqqdlD.0cApx.', '2026-06-11 13:15:00'),
(3, '81334444', '$2b$10$FVqfubd9jpc4VXUqkH9EaOfNry76I3eT0z6xmf4ehqqdlD.0cApx.', '2026-06-12 14:20:00'),
(4, '81445555', '$2b$10$FVqfubd9jpc4VXUqkH9EaOfNry76I3eT0z6xmf4ehqqdlD.0cApx.', '2026-06-13 09:05:00'),
(5, '81556666', '$2b$10$FVqfubd9jpc4VXUqkH9EaOfNry76I3eT0z6xmf4ehqqdlD.0cApx.', '2026-06-14 16:40:00');

-- ---------------------------------------------------------------------
-- redemptions (6) — one per offer, links a user to a purchased offer.
-- Users 1-3 each redeemed offers they leave notes on below.
-- Users 4 and 5 also redeemed an offer each, but chose not to leave a note
-- (demonstrates that a redemption does not require a note).
-- ---------------------------------------------------------------------
INSERT INTO redemptions (redemption_id, offer_id, user_id) VALUES
(1, 1, 1),  -- user1 redeemed offer1 (Wok Wonders)
(2, 2, 2),  -- user2 redeemed offer2 (Sakura Bento)
(3, 4, 2),  -- user2 redeemed offer4 (Nasi Lemak Corner)
(4, 5, 3),  -- user3 redeemed offer5 (Nasi Lemak Corner)
(5, 3, 4),  -- user4 redeemed offer3, no note left
(6, 6, 5);  -- user5 redeemed offer6, no note left

-- ---------------------------------------------------------------------
-- notes (4) — user1 x1, user2 x2, user3 x1, user4/user5 none
-- ---------------------------------------------------------------------
INSERT INTO notes (note_id, note_text, created_at, redemption_id) VALUES
(1, 'Portion was generous and the rice was really fragrant!', '2026-07-08 12:30:00', 1),
(2, 'Salmon was fresh, great deal for the price.', '2026-07-08 13:10:00', 2),
(3, 'Sambal was a bit too spicy for me but still tasty overall.', '2026-07-08 13:15:00', 3),
(4, 'Curry puffs were crispy, good value for a flash deal!', '2026-07-08 14:00:00', 4);