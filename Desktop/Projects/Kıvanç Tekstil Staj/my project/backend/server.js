const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();

const port = 3001;

app.use(express.json()); // JSON data transfer support for Express
app.use(cors()); // Cross-origin resource sharing support

// Import the mongoose module
const mongoose = require("mongoose");

// Connect to the MongoDB database
mongoose.connect("mongodb://localhost:27017/mydatabase"); // MongoDB connection

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Bind connection to open event (once connection is open)
db.once("open", () => {
  console.log("MongoDB connection successful");
});

// Define a schema for the 'users' collection
const userSchema = new mongoose.Schema(
  {
    username: String,  // Define a string field for username
    password: String,  // Define a string field for password
  },
  { collection: "users" }  // Specify the collection name 'users'
);

// Define a schema for the 'customers' collection
const customerSchema = new mongoose.Schema(
  {
    customername: String,  // Define a string field for customer name
  },
  { collection: "customers" }  // Specify the collection name 'customers'
);

const orderSchema = new mongoose.Schema(
  {
    customername: String,
    unit: Number,
    size: Number,
  },
  { collection: "orders" }
);

const stockSchema = new mongoose.Schema(
  {
    username: String,
    unit: Number,
    size: Number,
  },
  { collection: "stocks" }
);

const stockLengthSchema = new mongoose.Schema(
  {
    length: Number,
  },
  { collection: "stockLength" }
);

const optimizedSolutionSchema = new mongoose.Schema(
  {
    cuttingResults: [
      {
        customer_id: String,
        length: Number,
        used_quantity: Number,
      },
    ],
    remaining: Number,
  },
  { collection: "optimizedSolution" }
);

const User = mongoose.model("User", userSchema);
const Customer = mongoose.model("Customer", customerSchema);
const Order = mongoose.model("Order", orderSchema);
const Stock = mongoose.model("Stock", stockSchema);
const stockLength = mongoose.model("stockLength", stockLengthSchema);
const optimizedSolution = mongoose.model(
  "optimizedSolution",
  optimizedSolutionSchema
);

const stockList = [];
const orderList = [];

app.post("/auth/user", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && user.password === password) {
      return res.json({ message: "Başarılı" });
    } else {
      return res.json({ message: "Incorrect password or ID." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/auth/customer", async (req, res) => {
  try {
    const { customername } = req.body;
    const customer = await Customer.findOne({ customername });
    if (customer) {
      return res.json({ message: "Başarılı" });
    } else {
      return res.json({ message: "Incorrect ID." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/add-stock", async (req, res) => {
  const { username, unit, size } = req.body;
  let tmpData = {
    username,
    unit: parseInt(unit), // unit is converted to integer
    size,
  };

  try {
    const stock = await Stock.findOne({ size });
    if (stock) {
      stock.unit += tmpData.unit; // Update the unit field
      await stock.save(); // Save the updated stock
    } else {
      const newStock = new Stock(tmpData); // Create a new stock
      await newStock.save();
    }
  } catch (error) {
    console.error("Error processing stock:", error);
    return res.status(500).json({ message: "Server error" });
  }

  res.json({ message: "I am alive" });
});

app.get("/list-stock", async (req, res) => {
  try {
    stockList.length = 0;

    const stocks = await Stock.find({}); 
    const stockCount = stocks.length;
    stockList.push(...stocks);

    res.json({
      stockList: stockList,
      stockCount: stockCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" }); 
  }
});

app.post("/add-order", async (req, res) => {
  const { customername, unit, size } = req.body;
  let tmpData = {
    customername,
    unit: parseInt(unit),
    size,
  };

  try {
    const order = await Order.findOne({ customername, size });
    if (order) {
      order.unit += tmpData.unit;
      await order.save();
    } else {
      const newOrder = new Order(tmpData); // Create a new order
      await newOrder.save(); // Save the new order to the database
    }
  } catch (error) {
    console.error("Error processing stock:", error);
    return res.status(500).json({ message: "Server error" });
  }

  res.json({ message: "I am alive" });
});

app.post("/delete-item", async (req, res) => {
  const { fieldType, value, unit, size, collectionName } = req.body;

  try {
    const collection = mongoose.connection.collection(collectionName);
    const query = { [fieldType]: value, size, unit: parseInt(unit) };
    const deletedDocument = await collection.findOneAndDelete(query);

    if (deletedDocument) {
      res
        .status(200)
        .send(`Order for ${value} has been deleted from ${collectionName}.`);
    } else {
      res.status(404).send("Order not found.");
    }
  } catch (error) {
    console.error("Error processing stock:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.get("/list-order", async (req, res) => {
  try {
    orderList.length = 0;

    const orders = await Order.find({});
    const orderCount = orders.length;
    orderList.push(...orders);

    res.json({
      orderCount: orderCount,
      orderList: orderList,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "list-order operation failed" });
  }
});

app.get("/list-order-customer", async (req, res) => {
  const { customername } = req.query;
  try {
    orderList.length = 0;

    const orders = await Order.find({ customername });
    const orderCount = orders.length;
    orderList.push(...orders);

    res.json({
      orderCount: orderCount,
      orderList: orderList,
    });
    console.log("Order list:", orderList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "list-order-customer operation failed" });
  }
});

app.post("/optimize", async (req, res) => {
  try {
    orderList.length = 0; // Clear the orderList array

    const orders = await Order.find({});
    orderList.push(...orders);

    const roll_length = await stockLength.findOne({})

    const flaskResponse = await axios.post(
      "http://localhost:3002/your-flask-endpoint",{
        orderList: orderList,
        roll_length: roll_length.length
      }
    );

    data = flaskResponse.data;

    let element_count = 0;
    let total_remaining = 0;

    
    await optimizedSolution.deleteMany({});
    for (const element of flaskResponse.data) {
      const cuttingResults = element.filter((item) => item.customer_id);
      const remaining = element.find((item) => item.remaining);
      element_count++;
      const newSolution = new optimizedSolution({
        cuttingResults: cuttingResults,
        remaining: remaining ? remaining.remaining : null,
      });

      if (remaining) {
        total_remaining += remaining.remaining;
      }

      await newSolution.save();
    }

    res.json({
      message: "optimize operation successful",
      results: flaskResponse.data,
      total_remaining: total_remaining,
      stock_size: roll_length.length,
      element_count: element_count,

    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "save-stock-length operation failed" });
  }
});

app.post("/save-stock-length", async (req, res) => {
  const { length } = req.body;
  try {
    await stockLength.deleteMany({});
    const newStockLength = new stockLength({ length: length });
    await newStockLength.save();
    res.json({ message: "save-stock-length operation successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "save-stock-length operation failed" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});