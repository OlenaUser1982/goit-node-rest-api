import { User } from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import { sendMail } from "../helpers/sendMail.js";
import bcryptjs from "bcryptjs";
import JWT from "jsonwebtoken";
import { env } from "../configEnv.js";
import gravatar from "gravatar";
import path from "path";
import Jimp from "jimp";
import fs from "fs/promises";
import { nanoid } from "nanoid";

export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) throw HttpError(409, "Email in use");
    const hashPassword = await bcryptjs.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();
    const newUser = await User.create({
      email,
      password: hashPassword,
      avatarURL,
      verificationToken,
    });
    const verifyEmail = {
      to: email,
      subject: "Email verification",
      html: `<a href="${env.BASE_URL}/users/verify/${verificationToken}" target="_blank"> Click for verification</a>`,
    };
    await sendMail(verifyEmail);
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
    if (!user.verify) throw HttpError(401, "Users email not verify");
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
    await avatar.resize(250, 250).writeAsync(resultUpload);

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
export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      throw HttpError(404, "User not found");
    }
    await User.findOneAndUpdate(
      { verificationToken },
      { verify: true, verificationToken: null }
    );
    res.json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

export const resendVerifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(404, "User not found");
    }
    const { verificationToken, verify } = user;
    if (verify) throw HttpError(400, "Verification has already been passed");
    const verifyEmail = {
      to: email,
      subject: "Email verification",
      html: `<a href="${env.BASE_URL}/users/verify/${verificationToken}" target="_blank"> Click for verification</a>`,
    };
    await sendMail(verifyEmail);
    res.json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};
