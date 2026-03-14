import express from "express";
import registerController from "../controllers/registerController";
const router = express.Router();

console.log("Register route file loaded!");

router.post("/", registerController.handleNewUser);

export default router;
