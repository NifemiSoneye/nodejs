import express from "express";
import { handleNewUser } from "../controllers/registerController";
const router = express.Router();

console.log("Register route file loaded!");

router.post("/", handleNewUser);

export default router;
