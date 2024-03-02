import express from "express";
import { registerUser } from "../controllers/usersControllers.js";
import { createUserSchema } from "../schemas/usersSchemas.js";
import validateBody from "../helpers/validateBody.js";
// import { isValidMongoID } from "../middlewares/isValidMongoID.js";

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(createUserSchema), registerUser);

export default usersRouter;
