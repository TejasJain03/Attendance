const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const ExpressError = require("./middleware/ExpressError");
const GlobalErrorHandler = require("./middleware/GlobalErrorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const employeeRoutes = require("./routes/employeeRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const authRoutes = require("./routes/authRoutes");
const weeklyPayRoutes = require('./routes/weeklyPayRoutes')

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Mongo succesfully");
  } catch (err) {
    console.log("Error while connecting to database");
  }
};
connectDB();

const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.NODE_ENV === "production" ? process.env.REACT_APP_URL : "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", employeeRoutes);
app.use("/api", attendanceRoutes);
app.use("/api", authRoutes);
app.use("/api", weeklyPayRoutes);

app.use(cookieParser());

app.get("/", (req, res) => {
  res.json("Attendance Management");
});

app.all("*", (req, res, next) => {
  try {
    new ExpressError(404, false, "Page not found");
  } catch (error) {
    next(error);
  }
});

app.use(GlobalErrorHandler);

app.listen(PORT, () => {
  console.log("LISTENING TO THE PORT");
});
