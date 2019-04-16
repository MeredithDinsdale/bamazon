CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE inventory(
  item_name VARCHAR(100) NOT NULL,
  category VARCHAR(45) NOT NULL,
  price INT default 0,
  count INT NOT NULL,
  PRIMARY KEY (item_name)
);

INSERT INTO inventory (item_name, category, price, count)
VALUES ("chair", "furniture", 20, 50);

INSERT INTO inventory (item_name, category, price, count)
VALUES ("desk", "furniture", 50, 20);

INSERT INTO inventory (item_name, category, price, count)
VALUES ("lamp", "furniture", 10, 50);

INSERT INTO inventory (item_name, category, price, count)
VALUES ("shirt", "clothes", 15, 30);

INSERT INTO inventory (item_name, category, price, count)
VALUES ("pants", "clothes", 20, 50);

INSERT INTO inventory (item_name, category, price, count)
VALUES ("socks", "clothes", 5, 50);



