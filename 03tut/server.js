const http = require("http");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;

const logEvents = require("./logEvents");

const EventEmitter = require("events");

class Emmiter extends EventEmitter {}

//initialize object

const myEmmiter = new Emmiter();
const PORT = process.env.PORT || 3500;
const server = http.createServer((req, res) => {
  console.log(req.url, req.method);

  const extension = path.extname(req.url);

  let contentType;

  switch (extension) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".jpg":
      contentType = "image/jpeg";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".txt":
      contentType = "text/plain";
      break;
    default:
      contentType = "text/html";
  }

  let filePath =
    contentType === "text/html" && req.url === "/"
      ? path.join(__dirname, "views", "index.html")
      : contentType === "text.html" && req.url.slice(-1) === "/"
        ? path.join(__dirname, "views", req.url, "index.html")
        : contentType === "text/html"
          ? path.join(__dirname, "views", req.url)
          : path.join(__dirname, req.url);

  /*   let filePath; */

  /* if (req.url === "/" || req.url === "index.html") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    path = path.join(__dirname, "views", "index.html");
    fs.readFile(path, "utf-8", (err, data) => {
      res.end(data);
    });
  } */

  /*   switch (req.url) {
    case "/":
      res.statusCode = 200;
      path = path.join(__dirname, "views", "index.html");
      fs.readFile(path, "utf-8", (err, data) => {
        res.end(data);
      });
      break;
  } */
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

/* myEmmiter.on("log", (msg) => logEvents(msg));



  myEmmiter.emit("log", "Log Event emmited"); */
