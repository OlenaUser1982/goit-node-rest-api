import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
} from "../controllers/usersControllers.js";
import { createAndLoginUserSchema } from "../schemas/usersSchemas.js";
import validateBody from "../helpers/validateBody.js";
import { authenticate } from "../middlewares/authenticate.js";

const usersRouter = express.Router();

usersRouter.post(
  "/register",
  validateBody(createAndLoginUserSchema),
  registerUser
);
usersRouter.post("/login", validateBody(createAndLoginUserSchema), loginUser);
usersRouter.post("/logout", authenticate, logoutUser);
usersRouter.get("/current", authenticate, currentUser);
export default usersRouter;
