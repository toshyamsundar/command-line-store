let inquirer = require("inquirer");
let mysql = require("mysql");

let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "store_db",
  port: 3306
});

let getProducts = connection => {
  connection.connect(error => {
    if (error) throw error;

    let getProductsQuery = "select * from products";

    connection.query(getProductsQuery, (error, results) => {
      if (error) throw error;

      console.log(results);
      connection.end();
    });
  });
};

getProducts(connection);
