import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  updateUsersAvatar,
} from "../controllers/usersControllers.js";
import { createAndLoginUserSchema } from "../schemas/usersSchemas.js";
import validateBody from "../helpers/validateBody.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/upload.js";

const usersRouter = express.Router();

usersRouter.post(
  "/register",
  validateBody(createAndLoginUserSchema),
  registerUser
);
usersRouter.post("/login", validateBody(createAndLoginUserSchema), loginUser);
usersRouter.post("/logout", authenticate, logoutUser);
usersRouter.get("/current", authenticate, currentUser);
usersRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  updateUsersAvatar
);
export default usersRouter;
