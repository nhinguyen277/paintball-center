const express = require("express");
const path = require("path"); // module to help with file path
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

dotenv.config(); // load local evironment variables from .env file.
const cors = require("cors"); //need this to set this API to allow requests from other servers
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || "3000";

const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}/paintball`;
const client = new MongoClient(dbUrl);

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //need this line to be able to receive/parse JSON from request

//allow requests from all servers
app.use(
  cors({
    origin: "*",
  })
);

//API endpoints

/**insert new account information */
app.post("/register", async (request, response) => {
  //for POST data, retrieve field data using request.body.<field-name>
  //for a GET form, use app.get() and request.query.<field-name> to retrieve the GET form data

  //retrieve values from submitted POST form
  let firstname = request.body.firstname;
  let lastname = request.body.lastname;
  let email = request.body.email;
  let pass = request.body.password;
  let phone = request.body.phone;
  bcrypt.hash(pass, 12).then((hash) => {
    let infor = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hash,
      phone: phone,
    };
    account(infor);
    response.redirect("http://localhost:5173/signin");
  });
  //redirect back to sign in page
});

app.post("/signin", async (request, response) => {
  let email = request.body.email;
  let pass = request.body.password;
  let user = await getAccount(email);
  if (user) {
    bcrypt.compare(pass, user.password, (err, res) => {
      if (res) {
        response.json("Success");
        // response.redirect("http://localhost:5173");
      } else {
        response.json("The password is incorrect");
      }
    });
  } else {
    response.json("No record existed");
  }
});

/*
 * returns: an array of staff list
 */
app.get("/api/staff", async (request, response) => {
  let staff = await getStaff();
  response.json(staff); //send JSON object with appropriate JSON headers
});

/*
 * returns: an array of scenarios list
 */
app.get("/api/scenarios", async (request, response) => {
  let scenarios = await getScenarios();
  response.json(scenarios); //send JSON object with appropriate JSON headers
});

app.post("/api/customers", async (request, response) => {
  //   let account = await getCustomer();
  //   response.json(account);
});

//set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

//MongoDB functions
async function connection() {
  await client.connect();
  db = client.db("paintball"); //select paintball database
  return db;
}

/* Async function to retrieve all staff from staff collection. */
async function getStaff() {
  db = await connection(); //await result of connection() and store the returned db
  var results = db.collection("staff").find({}); //{} as the query means no filter, so select all
  res = await results.toArray();
  return res;
}

/* Async function to retrieve all scenarios from scenarios collection. */
async function getScenarios() {
  db = await connection(); //await result of connection() and store the returned db
  var results = db.collection("scenarios").find({}); //{} as the query means no filter, so select all
  res = await results.toArray();
  return res;
}

/* Async function to insert account information of a customer into customers collection. */

async function account(customerData) {
  db = await connection(); //await result of connection() and store the returned db
  let status = await db.collection("customers").insertOne(customerData);
  console.log("customer added");
}

/* Async function to retrieve email, password of a customer from customers collection. */
async function getAccount(email) {
  db = await connection(); //await result of connection() and store the returned db
  const user = { email: email };
  // const pass = { password: password };
  const result = db.collection("customers").findOne(user);
  return result;
}
