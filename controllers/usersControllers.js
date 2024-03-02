import { User } from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import bcryptjs from "bcryptjs";
export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) return HttpError(409, "Email in use");
    const hashPassword = await bcryptjs.hash(password, 10);
    const newUser = await User.create({ email, password: hashPassword });

    res.status(201).json({
      user: {
        email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};
