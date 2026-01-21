const logEvents = require("./logEvents");

const EventEmitter = require("events");

class MyEmmiter extends EventEmitter {}

//initialize object

const myEmmiter = new MyEmmiter();

// add listener for log event

myEmmiter.on("log", (msg) => logEvents(msg));

setTimeout(() => {
  //Emit event
  myEmmiter.emit("log", "Log Event emmited");
}, 2000);
