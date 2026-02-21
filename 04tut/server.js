require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logEvents, logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3500;
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");

// custom middleware logger

app.use(logger);

//Handle options credentials

app.use(credentials);

// stands for cross origin resource sharing

app.use(cors(corsOptions));

//built in middleware for handling urlencoded form data

app.use(express.urlencoded({ extended: false }));

//built-in middleware for json

app.use(express.json());

//middleware for cookies

app.use(cookieParser());
//serve static files

app.use("/", express.static(path.join(__dirname, "public")));

//routes

app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use(verifyJWT);
app.use("/employees", require("./routes/api/employees"));

//app.use('/')
app.all(/.*/, (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
