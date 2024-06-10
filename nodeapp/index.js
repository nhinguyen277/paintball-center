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
        const token = jwt.sign(
          { email: user.email, id: user._id },
          process.env.KEY,
          {
            expiresIn: "1h",
          }
        );
        response.cookie("token", token, { maxAge: 3600000 });
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

// ADMIN SIGN IN

app.post("/admin", async (request, response) => {
  let email = request.body.email;
  let pass = request.body.password;
  let admin = await getAdmin(email);
  if (admin) {
    bcrypt.compare(pass, admin.password, (err, res) => {
      if (res) {
        const token = jwt.sign({ email: admin.email }, process.env.KEY, {
          expiresIn: "3h",
        });
        response.cookie("token", token, {
          maxAge: 10800000,
        });
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
    request.user = decoded; // Attach the decoded token payload to the request object
    next();
  } catch (err) {
    console.error("Verification error:", err.message);
    return response.json({
      status: false,
      message: "unauthorized",
      error: err.message,
    });
  }
};

app.get("/verify", verifyUser, (request, response) => {
  return response.json({ status: true, message: "authorized" });
});
app.get("/verifyCustomer", verifyUser, async (request, response) => {
  // Assuming the customer ID is stored in the request object after verification
  const customerId = request.user.id; // Adjust this based on your implementation
  const customer = await getCustomerDetail(customerId);
  // Send the customer ID along with the response
  return response.json({
    status: true,
    customerId: customerId,
    customer: customer,
    message: "authorized",
  });
});

// app.get("/customer/:id", verifyUser, async (request, response) => {
//   try {
//     const customerId = request.params.id;
//     const customer = await getCustomerDetail(customerId);
//     if (customer) {
//       response.json({ status: true, data: customer });
//     } else {
//       response.json({ status: false, message: "Customer not found" });
//     }
//   } catch (err) {
//     console.error("Error fetching customer data:", err.message);
//     response.json({
//       status: false,
//       message: "Error fetching customer data",
//       error: err.message,
//     });
//   }
// });

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

// Fetch schedules for a specific scenario
app.get("/api/schedules/:id", async (req, res) => {
  const scenarioId = req.params.id;
  const scenarioSchedule = await getScenarioSchedule(scenarioId);
  res.json(scenarioSchedule);
});

// CUSTOMER BOOKING LIST
/*
 * returns: an a customer booking list
 */
app.get("/api/customer/booking/:id", async (request, response) => {
  let customerId = request.params.id;
  let customerBooking = await getCustomerBooking(customerId);
  response.json(customerBooking); //send JSON object with appropriate JSON headers
});

// ADD A BOOKING
//Customer booking POST
app.post("/customer/booking/add", async (request, response) => {
  try {
    let { scenarioId, scheduleId, coupon, firstname, lastname, email, phone } =
      request.body;

    // Call addBooking with necessary fields
    const result = await addBooking({
      scenarioId,
      scheduleId,
      coupon,
      firstname,
      lastname,
      email,
      phone,
    });

    // Respond with the appropriate status and message
    response.status(result.status).json({
      status: result.status === 201 ? "success" : "error",
      message: result.message,
    });
  } catch (error) {
    // Catch any errors and respond with a 500 status
    response.status(500).json({
      status: "error",
      message: "An error occurred while creating the booking",
    });
  }
});

//ADMIN BOOKING POST
app.post("/admin/booking/add", async (request, response) => {
  try {
    let { scenarioId, scheduleId, coupon, firstname, lastname, email, phone } =
      request.body;

    // Call addBooking with necessary fields
    const result = await addBooking({
      scenarioId,
      scheduleId,
      coupon,
      firstname,
      lastname,
      email,
      phone,
    });

    // Respond with the appropriate status and message
    response.status(result.status).json({
      status: result.status === 201 ? "success" : "error",
      message: result.message,
    });
  } catch (error) {
    // Catch any errors and respond with a 500 status
    response.status(500).json({
      status: "error",
      message: "An error occurred while creating the booking",
    });
  }
});

/**FETCH A SINGLE BOOKING TO EDIT */
app.put("/admin/booking/edit/:id", async (request, response) => {
  try {
    const id = request.params.id;
    let { scenarioId, scheduleId, coupon, firstname, lastname, email, phone } =
      request.body;

    // Call addBooking with necessary fields
    const result = await EditBooking(id, {
      scenarioId,
      scheduleId,
      coupon,
      firstname,
      lastname,
      email,
      phone,
    });

    // Respond with the appropriate status and message
    response.status(result.status).json({
      status: result.status === 201 ? "success" : "error",
      message: result.message,
    });
  } catch (error) {
    // Catch any errors and respond with a 500 status
    response.status(500).json({
      status: "error",
      message: "An error occurred while editting the booking",
    });
  }
});

/**DELETE BOOKING */

app.delete("/api/booking/delete/:id", async (request, response) => {
  //get booking id
  let id = request.params.id;
  const result = await deleteBooking(id);
  response.status(200).json({ message: "Booking deleted successfully" });
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

/* Async function to retrieve a signed in customer from customer collection. */
async function getCustomerDetail(id) {
  const db = await connection(); // Await result of connection() and store the returned db
  const customerId = new ObjectId(id);
  const result = await db.collection("customers").findOne({ _id: customerId });
  return result;
}

/* Async function to retrieve email, password of a customer from customers collection. */
async function getAccount(email) {
  db = await connection(); //await result of connection() and store the returned db
  const user = { email: email };
  // const pass = { password: password };
  const result = db.collection("customers").findOne(user);
  return result;
}

/**Async finctuon to retrieve all bookings of a customer */
async function getCustomerBooking(id) {
  db = await connection(); // await result of connection() and store the returned db
  const customerId = new ObjectId(id);

  const combinedData = await db
    .collection("booking")
    .aggregate([
      {
        $match: { customer_id: customerId },
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
      { $unwind: { path: "$coupon", preserveNullAndEmptyArrays: true } },
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
          "scenario._id": 1,
          "scenario.title": 1,
          "scenario.players": 1,
          "scenario.time": 1,
          "scenario.description": 1,
          "scenario.image": 1,
          "schedule.date": 1,
          "schedule.time": 1,
          "schedule._id": 1,
          "customer.firstname": 1,
          "customer.lastname": 1,
          "customer.email": 1,
          "customer.phone": 1,
          "coupon.title": 1,
          "coupon.code": 1,
          "coupon.discount": 1,
        },
      },
    ])
    .toArray();

  return combinedData;
}

/**END OF CUSTOMER DATA */

// GET DATA FROM ADMIN
/* Async function to retrieve email, password of a customer from customers collection. */
async function getAdmin(email) {
  db = await connection(); //await result of connection() and store the returned db
  const admin = { email: email };
  const result = db.collection("admin").findOne(admin);
  return result;
}

async function getBooking() {
  db = await connection(); // await result of connection() and store the returned db
  const bookingCollection = db.collection("booking");

  const combinedData = await bookingCollection.aggregate([
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
        from: "coupons",
        localField: "coupon_id",
        foreignField: "_id",
        as: "coupon",
      },
    },
    { $unwind: { path: "$coupon", preserveNullAndEmptyArrays: true } },
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
        customer_id: 1,
        coupon_id: 1,
        coupon_code: 1,
        "scenario.title": 1,
        // "scenario.players": 1,
        // "scenario.time": 1,
        // "scenario.description": 1,
        // "scenario.image": 1,
        "schedule.date": 1,
        "schedule.time": 1,
        "customer.firstname": 1,
        "customer.lastname": 1,
        "customer.email": 1,
        "coupon.title": 1,
        "coupon.discount": 1,
        scenario_schedule: 1,
      },
    },
  ]);

  const res = await combinedData.toArray();
  // console.log("Fetched bookings:", res); // Log the data
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
      { $unwind: { path: "$coupon", preserveNullAndEmptyArrays: true } },
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
          "scenario._id": 1,
          "scenario.title": 1,
          "scenario.players": 1,
          "scenario.time": 1,
          "scenario.description": 1,
          "scenario.image": 1,
          "schedule.date": 1,
          "schedule.time": 1,
          "schedule._id": 1,
          "customer.firstname": 1,
          "customer.lastname": 1,
          "customer.email": 1,
          "customer.phone": 1,
          "coupon.title": 1,
          "coupon.code": 1,
          "coupon.discount": 1,
        },
      },
    ])
    .toArray();

  return combinedData;
}

// Fetch schedules for a specific scenario for booking
async function getScenarioSchedule(id) {
  db = await connection(); //await result of connection() and store the returned db
  const reid = new ObjectId(id);
  const schedules = await db
    .collection("scenario_schedule")
    .aggregate([
      { $match: { scenario_id: reid } },
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
        $project: {
          _id: "$schedule._id",
          date: {
            $dateToString: {
              format: "%Y-%m-%d %H:%M",
              date: "$schedule.date",
            },
          },
        },
      },
    ])
    .toArray();
  return schedules;
}

//Function to insert one booking
async function addBooking(newBooking) {
  try {
    db = await connection();

    // Extract necessary fields from newBooking
    const {
      scenarioId,
      scheduleId,
      coupon,
      email,
      firstname,
      lastname,
      phone,
    } = newBooking;

    // Find or create customer
    let customer = await db.collection("customers").findOne({ email: email });
    if (!customer) {
      // If customer doesn't exist, create a new one
      const { firstname, lastname, phone } = newBooking;
      const hashedPass = await bcrypt.hash(phone, 12);
      const result = await db.collection("customers").insertOne({
        firstname,
        lastname,
        email,
        phone,
        password: hashedPass, // set password = phone number
        created_at: new Date(),
        deleted_at: null,
      });
      customer = await db
        .collection("customers")
        .findOne({ _id: result.insertedId });
    }

    // Find scenario, schedule, and scenario_schedule
    const sceid = new ObjectId(scenarioId);
    const scheid = new ObjectId(scheduleId);
    const scenario = await db.collection("scenarios").findOne({ _id: sceid });
    const schedule = await db.collection("schedule").findOne({ _id: scheid });
    const scenario_schedule = await db
      .collection("scenario_schedule")
      .findOne({ scenario_id: sceid, schedule_id: scheid });

    // Find coupon if provided
    let coupon_id = null;
    if (coupon) {
      const couponCode = await db
        .collection("coupons")
        .findOne({ code: coupon });
      if (!couponCode) {
        return { status: 400, message: "Invalid coupon code" };
      }
      coupon_id = couponCode._id;
    }

    // Create booking object
    const bookingData = {
      customer_id: customer._id,
      scenario_schedule_id: scenario_schedule._id,
      coupon_id: coupon_id,
      created_at: new Date(),
      deleted_at: null,
    };

    // Insert booking data into the database
    const bookingResult = await db.collection("booking").insertOne(bookingData);

    return { status: 201, message: "Booking created successfully" };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { status: 500, message: "Internal server error" };
  }
}

/**EDIT A BOOKING */
async function EditBooking(id, editedBooking) {
  try {
    const db = await connection();

    // Extract necessary fields from editedBooking
    const {
      scenarioId,
      scheduleId,
      coupon,
      email,
      firstname,
      lastname,
      phone,
    } = editedBooking;

    // Find or create customer
    let customer = await db.collection("customers").findOne({ email: email });
    if (!customer) {
      // If customer doesn't exist, create a new one
      const { firstname, lastname, phone } = editedBooking;
      const result = await db.collection("customers").insertOne({
        firstname,
        lastname,
        email,
        phone,
        created_at: new Date(),
        deleted_at: null,
      });
      customer = await db
        .collection("customers")
        .findOne({ _id: result.insertedId });
    }

    // Find scenario, schedule, and scenario_schedule
    const sceid = new ObjectId(scenarioId);
    const scheid = new ObjectId(scheduleId);
    const scenario = await db.collection("scenarios").findOne({ _id: sceid });
    const schedule = await db.collection("schedule").findOne({ _id: scheid });
    const scenario_schedule = await db
      .collection("scenario_schedule")
      .findOne({ scenario_id: sceid, schedule_id: scheid });

    // Find coupon if provided
    let coupon_id = null;
    if (coupon) {
      const couponCode = await db
        .collection("coupons")
        .findOne({ code: coupon });
      if (!couponCode) {
        return { status: 400, message: "Invalid coupon code" };
      }
      coupon_id = couponCode._id;
    }

    // Update booking object
    const bookingData = {
      customer_id: customer._id,
      scenario_schedule_id: scenario_schedule._id,
      coupon_id: coupon_id,
      updated_at: new Date(), // Update the updated_at timestamp
    };

    // Update booking data in the database
    const result = await db.collection("booking").updateOne(
      { _id: new ObjectId(id) }, // Filter for the booking ID
      { $set: bookingData } // Update fields with new values
    );

    // Check if the update was successful
    if (result.modifiedCount === 0) {
      // No document was modified, so the booking ID might not exist
      return { status: 404, message: "Booking not found" };
    }

    // If the update was successful, return success message
    return { status: 200, message: "Booking updated successfully" };
  } catch (error) {
    console.error("Error updating booking:", error);
    return { status: 500, message: "Internal server error" };
  }
}
/**DELETE A BOOKING */
async function deleteBooking(id) {
  db = await connection(); //await result of connection() and store the returned db
  const deleteId = { _id: new ObjectId(id) };
  const result = await db.collection("booking").deleteOne(deleteId);
  // if (result.deletedCount == 1) console.log("delete successful");
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
