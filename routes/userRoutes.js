import express from "express";
import UserController from "../controllers/userController.js";
import checkUserAuth from "../middlewares/auth_middleware.js";

const router = express.Router();

// Route Level Middleware - To Protect Route
router.use("/changepassword", checkUserAuth)

// Public Routes
router.post("/register", UserController.userRegistration);
router.post("/login", UserController.userLogin);

// Protected Routes
router.post("/changepassword", UserController.changePassword);

export default router;