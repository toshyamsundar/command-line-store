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

let fulfillCustomerOrder = (connection, productResults, orderedQuantity) => {
  let updateQuery = "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?";

  connection.query(updateQuery, [orderedQuantity, productResults[0].item_id], (error, results) => {
    if (error) throw error;

    console.log(`\nCongratulations!! Your order for ${productResults[0].product_name} has been completed.\n`);
    console.log(`\nHere is your receipt\n`);
    let receipt = {
      Product: productResults[0].product_name,
      "Total Cost": "$" + productResults[0].price * orderedQuantity
    };
    console.table(receipt);
    console.log("\n");
    connection.end();

    inquirer
      .prompt([
        {
          type: "list",
          message: "Would you like to order more?",
          choices: ["YES", "NO"],
          name: "orderMore"
        }
      ])
      .then(response => {
        if (response.orderMore === "YES") {
          getProducts();
        }
      });
  });
};

let checkProductAvailability = (productId, orderedQuantity) => {
  let connection = createDBConnection();
  connection.connect(error => {
    if (error) throw error;

    let checkProductQuery = "SELECT item_id, product_name, stock_quantity, price FROM products WHERE item_id = ?";

    connection.query(checkProductQuery, [productId], (error, results) => {
      if (error) throw error;
      if (results.length === 0) {
        console.log("\nProduct Not Available!!\n");
        connection.end();
        inquirer
          .prompt([
            {
              type: "list",
              message: "Would you like to order another product?",
              choices: ["YES", "NO"],
              name: "orderMore"
            }
          ])
          .then(response => {
            if (response.orderMore === "YES") {
              getProducts();
            }
          });
      } else {
        if (results[0].stock_quantity < orderedQuantity) {
          console.log("\nInsufficient Quantity!!\n");
          connection.end();
          inquirer
            .prompt([
              {
                type: "list",
                message: "Would you like to reorder?",
                choices: ["YES", "NO"],
                name: "orderMore"
              }
            ])
            .then(response => {
              if (response.orderMore === "YES") {
                getProducts();
              }
            });
        } else {
          fulfillCustomerOrder(connection, results, orderedQuantity);
        }
      }
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
        message: "How many units would you like to purchase? ",
        name: "orderedQuantity"
      }
    ])
    .then(response => {
      checkProductAvailability(response.productId, response.orderedQuantity);
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
