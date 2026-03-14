import "dotenv/config";
import path from "path";
import express from "express";
import cors from "cors";
import corsOptions from "./config/corsOptions";
import { logEvents, logger } from "./middleware/logEvents";
import errorHandler from "./middleware/errorHandler";
import verifyJWT from "./middleware/verifyJWT";
import cookieParser from "cookie-parser";
import credentials from "./middleware/credentials";
import mongoose from "mongoose";
import connectDB from "./config/dbConn";
import { Request, Response } from "express";
import RootRouter from "./routes/root";
import RegisterRouter from "./routes/register";
import AuthRouter from "./routes/auth";
import RefreshRouter from "./routes/refresh";
import LogoutRouter from "./routes/logout";
import UsersRouter from "./routes/api/users";
import EmployeesRouter from "./routes/api/employees";
const app = express();
const PORT = process.env.PORT || 3500;

//Connect to MongoDB

connectDB();
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

app.use("/", RootRouter);
app.use("/register", RegisterRouter);
app.use("/auth", AuthRouter);
app.use("/refresh", RefreshRouter);
app.use("/logout", LogoutRouter);

app.use(verifyJWT);
app.use("/users", UsersRouter);
app.use("/employees", EmployeesRouter);

//app.use('/')
app.all(/.*/, (req: Request, res: Response) => {
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

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
