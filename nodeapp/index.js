const express = require("express");
const path = require("path"); // module to help with file path
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const QRCode = require("qrcode");
const fs = require("fs");
const parser = require("cookie-parser");
const sgMail = require("@sendgrid/mail");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { utcToZonedTime, format } = require("date-fns-tz");

dotenv.config(); // load local evironment variables from .env file.
const cors = require("cors"); //need this to set this API to allow requests from other servers
const { MongoClient, ObjectId } = require("mongodb");
const { timeStamp } = require("console");

const app = express();
const port = process.env.PORT || "3000";

const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}/paintball`;
const client = new MongoClient(dbUrl);
sgMail.setApiKey(process.env.API_KEY);

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

const qrCodesDir = path.join(__dirname, "qr_codes");
if (!fs.existsSync(qrCodesDir)) {
  fs.mkdirSync(qrCodesDir);
}

// Serve statis files from the qr_codes directory

app.use("/qr_codes", express.static(path.join(__dirname, "qr_codes")));

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.resolve(__dirname, "../../paintball/paintball-react/src/img")
    ); // Adjust path as needed
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    cb(null, `${uuidv4()}${extension}`); // Generate unique filename using uuidv4
  },
});

const upload = multer({ storage: storage });

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
  const membership = customer.membership;
  return response.json({
    status: true,
    customerId: customerId,
    customer: customer,
    membership: membership,
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
 * returns: an a staff detail
 */
app.get("/api/staff/:id", async (request, response) => {
  let staffId = request.params.id;
  let staff = await getStaffDetail(staffId);
  response.json(staff); //send JSON object with appropriate JSON headers
});

/**
 * Insert a staff
 */
/**insert new account information */
app.post("/staff/add", async (request, response) => {
  let { firstname, lastname, email, password, phone, address } = request.body;
  let create = new Date();
  let deleted = null;

  bcrypt.hash(password, 12).then((hash) => {
    let staffData = {
      firstname,
      lastname,
      email,
      password: hash,
      phone,
      address,
      created_at: create,
      deleted_at: deleted,
    };

    addStaff(staffData)
      .then(() => {
        response.json({
          status: "success",
          message: "Staff added successfully",
        });
      })
      .catch((error) => {
        response.json({
          status: "error",
          message: "Error adding staff",
          error,
        });
      });
  });
});

/**Staff PUT */

app.put("/admin/staff/edit/:id", async (request, response) => {
  const id = request.params.id;
  const { firstname, lastname, email, password, phone, address } = request.body;

  // Create an object with the customer data
  let editStaffData = {
    firstname,
    lastname,
    email,
    phone,
    address,
  };

  try {
    if (password) {
      // Hash the password only if it is provided in the request body
      const hash = await bcrypt.hash(password, 12);
      editStaffData.password = hash;
    }

    // Call EditCustomer with the customer data
    const result = await editStaff(id, editStaffData);

    response.status(result.status).json({
      status: result.status === 200 ? "success" : "error",
      message: result.message,
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    response.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

/**DELETE STAFF */

app.delete("/api/staff/delete/:id", async (request, response) => {
  //get staff id
  let id = request.params.id;
  const result = await deleteStaff(id);
  response.status(200).json({ message: "Staff deleted successfully" });
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

/**Scenario post */

app.post(
  "/admin/scenarios/add",
  upload.single("image"),
  async (request, response) => {
    try {
      const { title, players, time, description } = request.body;
      const image = request.file ? request.file.filename : null;

      // Add a scenario with necessary fields
      const result = await addScenario({
        title,
        players,
        time,
        description,
        image,
      });

      // Respond with the appropriate status and message
      response.status(result.status).json({
        status: result.status === 201 ? "success" : "error",
        message: result.message,
      });
    } catch (error) {
      console.error("Error creating scenario:", error); // Log error details
      response.status(500).json({
        status: "error",
        message: "An error occurred while creating the scenario",
      });
    }
  }
);

/**Scenario PUT */

app.put(
  "/admin/scenarios/edit/:id",
  upload.single("image"),
  async (request, response) => {
    try {
      const id = request.params.id;
      const { title, players, time, description } = request.body;
      const image = request.file ? request.file.filename : null;

      // Create an object with the scenario data
      const editScenarioData = {
        title,
        players: parseInt(players, 10),
        time: parseInt(time, 10),
        description,
      };

      // Only add image if it is uploaded
      if (image) {
        editScenarioData.image = image;
      }

      // Call EditScenario with the scenario data
      const result = await editScenario(id, editScenarioData);

      // Respond with the appropriate status and message
      response.status(result.status).json({
        status: result.status === 200 ? "success" : "error",
        message: result.message,
      });
    } catch (error) {
      console.error("Error updating scenario:", error); // Log error details
      response.status(500).json({
        status: "error",
        message: "An error occurred while updating the scenario",
      });
    }
  }
);

/**DELETE SCENARIO */

app.delete("/api/scenarios/delete/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const result = await deleteScenario(id);

    if (result.deletedCount === 1) {
      response.status(200).json({ message: "Scenario deleted successfully" });
    } else {
      response.status(404).json({ message: "Scenario not found" });
    }
  } catch (error) {
    console.error("Error deleting scenario:", error);
    response.status(500).json({ message: "Failed to delete scenario" });
  }
});

/**COUPON */

/*
 * returns: an array of coupons list
 */
app.get("/api/coupons", async (request, response) => {
  let coupons = await getCoupons();
  response.json(coupons); //send JSON object with appropriate JSON headers
});

/*
 * returns: an a coupon detail
 */
app.get("/api/coupon/:id", async (request, response) => {
  let couponId = request.params.id;
  let coupon = await getCouponDetail(couponId);
  response.json(coupon); //send JSON object with appropriate JSON headers
});

/**Coupon post */

app.post(
  "/admin/coupon/add",
  upload.single("image"),
  async (request, response) => {
    try {
      const { title, discount, code, start_date, end_date } = request.body;
      const image = request.file ? request.file.filename : null;

      // Add a coupon with necessary fields
      const result = await addCoupon({
        title,
        discount,
        code,
        image,
        start_date,
        end_date,
      });

      // Respond with the appropriate status and message
      response.status(result.status).json({
        status: result.status === 201 ? "success" : "error",
        message: result.message,
      });
    } catch (error) {
      console.error("Error creating coupon:", error); // Log error details
      response.status(500).json({
        status: "error",
        message: "An error occurred while creating the coupon",
      });
    }
  }
);

/**Coupon PUT */

app.put(
  "/admin/coupon/edit/:id",
  upload.single("image"),
  async (request, response) => {
    try {
      const id = request.params.id;
      const { title, discount, code, start_date, end_date } = request.body;
      const image = request.file ? request.file.filename : null;

      // Create an object with the coupon data
      const editCouponData = {
        title,
        discount,
        code,
        start_date,
        end_date,
      };

      // Only add image if it is uploaded
      if (image) {
        editCouponData.image = image;
      }

      // Call EditCoupon with the coupon data
      const result = await editCoupon(id, editCouponData);

      // Respond with the appropriate status and message
      response.status(result.status).json({
        status: result.status === 200 ? "success" : "error",
        message: result.message,
      });
    } catch (error) {
      console.error("Error updating coupon:", error); // Log error details
      response.status(500).json({
        status: "error",
        message: "An error occurred while updating the coupon",
      });
    }
  }
);

/**DELETE COUPON */

app.delete("/api/coupon/delete/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const result = await deleteCoupon(id);

    if (result.deletedCount === 1) {
      response.status(200).json({ message: "coupon deleted successfully" });
    } else {
      response.status(404).json({ message: "Coupon not found" });
    }
  } catch (error) {
    console.error("Error deleting coupon:", error);
    response.status(500).json({ message: "Failed to delete coupon" });
  }
});

/**END COUPON */

/**MEMBERSHIP */

/*
 * returns: an array of memberships list
 */
app.get("/api/memberships", async (request, response) => {
  let membership = await getMemberships();
  response.json(membership); //send JSON object with appropriate JSON headers
});

/*
 * returns: an a membership detail
 */
app.get("/api/membership/:id", async (request, response) => {
  let membershipId = request.params.id;
  let membership = await getMembershipDetail(membershipId);
  response.json(membership); //send JSON object with appropriate JSON headers
});

/**Membership post */

app.post(
  "/admin/membership/add",
  upload.single("image"),
  async (request, response) => {
    try {
      const { type } = request.body;
      const image = request.file ? request.file.filename : null;

      // Add a membership with necessary fields
      const result = await addMembership({
        type,
        image,
      });

      // Respond with the appropriate status and message
      response.status(result.status).json({
        status: result.status === 201 ? "success" : "error",
        message: result.message,
      });
    } catch (error) {
      console.error("Error creating membership:", error); // Log error details
      response.status(500).json({
        status: "error",
        message: "An error occurred while creating the membership",
      });
    }
  }
);

/**Membership PUT */

app.put(
  "/admin/membership/edit/:id",
  upload.single("image"),
  async (request, response) => {
    try {
      const id = request.params.id;
      const { type } = request.body;
      const image = request.file ? request.file.filename : null;

      // Create an object with the membership data
      const editMembershipData = {
        type,
      };

      // Only add image if it is uploaded
      if (image) {
        editMembershipData.image = image;
      }

      // Call EditMembership with the membership data
      const result = await editMembership(id, editMembershipData);

      // Respond with the appropriate status and message
      response.status(result.status).json({
        status: result.status === 200 ? "success" : "error",
        message: result.message,
      });
    } catch (error) {
      console.error("Error updating membership:", error); // Log error details
      response.status(500).json({
        status: "error",
        message: "An error occurred while updating the membership",
      });
    }
  }
);

/**DELETE MEMBERSHIP */

app.delete("/api/membership/delete/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const result = await deleteMembership(id);

    if (result.deletedCount === 1) {
      response.status(200).json({ message: "Membership deleted successfully" });
    } else {
      response.status(404).json({ message: "Membership not found" });
    }
  } catch (error) {
    console.error("Error deleting membership:", error);
    response.status(500).json({ message: "Failed to delete membership" });
  }
});

/**END MEMBERSHIP */

/**EQUIPMENT */

/*
 * returns: an array of equipment list
 */
app.get("/api/equipment", async (request, response) => {
  let equipment = await getEquipment();
  response.json(equipment); //send JSON object with appropriate JSON headers
});

/*
 * returns: an a equipment detail
 */
app.get("/api/equipment/:id", async (request, response) => {
  let equipmentId = request.params.id;
  let equipment = await getEquipmentDetail(equipmentId);
  response.json(equipment); //send JSON object with appropriate JSON headers
});

/**Equipment post */

app.post(
  "/admin/equipment/add",
  upload.single("image"),
  async (request, response) => {
    try {
      const { name, quantity, description } = request.body;
      const image = request.file ? request.file.filename : null;

      // Add a equipment with necessary fields
      const result = await addEquipment({
        name,
        quantity,
        description,
        image,
      });

      // Respond with the appropriate status and message
      response.status(result.status).json({
        status: result.status === 201 ? "success" : "error",
        message: result.message,
      });
    } catch (error) {
      console.error("Error creating equipment:", error); // Log error details
      response.status(500).json({
        status: "error",
        message: "An error occurred while creating the equipment",
      });
    }
  }
);

/**Coupon PUT */

app.put(
  "/admin/equipment/edit/:id",
  upload.single("image"),
  async (request, response) => {
    try {
      const id = request.params.id;
      const { name, quantity, description } = request.body;
      const image = request.file ? request.file.filename : null;

      // Create an object with the equipment data
      const editEquipmentData = {
        name,
        quantity,
        description,
      };

      // Only add image if it is uploaded
      if (image) {
        editEquipmentData.image = image;
      }

      // Call EditEquipment with the equipment data
      const result = await editEquipment(id, editEquipmentData);

      // Respond with the appropriate status and message
      response.status(result.status).json({
        status: result.status === 200 ? "success" : "error",
        message: result.message,
      });
    } catch (error) {
      console.error("Error updating equipment:", error); // Log error details
      response.status(500).json({
        status: "error",
        message: "An error occurred while updating the equipment",
      });
    }
  }
);

/**DELETE EQUIPMENT */

app.delete("/api/equipment/delete/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const result = await deleteEquipment(id);

    if (result.deletedCount === 1) {
      response.status(200).json({ message: "equipment deleted successfully" });
    } else {
      response.status(404).json({ message: "Equipment not found" });
    }
  } catch (error) {
    console.error("Error deleting equipment:", error);
    response.status(500).json({ message: "Failed to delete equipment" });
  }
});

/**END EQUIPMENT */

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
  try {
    let bookingId = request.params.id;
    let booking = await getBookingDetail(bookingId);
    // response.json(booking); //send JSON object with appropriate JSON headers
    if (!booking) {
      return response.status(404).json({ message: "Booking not found" });
    }

    response.json(booking);
  } catch (error) {
    console.error("Error fetching booking detail:", error);
    response.status(500).json({ message: "Internal server error" });
  }
});

// Fetch schedules for a specific scenario
app.get("/api/schedules/:id", async (req, res) => {
  const scenarioId = req.params.id;
  const scenarioSchedule = await getScenarioSchedule(scenarioId);
  res.json(scenarioSchedule);
});

//Fetch a specific scenario_schedule
app.get("/api/scenario_schedule/:id", async (req, res) => {
  const scenario_schedule_id = req.params.id;
  const scenarioSchedule = await getScenarioScheduleDetail(
    scenario_schedule_id
  );
  res.json(scenarioSchedule);
});

// Route handler to get available scenarios for a specific schedule
app.get("/admin/scenarioSchedule/available/:id", async (req, res) => {
  const scheduleId = req.params.id;
  try {
    const availableScenarios = await getAvailableScenarios(scheduleId);
    res.json({ scenarios: availableScenarios });
  } catch (error) {
    console.error("Error fetching available scenarios:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Add a scenario_Schedule

app.post("/admin/scenarioSchedule/add", async (request, response) => {
  const { scenario_id, schedule_id } = request.body; // Extract scenario_id and schedule_id from request body

  // Create new scenario_schedule object
  const create = new Date();

  const newScenarioSchedule = {
    scenario_id: new ObjectId(scenario_id), // Convert scenario_id to ObjectId
    schedule_id: new ObjectId(schedule_id), // Convert schedule_id to ObjectId
    created_at: create,
  };

  try {
    await addScenarioSchedule(newScenarioSchedule);
    response.json({
      status: "success",
      message: "Scenario added into a schedule successfully",
    });
  } catch (error) {
    response.status(500).json({
      status: "error",
      message: "Error adding a scenario into a schedule",
      error: error.message,
    });
  }
});

// Route handler to delete a scenario from a schedule
app.delete(
  "/admin/scenarioSchedule/:scheduleId/:scenarioId",
  async (req, res) => {
    const { scheduleId, scenarioId } = req.params;
    try {
      const result = await deleteScenarioSchedule(scheduleId, scenarioId);
      if (result.deletedCount === 0) {
        return res
          .status(404)
          .json({ message: "Scenario not found in schedule" });
      }
      res.json({ message: "Scenario removed from schedule successfully" });
    } catch (error) {
      console.error("Error removing scenario from schedule:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

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

    // Respond with the error
    if (result.status !== 201) {
      return response.status(result.status).json({
        status: "error",
        message: result.message,
      });
    }

    // Correctly extract the booking ID
    const bookingId = result.bookingId;

    // Generate a unique URL for the booking
    const bookingUrl = `http://localhost:5173/bookingInfor/${bookingId}`;

    // Create QR code for a new booking
    const bookingInfo = {
      id: bookingId,
      scenarioId,
      scheduleId,
      coupon,
      firstname,
      lastname,
      email,
      phone,
    };
    const bookingInfoToString = JSON.stringify(bookingInfo);

    const qrImagePath = path.join(qrCodesDir, `${bookingId}.png`);

    // Generate QR code
    await new Promise((resolve, reject) => {
      QRCode.toFile(qrImagePath, bookingUrl, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // Read QR code file as base64
    const qrCodeData = fs.readFileSync(qrImagePath, { encoding: "base64" });

    // Send email with QR code attached
    const emailData = {
      to: email,
      from: "hathaonhin@gmail.com",
      subject: "Epic Paintball Adventures Booking Information",
      text: "Thank you for your booking. Please find the QR code attached and show it for staff at Epic Paintball Advantures Center.",
      attachments: [
        {
          content: qrCodeData,
          filename: "booking_qr_code.png",
          type: "image/png",
          disposition: "attachment",
        },
      ],
    };

    try {
      await sgMail.send(emailData);
      // console.log("Email sent successfully");

      // Respond with booking information and QR code image path
      response.status(201).json({
        status: "success",
        message: result.message,
        booking: result,
        qrImagePath: `/qr_codes/${bookingId}.png`,
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError.message);
      response.status(500).json({
        status: "error",
        message: "An error occurred while sending the email",
      });
    }
  } catch (error) {
    console.error("An error occurred while creating the booking:", error); // Log the error
    response.status(500).json({
      status: "error",
      message: "An error occurred while creating the booking",
    });
  }
});

//ADMIN BOOKING POST
app.post("/admin/booking/add", async (request, response) => {
  try {
    const {
      scenarioId,
      scheduleId,
      coupon,
      firstname,
      lastname,
      email,
      phone,
    } = request.body;

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

    // Respond with the error
    if (result.status !== 201) {
      return response.status(result.status).json({
        status: "error",
        message: result.message,
      });
    }

    // Correctly extract the booking ID
    const bookingId = result.bookingId;

    // Generate a unique URL for the booking
    const bookingUrl = `http://localhost:5173/bookingInfor/${bookingId}`;

    // Create QR code for a new booking
    const bookingInfo = {
      id: bookingId,
      scenarioId,
      scheduleId,
      coupon,
      firstname,
      lastname,
      email,
      phone,
    };
    const bookingInfoToString = JSON.stringify(bookingInfo);

    const qrImagePath = path.join(qrCodesDir, `${bookingId}.png`);

    // Generate QR code
    await new Promise((resolve, reject) => {
      QRCode.toFile(qrImagePath, bookingUrl, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // Read QR code file as base64
    const qrCodeData = fs.readFileSync(qrImagePath, { encoding: "base64" });

    // Send email with QR code attached
    const emailData = {
      to: email,
      from: "hathaonhin@gmail.com",
      subject: "Epic Paintball Adventures Booking Information",
      text: "Thank you for your booking. Please find the QR code attached and show it for staff at Epic Paintball Advantures Center.",
      attachments: [
        {
          content: qrCodeData,
          filename: "booking_qr_code.png",
          type: "image/png",
          disposition: "attachment",
        },
      ],
    };

    try {
      await sgMail.send(emailData);
      // console.log("Email sent successfully");

      // Respond with booking information and QR code image path
      response.status(201).json({
        status: "success",
        message: result.message,
        booking: result,
        qrImagePath: `/qr_codes/${bookingId}.png`,
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError.message);
      response.status(500).json({
        status: "error",
        message: "An error occurred while sending the email",
      });
    }
  } catch (error) {
    console.error("An error occurred while creating the booking:", error); // Log the error
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

    // Respond with the error
    if (result.status !== 200) {
      return response.status(result.status).json({
        status: "error",
        message: result.message,
      });
    }

    const bookingUrl = `http://localhost:5173/bookingInfor/${id}`;
    const qrImagePath = path.join(__dirname, "qr_codes", `${id}.png`);

    await new Promise((resolve, reject) => {
      QRCode.toFile(qrImagePath, bookingUrl, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    const qrCodeData = fs.readFileSync(qrImagePath, { encoding: "base64" });

    const emailData = {
      to: email,
      from: "hathaonhin@gmail.com",
      subject: "Epic Paintball Adventures Booking Information",
      text: "Your booking information has been updated. Please find the QR code attached.",
      attachments: [
        {
          content: qrCodeData,
          filename: "booking_qr_code.png",
          type: "image/png",
          disposition: "attachment",
        },
      ],
    };

    try {
      await sgMail.send(emailData);
      // console.log("Email sent successfully");

      response.status(200).json({
        status: "success",
        message: result.message,
        booking: result.booking,
        qrImagePath: `/qr_codes/${id}.png`,
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError.message);
      response.status(500).json({
        status: "error",
        message: "An error occurred while sending the email",
      });
    }
  } catch (error) {
    console.error("An error occurred while editing the booking:", error);
    response.status(500).json({
      status: "error",
      message: "An error occurred while editing the booking",
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

/**
 * returns customers list
 */
app.get("/api/customers", async (request, response) => {
  let customers = await getCustomers();
  response.json(customers);
});

/*
 * returns: an a scenario detail
 */
app.get("/api/customer/:id", async (request, response) => {
  let customerId = request.params.id;
  let customer = await getCustomerDetail(customerId);
  // Send the customer ID along with the response
  const membership = customer.membership;
  return response.json({
    status: true,
    customerId: customerId,
    customer: customer,
    membership: membership,
    message: "authorized",
  });
});

/**
 * Insert a customer
 */
/**insert new account information */
app.post("/customer/add", async (request, response) => {
  let { firstname, lastname, email, password, phone, membershipId } =
    request.body;
  let create = new Date();

  bcrypt.hash(password, 12).then((hash) => {
    let customerData = {
      firstname,
      lastname,
      email,
      password: hash,
      phone,
      membership_id: membershipId || null,
      created_at: create,
    };

    account(customerData)
      .then(() => {
        response.json({
          status: "success",
          message: "Customer added successfully",
        });
      })
      .catch((error) => {
        response.json({
          status: "error",
          message: "Error adding customer",
          error,
        });
      });
  });
});

/**Customer PUT */

app.put("/customer/customer/edit/:id", async (request, response) => {
  const id = request.params.id;
  const { firstname, lastname, email, password, phone } = request.body;

  const current = await getCustomerDetail(id);
  // Create an object with the customer data
  let editCustomerData = {
    firstname,
    lastname,
    email,
    phone,
    membership_id: current.customer.membership_id,
  };
  try {
    if (password) {
      // Hash the password only if it is provided in the request body
      const hash = await bcrypt.hash(password, 12);
      editCustomerData.password = hash;
    }

    // Call EditCustomer with the customer data
    const result = await editCustomer(id, editCustomerData);

    response.status(result.status).json({
      status: result.status === 200 ? "success" : "error",
      message: result.message,
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    response.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

/**Customer PUT */

app.put("/admin/customer/edit/:id", async (request, response) => {
  const id = request.params.id;
  const { firstname, lastname, email, password, phone, membershipId } =
    request.body;

  // Create an object with the customer data
  let editCustomerData = {
    firstname,
    lastname,
    email,
    phone,
    membership_id: membershipId || null,
  };

  try {
    if (password) {
      // Hash the password only if it is provided in the request body
      const hash = await bcrypt.hash(password, 12);
      editCustomerData.password = hash;
    }

    // Call EditCustomer with the customer data
    const result = await editCustomer(id, editCustomerData);

    response.status(result.status).json({
      status: result.status === 200 ? "success" : "error",
      message: result.message,
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    response.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

/**DELETE BOOKING */

app.delete("/api/customer/delete/:id", async (request, response) => {
  //get customer id
  let id = request.params.id;
  const result = await deleteCustomer(id);
  response.status(200).json({ message: "Customer deleted successfully" });
});
/**ADMIN API */

//ADMIN FORM PROCESSING SCHEDULE

app.get("/api/schedule", async (request, response) => {
  let schedule = await getSchedule();
  response.json(schedule);
});

//Fetch a specific schedule
app.get("/api/schedule/:id", async (req, res) => {
  const schedule_id = req.params.id;
  const schedule = await getScheduleDetail(schedule_id);
  res.json(schedule);
});

app.post("/admin/schedule/add", async (request, response) => {
  let { date, time } = request.body;
  let create = new Date();
  let deleted = null;
  // Combine date and time into a single Date object
  const dateTimeString = `${date}T${time}`;
  const dateTime = new Date(dateTimeString);

  let newSchedule = {
    date: dateTime,
    created_at: create,
    deleted_at: deleted,
  };
  await addSchedule(newSchedule)
    .then(() => {
      response.json({
        status: "success",
        message: "Schedule added successfully",
      });
    })
    .catch((error) => {
      response.json({
        status: "error",
        message: "Error adding a schedule",
        error,
      });
    });
});

/**Schedule PUT */

app.put("/admin/schedule/edit/:id", async (request, response) => {
  const id = request.params.id;
  const { date, time } = request.body;

  try {
    // Combine date and time into a single Date object
    const dateTimeString = `${date}T${time}`;
    const dateTime = new Date(dateTimeString);
    const editScheduleData = {
      date: dateTime,
    };

    // Call editSchedule function to update the schedule in the database
    const result = await editSchedule(id, editScheduleData);

    // Respond with appropriate status and message
    response.status(result.status).json({
      status: result.status === 200 ? "success" : "error",
      message: result.message,
    });
  } catch (error) {
    console.error("Error updating schedule:", error);
    response.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

/**DELETE SCHEDULE */

app.delete("/api/schedule/delete/:id", async (request, response) => {
  //get schedule id
  let id = request.params.id;
  const result = await deleteSchedule(id);
  response.status(200).json({ message: "Schedule deleted successfully" });
});

//ENDING PROCESSING SCHEDULE

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

/**Async function to retrieve a staff detail from staff collection */

async function getStaffDetail(id) {
  db = await connection(); //await result of connection() and store the returned db
  var staffId = new ObjectId(id);
  const result = db.collection("staff").findOne({ _id: staffId });
  return result;
}

/* Async function to insert account information of a staff into staff collection. */

async function addStaff(staffData) {
  db = await connection(); //await result of connection() and store the returned db
  let staff = await db.collection("staff").insertOne(staffData);
}

/**Edit a staff */
async function editStaff(id, editStaffData) {
  try {
    const db = await connection();

    // Update staff data in the database
    const result = await db.collection("staff").updateOne(
      { _id: new ObjectId(id) }, // Filter for the staff ID
      { $set: { ...editStaffData, updated_at: new Date() } } // Update fields with new values
    );

    // Check if the update was successful
    if (result.modifiedCount === 0) {
      // No document was modified, so the staff ID might not exist
      return { status: 404, message: "Staff not found" };
    }
    const updatedStaff = await db.collection("staff").findOne({
      _id: new ObjectId(id),
    });

    // If the update was successful, return success message
    return {
      status: 200,
      message: "A Staff updated successfully",
      staff: updatedStaff,
    };
  } catch (error) {
    console.error("Error updating a staff:", error);
    return { status: 500, message: "Internal server error" };
  }
}

/**DELETE A STAFF */
async function deleteStaff(id) {
  const db = await connection(); // Ensure 'db' variable is declared
  const deleteId = { _id: new ObjectId(id) };

  try {
    const result = await db.collection("staff").deleteOne(deleteId);
    return result;
  } catch (error) {
    console.error("Error deleting a staff:", error);
    throw error; // Propagate the error back to the caller
  }
}

/**COUPON DATA */

/* Async function to retrieve all coupons from coupons collection. */
async function getCoupons() {
  db = await connection(); //await result of connection() and store the returned db
  var results = db.collection("coupons").find({}); //{} as the query means no filter, so select all
  res = await results.toArray();
  return res;
}

/* Async function to retrieve id of  a coupon from coupons collection. */
async function getCouponDetail(id) {
  db = await connection(); //await result of connection() and store the returned db
  const reid = new ObjectId(id);
  const result = db.collection("coupons").findOne({ _id: reid });
  return result;
}

//Function to insert one coupon
async function addCoupon({
  title,
  discount,
  code,
  image,
  start_date,
  end_date,
}) {
  try {
    const db = await connection();

    // Construct the coupon data object
    const couponData = {
      title,
      discount,
      code,
      image,
      start_date,
      end_date,
      created_at: new Date(),
    };

    // Insert the coupon data into the database
    const result = await db.collection("coupons").insertOne(couponData);

    // Check if insertion was successful
    if (result.acknowledged) {
      return { status: 201, message: "Coupon created successfully" };
    } else {
      return { status: 500, message: "Failed to create coupon" };
    }
  } catch (error) {
    console.error("Error adding coupon:", error);
    return { status: 500, message: "Internal server error" };
  }
}

/**Edit a coupon */
async function editCoupon(id, editCouponData) {
  try {
    const db = await connection();

    // Update coupon data in the database
    const result = await db.collection("coupons").updateOne(
      { _id: new ObjectId(id) }, // Filter for the coupon ID
      { $set: { ...editCouponData, updated_at: new Date() } } // Update fields with new values
    );

    // Check if the update was successful
    if (result.modifiedCount === 0) {
      // No document was modified, so the coupon ID might not exist
      return { status: 404, message: "Coupon not found" };
    }
    const updatedCoupon = await db.collection("coupons").findOne({
      _id: new ObjectId(id),
    });

    // If the update was successful, return success message
    return {
      status: 200,
      message: "Coupon updated successfully",
      coupon: updatedCoupon,
    };
  } catch (error) {
    console.error("Error updating coupon:", error);
    return { status: 500, message: "Internal server error" };
  }
}

/**DELETE A COUPON */
async function deleteCoupon(id) {
  const db = await connection(); // Ensure 'db' variable is declared
  const deleteId = { _id: new ObjectId(id) };

  try {
    const result = await db.collection("coupons").deleteOne(deleteId);
    return result;
  } catch (error) {
    console.error("Error deleting coupon:", error);
    throw error; // Propagate the error back to the caller
  }
}
/**ENDING COUPON DATA RETRIEVING */

/**MEMBERSHIP DATA */

/* Async function to retrieve all memberships from memberships collection. */
async function getMemberships() {
  db = await connection(); //await result of connection() and store the returned db
  var results = db.collection("memberships").find({}); //{} as the query means no filter, so select all
  res = await results.toArray();
  return res;
}

/* Async function to retrieve id of  a membership from memberships collection. */
async function getMembershipDetail(id) {
  db = await connection(); //await result of connection() and store the returned db
  const reid = new ObjectId(id);
  const result = db.collection("memberships").findOne({ _id: reid });
  return result;
}

//Function to insert one membership
async function addMembership({ type, image }) {
  try {
    const db = await connection();

    // Construct the membership data object
    const membershipData = {
      type,
      image,
      created_at: new Date(),
    };

    // Insert the membership data into the database
    const result = await db.collection("memberships").insertOne(membershipData);

    // Check if insertion was successful
    if (result.acknowledged) {
      return { status: 201, message: "Membership created successfully" };
    } else {
      return { status: 500, message: "Failed to create membership" };
    }
  } catch (error) {
    console.error("Error adding membership:", error);
    return { status: 500, message: "Internal server error" };
  }
}

/**Edit a membership */
async function editMembership(id, editMembershipData) {
  try {
    const db = await connection();

    // Update membership data in the database
    const result = await db.collection("memberships").updateOne(
      { _id: new ObjectId(id) }, // Filter for the membership ID
      { $set: { ...editMembershipData, updated_at: new Date() } } // Update fields with new values
    );

    // Check if the update was successful
    if (result.modifiedCount === 0) {
      // No document was modified, so the membership ID might not exist
      return { status: 404, message: "Membership not found" };
    }
    const updatedMembership = await db.collection("memberships").findOne({
      _id: new ObjectId(id),
    });

    // If the update was successful, return success message
    return {
      status: 200,
      message: "Coupon updated successfully",
      membership: updatedMembership,
    };
  } catch (error) {
    console.error("Error updating membership:", error);
    return { status: 500, message: "Internal server error" };
  }
}

/**DELETE A MEMBERSHIP */
async function deleteMembership(id) {
  const db = await connection(); // Ensure 'db' variable is declared
  const deleteId = { _id: new ObjectId(id) };

  try {
    const result = await db.collection("memberships").deleteOne(deleteId);
    return result;
  } catch (error) {
    console.error("Error deleting membership:", error);
    throw error; // Propagate the error back to the caller
  }
}
/**ENDING MEMBERSHIP DATA RETRIEVING */

/**EQUIPMENT DATA */

/* Async function to retrieve all equipment from equipment collection. */
async function getEquipment() {
  db = await connection(); //await result of connection() and store the returned db
  var results = db.collection("equipment").find({}); //{} as the query means no filter, so select all
  res = await results.toArray();
  return res;
}

/* Async function to retrieve id of  a equipment from equipment collection. */
async function getEquipmentDetail(id) {
  db = await connection(); //await result of connection() and store the returned db
  const reid = new ObjectId(id);
  const result = db.collection("equipment").findOne({ _id: reid });
  return result;
}

//Function to insert one equipment
async function addEquipment({ name, quantity, description, image }) {
  try {
    const db = await connection();

    // Construct the equipment data object
    const equipmentData = {
      name,
      quantity,
      description,
      image,
      created_at: new Date(),
    };

    // Insert the equipment data into the database
    const result = await db.collection("equipment").insertOne(equipmentData);

    // Check if insertion was successful
    if (result.acknowledged) {
      return { status: 201, message: "Equipment created successfully" };
    } else {
      return { status: 500, message: "Failed to create equipment" };
    }
  } catch (error) {
    console.error("Error adding equipment:", error);
    return { status: 500, message: "Internal server error" };
  }
}

/**Edit a equipment */
async function editEquipment(id, editEquipmentData) {
  try {
    const db = await connection();

    // Update equipment data in the database
    const result = await db.collection("equipment").updateOne(
      { _id: new ObjectId(id) }, // Filter for the equipment ID
      { $set: { ...editEquipmentData, updated_at: new Date() } } // Update fields with new values
    );

    // Check if the update was successful
    if (result.modifiedCount === 0) {
      // No document was modified, so the equipment ID might not exist
      return { status: 404, message: "Equipment not found" };
    }
    const updatedEquipment = await db.collection("equipment").findOne({
      _id: new ObjectId(id),
    });

    // If the update was successful, return success message
    return {
      status: 200,
      message: "Equipment updated successfully",
      equipment: updatedEquipment,
    };
  } catch (error) {
    console.error("Error updating equipment:", error);
    return { status: 500, message: "Internal server error" };
  }
}

/**DELETE A EQUIPMENT */
async function deleteEquipment(id) {
  const db = await connection(); // Ensure 'db' variable is declared
  const deleteId = { _id: new ObjectId(id) };

  try {
    const result = await db.collection("equipment").deleteOne(deleteId);
    return result;
  } catch (error) {
    console.error("Error deleting equipment:", error);
    throw error; // Propagate the error back to the caller
  }
}
/**ENDING EQUIPMENT DATA RETRIEVING */

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

//Function to insert one scenario
async function addScenario({ title, players, time, description, image }) {
  try {
    const db = await connection();

    // Construct the scenario data object
    const scenarioData = {
      title,
      players: parseInt(players, 10),
      time: parseInt(time, 10),
      description,
      image: image,
      created_at: new Date(),
    };

    // Insert the scenario data into the database
    const result = await db.collection("scenarios").insertOne(scenarioData);

    // Check if insertion was successful
    if (result.acknowledged) {
      return { status: 201, message: "Scenario created successfully" };
    } else {
      return { status: 500, message: "Failed to create scenario" };
    }
  } catch (error) {
    console.error("Error adding scenario:", error);
    return { status: 500, message: "Internal server error" };
  }
}

/**Edit a scenario */
async function editScenario(id, editScenarioData) {
  try {
    const db = await connection();

    // Update scenario data in the database
    const result = await db.collection("scenarios").updateOne(
      { _id: new ObjectId(id) }, // Filter for the scenario ID
      { $set: { ...editScenarioData, updated_at: new Date() } } // Update fields with new values
    );

    // Check if the update was successful
    if (result.modifiedCount === 0) {
      // No document was modified, so the scenario ID might not exist
      return { status: 404, message: "Scenario not found" };
    }
    const updatedScenario = await db.collection("scenarios").findOne({
      _id: new ObjectId(id),
    });

    // If the update was successful, return success message
    return {
      status: 200,
      message: "Scenario updated successfully",
      scenario: updatedScenario,
    };
  } catch (error) {
    console.error("Error updating scenario:", error);
    return { status: 500, message: "Internal server error" };
  }
}

/**DELETE A SCENARIO */
async function deleteScenario(id) {
  const db = await connection(); // Ensure 'db' variable is declared
  const deleteId = { _id: new ObjectId(id) };

  try {
    const result = await db.collection("scenarios").deleteOne(deleteId);
    return result;
  } catch (error) {
    console.error("Error deleting scenario:", error);
    throw error; // Propagate the error back to the caller
  }
}

/* Async function to insert account information of a customer into customers collection. */

async function account(customerData) {
  db = await connection(); //await result of connection() and store the returned db
  let status = await db.collection("customers").insertOne(customerData);
  // console.log("customer added");
}

/* Async function to retrieve a signed in customer from customer collection. */
async function getCustomerDetail(id) {
  const db = await connection(); // Await result of connection() and store the returned db
  const customerId = new ObjectId(id);
  const customer = await db
    .collection("customers")
    .findOne({ _id: customerId });

  //fetch membership Id from customer collection
  const membershipId = customer.membership_id;

  // fetch data from membership collection

  const membership = await db
    .collection("memberships")
    .findOne({ _id: new ObjectId(membershipId) });

  const result = {
    customer,
    membership,
  };
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

/**CUSTOMER RETRIEVING */

/* Async function to retrieve all customers from customers collection. */
async function getCustomers() {
  db = await connection(); //await result of connection() and store the returned db
  var results = db.collection("customers").find({}); //{} as the query means no filter, so select all
  res = await results.toArray();
  return res;
}

/**Async function to retrieve a customer detail from customer collection */

// async function getCustomerDetail(id) {
//   db = await connection(); //await result of connection() and store the returned db
//   var customerId = new ObjectId(id);
//   const result = db.collection("customers").findOne({ _id: customerId });
//   return result;
// }

/**Edit a customer */
async function editCustomer(id, editCustomerData) {
  try {
    const db = await connection();

    // Update customer data in the database
    const result = await db.collection("customers").updateOne(
      { _id: new ObjectId(id) }, // Filter for the customer ID
      { $set: { ...editCustomerData, updated_at: new Date() } } // Update fields with new values
    );

    // Check if the update was successful
    if (result.modifiedCount === 0) {
      // No document was modified, so the customer ID might not exist
      return { status: 404, message: "Customer not found" };
    }
    const updatedCustomer = await db.collection("customers").findOne({
      _id: new ObjectId(id),
    });

    // If the update was successful, return success message
    return {
      status: 200,
      message: "A Customer updated successfully",
      customer: updatedCustomer,
    };
  } catch (error) {
    console.error("Error updating a customer:", error);
    return { status: 500, message: "Internal server error" };
  }
}

/**DELETE A CUSTOMER */
async function deleteCustomer(id) {
  const db = await connection(); // Ensure 'db' variable is declared
  const deleteId = { _id: new ObjectId(id) };

  try {
    const result = await db.collection("customers").deleteOne(deleteId);
    return result;
  } catch (error) {
    console.error("Error deleting a customer:", error);
    throw error; // Propagate the error back to the caller
  }
}

/**ENDING CUSTOMER RETRIEVING */

/**BOOKING RETRIEVING */

/**Async functuon to retrieve all bookings of a customer */
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

    // console.log(bookingResult.insertedId);
    // console.log(bookingResult.acknowledged);
    if (bookingResult.acknowledged) {
      return {
        status: 201,
        message: "Booking created successfully",
        bookingId: bookingResult.insertedId,
      };
    } else {
      return {
        status: 500,
        message: "Failed to create booking",
      };
    }
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
    const updatedBooking = await db.collection("booking").findOne({
      _id: new ObjectId(id),
    });

    // If the update was successful, return success message
    return {
      status: 200,
      message: "Booking updated successfully",
      booking: updatedBooking,
    };
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

/**END BOOKING DATA RETRIEVING */

/** ADMIN */

/**SCHEDULE DATA RETRIEVING */
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

// Function to get a schedule detail from schedule collection
async function getScheduleDetail(id) {
  const db = await connection(); // Assuming connection() returns the MongoDB client
  const scheid = new ObjectId(id);

  try {
    const scenarioSchedule = [
      { $match: { _id: scheid } },
      {
        $lookup: {
          from: "scenario_schedule",
          let: { schedule_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$schedule_id", "$$schedule_id"] },
              },
            },
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
              $project: {
                scenario_id: 1,
                schedule_id: 1,
                scenario: {
                  title: 1,
                  players: 1,
                  time: 1,
                  description: 1,
                  image: 1,
                  created_at: 1,
                  deleted_at: 1,
                },
                created_at: 1,
                deleted_at: 1,
              },
            },
          ],
          as: "scenarios",
        },
      },
      {
        $project: {
          _id: 1,
          date: {
            $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$date" },
          },
          created_at: 1,
          deleted_at: 1,
          scenarios: 1,
        },
      },
    ];

    const result = await db
      .collection("schedule")
      .aggregate(scenarioSchedule)
      .toArray();

    if (result.length === 0) {
      return null; // Handle case where no schedule is found with the given id
    }

    // Format the retrieved document
    const formattedSchedule = {
      _id: result[0]._id,
      date: result[0].date,
      created_at: result[0].created_at,
      deleted_at: result[0].deleted_at,
      scenarios: result[0].scenarios,
    };

    return formattedSchedule;
  } catch (error) {
    console.error("Error fetching schedule detail:", error);
    return null; // Return null to indicate an error
  }
  // try {
  //   const result = await db.collection("schedule").findOne({ _id: scheid }); // Await findOne operation
  //   if (!result) {
  //     // Handle case where no schedule is found with the given id
  //     return null;
  //   }
  //   // Modify the retrieved document
  //   const dateTime = new Date(result.date);
  //   const year = dateTime.getFullYear();
  //   const month = String(dateTime.getMonth() + 1).padStart(2, "0");
  //   const day = String(dateTime.getDate()).padStart(2, "0");
  //   const formattedDate = `${year}-${month}-${day}`;
  //   const hours = dateTime.getHours();
  //   const minutes = String(dateTime.getMinutes()).padStart(2, "0");
  //   const formattedTime = `${hours}:${minutes}`;

  //   // Return the modified schedule data
  //   return {
  //     _id: result._id,
  //     date: formattedDate, // Separate date
  //     time: formattedTime, // Separate time
  //     // Other fields from the result item
  //     // You can include them as needed
  //   };
  // } catch (error) {
  //   // Handle any errors that occur during the database operation
  //   console.error("Error fetching schedule detail:", error);
  //   return null; // Return null to indicate an error
  // }
}

//Function to insert one schedule
async function addSchedule(schedule) {
  db = await connection();
  let status = await db.collection("schedule").insertOne(schedule);
}

// Function to update a schedule
async function editSchedule(id, editScheduleData) {
  try {
    const db = await connection();

    // Update schedule data in the database
    const result = await db.collection("schedule").updateOne(
      { _id: new ObjectId(id) }, // Filter for the schedule ID
      { $set: { ...editScheduleData, updated_at: new Date() } } // Update fields with new values
    );

    // Check if the update was successful
    if (result.modifiedCount === 0) {
      // No document was modified, so the schedule ID might not exist
      return { status: 404, message: "Schedule not found" };
    }
    const updatedSchedule = await db.collection("schedule").findOne({
      _id: new ObjectId(id),
    });

    // If the update was successful, return success message
    return {
      status: 200,
      message: "A Schedule updated successfully",
      schedule: updatedSchedule,
    };
  } catch (error) {
    console.error("Error updating a schedule:", error);
    return { status: 500, message: "Internal server error" };
  }
}

/**DELETE A SCHEDULE */
async function deleteSchedule(id) {
  const db = await connection(); // Ensure 'db' variable is declared
  const deleteId = { _id: new ObjectId(id) };

  try {
    const result = await db.collection("schedule").deleteOne(deleteId);
    return result;
  } catch (error) {
    console.error("Error deleting a schedule:", error);
    throw error; // Propagate the error back to the caller
  }
}

/**ENDING SCHEDULE RETRIEVING */

/**SCENARIO_SCHEDULE DATA RETRIEVING */

// get a scenario_schedule detail
/* Async function to retrieve id of  a scenario from scenarios collection. */
async function getScenarioScheduleDetail(id) {
  db = await connection(); //await result of connection() and store the returned db
  const reid = new ObjectId(id);
  const result = db.collection("scenario_schedule").findOne({ _id: reid });
  return result;
}

// Function to get available scenarios
async function getAvailableScenarios(schedule_id) {
  const db = await connection();
  const scheduleObjectId = new ObjectId(schedule_id);

  const allScenarios = await db.collection("scenarios").find({}).toArray();
  const associatedScenarios = await db
    .collection("scenario_schedule")
    .find({ schedule_id: scheduleObjectId })
    .toArray();

  const associatedScenarioIds = associatedScenarios.map((sc) =>
    sc.scenario_id.toString()
  );
  const availableScenarios = allScenarios.filter(
    (sc) => !associatedScenarioIds.includes(sc._id.toString())
  );

  return availableScenarios;
}

//Function to insert one scenario_schedule
async function addScenarioSchedule(scen_sche) {
  db = await connection();
  let status = await db.collection("scenario_schedule").insertOne(scen_sche);
}

/**DELETE A SCENARIO SCHEDULE */
async function deleteScenarioSchedule(scheduleId, scenarioId) {
  const db = await connection();
  const scheduleObjectId = new ObjectId(scheduleId);
  const scenarioObjectId = new ObjectId(scenarioId);

  try {
    const result = await db.collection("scenario_schedule").deleteOne({
      schedule_id: scheduleObjectId,
      scenario_id: scenarioObjectId,
    });

    return result;
  } catch (error) {
    console.error("Error deleting scenario from schedule:", error);
    throw error; // Rethrow the error for centralized error handling
  }
}

/**ENDING ADMIN DATA RETRIEVING */
