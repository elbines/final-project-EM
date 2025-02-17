import express from "express";
import { authenticateAdmin } from "../middleware/authenticateAdmin"; // Import middleware to add for protection
import {
    registerAdminController,
    loginAdminController,
    listUsersController, // List of all users
    upgradeUserController // Upgrade user to admin
} from "../controllers/adminController";



// Create an instance of the Express router
const router = express.Router();

// REGISTER ROUTE: Handle admin registration
router.post("/register", authenticateAdmin, registerAdminController);
// (removed authenticateAdmin when creating the first admin)

// LOGIN ROUTE: Handle admin login
router.post("/login", loginAdminController);

// Route for a list of all users - STILL NEED TO FIND WHAT THIS IS FOR
router.get("/users", authenticateAdmin, listUsersController);

// New route for upgrading a user to an admin
router.post("/upgradeUser", authenticateAdmin, upgradeUserController);

// Export the router for use in the main application
export default router;

// In summary, this file sets up routes using the Express router for user registration and login operations. In addition it has routes to retrieve all users and upgrade user to admin. It associates each route with the corresponding controller function. These routes define the API endpoints for handling user registration and login within the application.