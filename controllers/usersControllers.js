import { User } from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import bcryptjs from "bcryptjs";
import JWT from "jsonwebtoken";
import { env } from "../configEnv.js";
import gravatar from "gravatar";
import path from "path";
import Jimp from "jimp";
import fs from "fs/promises";

export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) throw HttpError(409, "Email in use");
    const hashPassword = await bcryptjs.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const newUser = await User.create({
      email,
      password: hashPassword,
      avatarURL,
    });

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
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) throw HttpError(401, "Email or password is wrong");

    const passwordCompare = await bcryptjs.compare(password, user.password);

    if (!passwordCompare) throw HttpError(401, "Email or password is wrong");
    const token = JWT.sign({ id: user._id }, env.SECRET_KEY, {
      expiresIn: "7d",
    });
    await User.findByIdAndUpdate(user._id, { token });

    res.json({
      token,
      user: {
        email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const logoutUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });

    res.status(204).json();
  } catch (error) {
    next(error);
  }
};
export const currentUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);

    res.json({ email: user.email, subscription: user.subscription });
  } catch (error) {
    next(error);
  }
};
export const updateUsersAvatar = async (req, res, next) => {
  try {
    const { path: tmpUpload, originalname } = req.file;
    const { _id, email } = req.user;
    const fileName = `${email}_${originalname}`;
    const avatarDir = path.resolve("public", "avatars");

    const resultUpload = path.join(avatarDir, fileName);
    const avatar = await Jimp.read(tmpUpload);
    avatar.resize(250, 250).write(resultUpload);
    console.log(tmpUpload, resultUpload);

    fs.rename(tmpUpload, resultUpload);

    const avatarURL = path.join("avatars", fileName);

    await User.findOneAndUpdate({ _id }, { avatarURL });

    res.json({
      avatarURL,
    });
  } catch (error) {
    next(error);
  }
};
