const express = require("express");
const path = require("path"); // module to help with file path
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const parser = require("cookie-parser");

dotenv.config(); // load local evironment variables from .env file.
const cors = require("cors"); //need this to set this API to allow requests from other servers
const { MongoClient, ObjectId } = require("mongodb");
const { timeStamp } = require("console");

const app = express();
const port = process.env.PORT || "3000";

const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}/paintball`;
const client = new MongoClient(dbUrl);

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //need this line to be able to receive/parse JSON from request

//allow requests from all servers
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(parser());

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
  let create = new Date();
  let deleted = null;
  bcrypt.hash(pass, 12).then((hash) => {
    let infor = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hash,
      phone: phone,
      created_at: create,
      deleted_at: deleted,
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
        const token = jwt.sign({ email: user.email }, process.env.KEY, {
          expiresIn: "1h",
        });
        response.cookie("token", token, { maxAge: 360000 });
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

const verifyUser = async (request, response, next) => {
  try {
    const token = request.cookies.token;
    if (!token) {
      return response.json({ status: false, message: "no token" });
    }
    const decoded = await jwt.verify(token, process.env.KEY);
    next();
  } catch (err) {
    return response.json(err);
  }
};

app.get("/verify", verifyUser, (request, response) => {
  return response.json({ status: true, message: "authorized" });
});

app.get("/signout", (request, response) => {
  response.clearCookie("token");
  return response.json({ status: true });
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

/*
 * returns: an a scenario detail
 */
app.get("/api/scenarios/:id", async (request, response) => {
  let scenarioId = request.params.id;
  let scenario = await getScenarioDetail(scenarioId);
  response.json(scenario); //send JSON object with appropriate JSON headers
});

/**BOOKING */
/*
 * returns: an array of booking list
 */
app.get("/api/booking", async (request, response) => {
  let booking = await getBooking();
  response.json(booking); //send JSON object with appropriate JSON headers
});

/*
 * returns: an a booking detail
 */
app.get("/api/booking/:id", async (request, response) => {
  let bookingId = request.params.id;
  let booking = await getBookingDetail(bookingId);
  response.json(booking); //send JSON object with appropriate JSON headers
});

app.post("/admin/booking/add", async (request, response) => {
  //for POST data, retrieve field data using request.body.<field-name>
  //for a GET form, use app.get() and request.query.<field-name> to retrieve the GET form data
  //retrieve values from submitted POST form
  // let wgt = request.body.weight;
  // //console.log(wgt);
  // let path = request.body.path;
  // let linkText = request.body.name;
  // let newLink = {
  //   weight: wgt,
  //   path: path,
  //   name: linkText,
  // };
  // await addSchedule(newSchedule);
  // response.redirect("/admin/schedule"); //redirect back to Administer menu page
});

/**END BOOKING */

app.post("/api/customers", async (request, response) => {
  //   let account = await getCustomer();
  //   response.json(account);
});

/**ADMIN API */

//ADMIN FORM PROCESSING SCHEDULE

app.get("/api/schedule", async (request, response) => {
  let schedule = await getSchedule();
  response.json(schedule);
});
app.post("/admin/schedule/add", async (request, response) => {
  //for POST data, retrieve field data using request.body.<field-name>
  //for a GET form, use app.get() and request.query.<field-name> to retrieve the GET form data

  //retrieve values from submitted POST form
  let wgt = request.body.weight;
  //console.log(wgt);
  let path = request.body.path;
  let linkText = request.body.name;
  let newLink = {
    weight: wgt,
    path: path,
    name: linkText,
  };
  await addSchedule(newSchedule);
  response.redirect("/admin/schedule"); //redirect back to Administer menu page
});

/**ENDING ADMIN API */

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

/** CUSTOMER DATA */

/* Async function to retrieve all scenarios from scenarios collection. */
async function getScenarios() {
  db = await connection(); //await result of connection() and store the returned db
  var results = db.collection("scenarios").find({}); //{} as the query means no filter, so select all
  res = await results.toArray();
  return res;
}

/* Async function to retrieve id of  a scenario from scenarios collection. */
async function getScenarioDetail(id) {
  db = await connection(); //await result of connection() and store the returned db
  const reid = new ObjectId(id);
  const result = db.collection("scenarios").findOne({ _id: reid });
  return result;
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

/* Async function to retrieve all booking from booking collection. */
async function getBooking() {
  db = await connection(); //await result of connection() and store the returned db
  const scenariosCollection = db.collection("scenarios");
  const scheduleCollection = db.collection("schedule");
  const scenarioScheduleCollection = db.collection("scenario_schedule");
  const bookingCollection = db.collection("booking");
  const customersCollection = db.collection("customers");
  const couponsCollection = db.collection("coupons");

  const combinedData = await scenarioScheduleCollection.aggregate([
    {
      $lookup: {
        from: "scenarios",
        localField: "scenario_id",
        foreignField: "_id",
        as: "scenario",
      },
    },
    { $unwind: "$scenario" },
    {
      $lookup: {
        from: "schedule",
        localField: "schedule_id",
        foreignField: "_id",
        as: "schedule",
      },
    },
    { $unwind: "$schedule" },
    {
      $lookup: {
        from: "booking",
        localField: "_id",
        foreignField: "scenario_schedule_id",
        as: "bookings",
      },
    },
    { $unwind: "$bookings" },
    {
      $lookup: {
        from: "customers",
        localField: "bookings.customer_id",
        foreignField: "_id",
        as: "customer",
      },
    },
    { $unwind: "$customer" },
    {
      $lookup: {
        from: "coupons",
        localField: "bookings.coupon_id",
        foreignField: "_id",
        as: "coupon",
      },
    },
    { $unwind: "$coupon" },
    {
      $addFields: {
        "schedule.date": {
          $dateToString: { format: "%Y-%m-%d", date: "$schedule.date" },
        },
        "schedule.time": {
          $dateToString: { format: "%H:%M", date: "$schedule.date" },
        },
      },
    },
    {
      $project: {
        _id: 1,
        scenario_id: 1,
        schedule_id: 1,
        "scenario.title": 1,
        "scenario.players": 1,
        "scenario.time": 1,
        "scenario.description": 1,
        "scenario.image": 1,
        "schedule.date": 1,
        "schedule.time": 1,
        "customer.firstname": 1,
        "customer.lastname": 1,
        "customer.email": 1,
        "coupon.title": 1,
        "coupon.discount": 1,
        bookings: 1,
      },
    },
  ]);

  // res.json(combinedData);
  // var results = db.collection("booking").find({}); //{} as the query means no filter, so select all
  res = await combinedData.toArray();
  return res;
}

/* Async function to retrieve id of  a booking from booking collection. */
async function getBookingDetail(id) {
  db = await connection(); //await result of connection() and store the returned db
  const reid = new ObjectId(id);
  const combinedData = await db
    .collection("booking")
    .aggregate([
      {
        $match: { _id: reid },
      },
      {
        $lookup: {
          from: "scenario_schedule",
          localField: "scenario_schedule_id",
          foreignField: "_id",
          as: "scenario_schedule",
        },
      },
      { $unwind: "$scenario_schedule" },
      {
        $lookup: {
          from: "scenarios",
          localField: "scenario_schedule.scenario_id",
          foreignField: "_id",
          as: "scenario",
        },
      },
      { $unwind: "$scenario" },
      {
        $lookup: {
          from: "schedule",
          localField: "scenario_schedule.schedule_id",
          foreignField: "_id",
          as: "schedule",
        },
      },
      { $unwind: "$schedule" },
      {
        $lookup: {
          from: "customers",
          localField: "customer_id",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },
      {
        $lookup: {
          from: "coupons",
          localField: "coupon_id",
          foreignField: "_id",
          as: "coupon",
        },
      },
      { $unwind: "$coupon" },
      {
        $addFields: {
          "schedule.date": {
            $dateToString: { format: "%Y-%m-%d", date: "$schedule.date" },
          },
          "schedule.time": {
            $dateToString: { format: "%H:%M", date: "$schedule.date" },
          },
        },
      },
      {
        $project: {
          _id: 1,
          "scenario.title": 1,
          "scenario.players": 1,
          "scenario.time": 1,
          "scenario.description": 1,
          "scenario.image": 1,
          "schedule.date": 1,
          "schedule.time": 1,
          "customer.firstname": 1,
          "customer.lastname": 1,
          "customer.email": 1,
          "coupon.title": 1,
          "coupon.discount": 1,
        },
      },
    ])
    .toArray();

  return combinedData;
}

/**END CUSTOMER DATA RETRIEVING */

/** ADMIN */

/* Async function to retrieve all schedules from schedule collection. */
async function getSchedule() {
  db = await connection(); //await result of connection() and store the returned db
  var results = db.collection("schedule").find({}); //{} as the query means no filter, so select all
  const modifiedData = results.map((item) => {
    const dateTime = new Date(item.date);
    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, "0");
    const day = String(dateTime.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    const hours = dateTime.getHours();
    const minutes = String(dateTime.getMinutes()).padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;

    return {
      _id: item._id,
      date: formattedDate, // Separate date
      time: formattedTime, // Separate time
      // Other fields from the scheduleData item
      // You can include them as needed
    };
  });
  res = await modifiedData.toArray();
  return res;
}

//Function to insert one schedule
async function addSchedule(schedule) {
  db = await connection();
  let status = await db.collection("schedule").insertOne(schedule);
  // console.log("schedule");
}
/**ENDING ADMIN DATA RETRIEVING */
