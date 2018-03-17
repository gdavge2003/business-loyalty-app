# deleting tables
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS referral;
DROP TABLE IF EXISTS visit;
DROP TABLE IF EXISTS customer_order;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS order_product;


# creating tables
CREATE TABLE customer (
	id int(11) AUTO_INCREMENT,
	name varchar(255),
	phone_number varchar(255) NOT NULL,
	points int(11) NOT NULL,
	is_activated boolean,

	PRIMARY KEY(id)
);

CREATE TABLE referral (
	referrer_id int(11) NOT NULL,
	referred_id int(11) NOT NULL,

	FOREIGN KEY(referrer_id) REFERENCES customer(id),
	FOREIGN KEY(referred_id) REFERENCES customer(id),
	UNIQUE KEY(referrer_id, referred_id)
);

CREATE TABLE visit (
	id int(11) AUTO_INCREMENT,
	visit_date date NOT NULL,
	customer_id int(11) NOT NULL,

	PRIMARY KEY(id),
	FOREIGN KEY(customer_id) REFERENCES customer(id)
);

CREATE TABLE customer_order (
	id int(11) AUTO_INCREMENT,
	customer_id int(11) NOT NULL,

	PRIMARY KEY(id),
	FOREIGN KEY(customer_id) REFERENCES customer(id)
);

CREATE TABLE product (
	id int(11) AUTO_INCREMENT,
	name varchar(255) NOT NULL,
	price numeric(15,2),

	PRIMARY KEY(id)
);

CREATE TABLE order_product (
	order_id int(11) NOT NULL,
	product_id int(11) NOT NULL,
	quantity int(11) NOT NULL,

	FOREIGN KEY(order_id) REFERENCES customer_order(id),
	FOREIGN KEY(product_id) REFERENCES product(id),
	UNIQUE KEY(order_id, product_id)
);