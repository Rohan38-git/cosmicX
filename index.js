const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const path = require("path");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname)));

const client = new MongoClient("mongodb://localhost:27017");
let db;

client.connect().then(() => {
  db = client.db("26csel10"); 
  console.log("Connected to MongoDB");
});

app.post("/register", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    alert("All fields are required");
  }

  if (password.length < 3 || password.length > 12) {
   alert("Password must be 3–12 characters long");
  }

  const user = { first_name, last_name, email, password, createdAt: new Date() };

  try {
    await db.collection("users").insertOne(user);
    res.redirect("/login.html"); 
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving user");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await db.collection("users").findOne({ email, password });

  if (user) {
    res.redirect("/index.html"); 
  }
  else {
    alert("Invalid email or password");
  }
});

 app.listen(3000, () => console.log("Server running on http://localhost:3000"));

