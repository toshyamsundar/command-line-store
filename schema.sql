create database store_db;

use store_db;

create table products (
item_id integer primary key auto_increment,
product_name varchar(100) not null,
department_name varchar (100) not null,
price decimal(10,2) not null,
stock_quantity integer not null
);