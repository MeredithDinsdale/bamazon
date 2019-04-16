var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "S1lverfi$h",
  database: "bamazon_DB"
});

connection.connect(function(err) {
    if (err) throw err;
    start();
  });

  function start() {
    inquirer
      .prompt({
        name: "userType",
        type: "list",
        message: "What type of user are you?",
        choices: ["Customer", "Employee"]
      })
      .then(function(answer) {
          if(answer.userType === "Employee") {
              addInventory();
          }
          else if(answer.userType === "Customer") {
              shop();
          }
      });
  }
  
  // function to handle adding new items into the store inventory
  function addInventory() {
    // prompt for info about the new item
    inquirer
      .prompt([
        {
          name: "item",
          type: "input",
          message: "What would you like to add to inventory?"
        },
        {
          name: "category",
          type: "input",
          message: "What department does this item belong in?"
        },
        {
          name: "price",
          type: "input",
          message: "What is the price of this item?",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        },
        {
            name: "inventory",
            type: "input",
            message: "How many of these items are there?",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        }
      ])
      .then(function(answer) {
        // when finished prompting, insert a new item into the db with that info
        connection.query(
          "INSERT INTO inventory SET ?",
          {
            item_name: answer.item,
            category: answer.category,
            price: answer.price || 0,
            quantity: answer.inventory || 0
          },
          function(err) {
            if (err) throw err;
            console.log("The new item was successfully added to inventory!");
            // re-prompt the user for if they want to shop or add inventory
            start();
          }
        );
      });
  }

  function shop() {
    // Construct the db query string
    var queryDB = 'SELECT * FROM inventory';
  
    // Make the db query
    connection.query(queryDB, function(err, data) {
      if (err) throw err;
      console.log('.....................................................................\n');
      console.log('Browse our lovely items below!');
      console.log('.....................................................................\n');
  
      var strOut = '';
      for (var i = 0; i < data.length; i++) {
        strOut = '';
        strOut += 'Item ID: ' + data[i].id + '  //  ';
        strOut += 'Product Name: ' + data[i].item_name + '  //  ';
        strOut += 'Department: ' + data[i].category + '  //  ';
        strOut += 'Price: $' + data[i].price + '\n';
  
        console.log(strOut);
      }
      
        console.log("---------------------------------------------------------------------\n");

        promptPurchase();
    })
  }

// promptUserPurchase will prompt the user for the item/quantity they would like to purchase
function promptPurchase() {

	// Prompt the user to select an item
	inquirer.prompt([
		{
			type: 'input',
			name: 'id',
			message: 'Please enter the ID number of the item you would like to purchase.',
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'How many of these items would you like to purchase?',
		}
	]).then(function(input) {

		var item = input.id;
    var purchaseQuantity = input.quantity;
		// Query db to confirm that the given item ID exists in the desired quantity
		connection.query('SELECT * FROM inventory WHERE ?', {id: item}, function(err, data) {
			if (err) throw err;

			if (data.length === 0) {
				console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
				shop();

			} else {
				var productData = data[0];

				// If the quantity requested by the user is in stock
				if (purchaseQuantity <= productData.quantity) {
          
          console.log('Congratulations, the product you requested is in stock!');
          console.log('.......................................');

					// Construct the updating query string
					var updateQueryStr = 'UPDATE inventory SET quantity = ' + (productData.quantity - purchaseQuantity) + ' WHERE id = ' + item;

					// Update the inventory
					connection.query(updateQueryStr, function(err, data) {
						if (err) throw err;

						console.log('Your oder has been placed! Your total is $' + productData.price * purchaseQuantity);
						console.log('Thank you for shopping with us!');
						console.log("\n---------------------------------------------------------------------\n");
            
            nextStep();
            
          }) 
        } else {
					console.log('Oh no, we don\'t have enough of that item in stock...');
					console.log('Please select a different item, or a lower quantity.');
          console.log("\n---------------------------------------------------------------------\n");
          nextStep();	
			    }
		    } 
	   })
  })
}

function nextStep() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'keepShopping',
      message: 'What would you like to do now?',
      choices: ['Shop for more items', 'Exit the store']
    }
  ]).then(function(answer) {
    if (answer.keepShopping === 'Shop for more items') {
      shop();
    }
    else if (answer.keepShopping === 'Exit the store') {
      start();
    }
    else {
      console.log('Something seems to have gone wrong. Please restart.')
    }
  })
}

//The goShopping function prompts the user to select a department to shop in 
//   function goShopping() {
//     inquirer
//     .prompt([
//         {
//             name: "department",
//             type: "list",
//             message: "What department would you like to visit?",
//             choices: ["Furniture", "Clothing", "Toys", "Go Back"]
//         }
//     ])
//     .then(function(answer) {
//       // based on their answer, either call the bid or the post functions
//       if (answer.department === "Furniture") {
//         shopFurniture();
//       }
//       else if(answer.department === "Clothing") {
//         shopClothing();
//       }
//       else if(answer.department === "Toys") {
//           shopToys();
//       }
//       else if(answer.department === "Go Back") {
//         start();
//       } else{
//         connection.end();
//       }
//     });
// }
//Browsing furniture inventory


// function shopFurniture() {
//   console.log("Welcome to the furniture department!");
//     connection.query("SELECT * FROM inventory WHERE category='furniture'", function(err, results) {
//         if (err) throw err;
//     inquirer 
//     .prompt([
//         {
//             name: "inventoryList",
//             type: "list",
//             message: "Browse our furniture below:",
//             choices: function() {
//                 var choiceArray = [];
//                 for (var i = 0; i < results.length; i++) {
//                   choiceArray.push(results[i].item_name);
//                 }
//                   choiceArray.push("Go back to departments");
//                 return choiceArray;

//         }
//     }
//   ]).then(function(answer) {
//     if (answer.inventoryList === "Go back to departments") {
//       goShopping();
//     }
//     else{
//       console.log("that costs: "+results[answer.id].price);
//     }
//   })     
// })
// }


// //Browsing clothing inventory
// function shopClothing() {
//   console.log("Welcome to the clothing department!");
//     connection.query("SELECT * FROM inventory WHERE category='clothes'", function(err, results) {
//         if (err) throw err;
//     inquirer 
//     .prompt([
//         {
//             name: "inventoryList",
//             type: "list",
//             message: "Browse our clothing below:",
//             choices: function() {
//                 var choiceArray = [];
//                 for (var i = 0; i < results.length; i++) {
//                   choiceArray.push(results[i].item_name);
//                 }
//                 choiceArray.push("Go back to departments");
//                 return choiceArray;

//         }
//     }
//   ]).then(function(answer) {
//     if (answer.inventoryList === "Go back to departments") {
//       goShopping();
//     }
//   })    
// })
// }

// //Browsing toy inventory
// function shopToys() {
//   console.log("Welcome to the toy department!");
//     connection.query("SELECT * FROM inventory WHERE category='toys'", function(err, results) {
//         if (err) throw err;
//     inquirer 
//     .prompt([
//         {
//             name: "inventoryList",
//             type: "list",
//             message: "Browse our toys below:",
//             choices: function() {
//                 var choiceArray = [];
//                 for (var i = 0; i < results.length; i++) {
//                   choiceArray.push(results[i].item_name);  
//                 }
//                 choiceArray.push("Go back to departments");
//                 return choiceArray;

//         }
//     }
//   ]).then(function(answer) {
//     if (answer.inventoryList === "Go back to departments") {
//       goShopping();
//     }
//   })     
// })
// }



  