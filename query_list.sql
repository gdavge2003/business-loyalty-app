# List of queries that are used in the website. Source code is not dependent on this file. This is a reference.

# Selects
SELECT id, name, price FROM product;
SELECT id, name, price FROM product WHERE id = [id];
SELECT id, name, phone_number, points, is_activated FROM customer;
SELECT id, name, phone_number, points, is_activated FROM customer WHERE id = [id];
SELECT phone_number FROM customer WHERE phone_number = [phone_number];


# Inserts
INSERT INTO product (name, price) VALUES ([name, price]);
INSERT INTO product (name, phone_number, points, is_activated) VALUES [name, phone_number, 0, true];

# Updates
UPDATE product SET name = [name], price = [price] WHERE id = [id];
UPDATE customer SET name = [name], phone_number = [phone_number], points = [points] WHERE id = [id];


# Deletes
DELETE FROM product WHERE id = [id];
DELETE FROM customer WHERE id = [id];
