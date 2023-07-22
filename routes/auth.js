import express from "express";
import { createUser, loginUser } from "../controller/auth.js";

const router = express.Router();

router.post("/auth/signup", createUser);
router.post("/auth/login", loginUser);

export default router;
