let inquirer = require("inquirer");
let mysql = require("mysql");

let createDBConnection = () => {
  let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "store_db",
    port: 3306
  });

  return connection;
};

let checkProductAvailability = (productId, productQuantity) => {
  let connection = createDBConnection();
  connection.connect(error => {
    if (error) throw error;

    let checkProductsQuery = "SELECT * FROM products WHERE item_id = ? AND stock_quantity >= ?";

    connection.query(checkProductsQuery, [productId, productQuantity], (error, results) => {
      if (error) throw error;
      console.table(results);
      connection.end();
    });
  });
};

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

      checkProductAvailability(response.productId, response.productQuantity);
    });
};

let getProducts = () => {
  let connection = createDBConnection();
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

getProducts();
