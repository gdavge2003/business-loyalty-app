# List of queries that are used in the website. Source code is not dependent on this file. This is a reference.

# Selects
SELECT id, name, price FROM product;
SELECT id, name, price FROM product WHERE id = [id];

# Inserts
INSERT INTO product (name, price) VALUES ([name],[price]);


# Updates
UPDATE product SET name = [name], price = [price] WHERE id = [id];



# Deletes
DELETE FROM product WHERE id = [id];
