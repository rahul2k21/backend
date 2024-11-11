const { Router } = require("express");
const getUsers = require("../controller/userController.js"); 
const { isAdmin } = require("../utils/authMiddleware.js");

const usersRouter = Router();
usersRouter.get("/", isAdmin, getUsers); 
module.exports = usersRouter;
