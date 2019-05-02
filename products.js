let inquirer = require("inquirer");
let mysql = require("mysql");

let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "store_db",
  port: 3306
});

let getCustomerOrder = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter the ID of the product that you would like to purchase: ",
        name: "productId"
      },
      {
        type: "input",
        message: "How many units would you like to purchase?",
        name: "productQuantity"
      }
    ])
    .then(response => {
      console.log(response.productId + " => " + response.productQuantity);
    });
};

let getProducts = connection => {
  connection.connect(error => {
    if (error) throw error;

    let getProductsQuery = "select * from products";

    connection.query(getProductsQuery, (error, results) => {
      if (error) throw error;

      console.table(results);
      connection.end();
      console.log("\n");
      getCustomerOrder();
    });
  });
};

getProducts(connection);
