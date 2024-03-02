import HttpError from "../helpers/HttpError.js";
import JWT from "jsonwebtoken";
import { env } from "../configEnv.js";
import { User } from "../models/user.js";
export const authenticate = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;
    const [Bearer, token] = authorization.split(" ");
    if (Bearer !== "Bearer" || !token) {
      next(HttpError(401, "Not authorizated "));
    }
    const { id } = JWT.verify(token, env.SECRET_KEY);
    const user = await User.findOne({ _id: id });
    if (!user || !user.token || user.token !== token) {
      next(HttpError(401, "Not authorizated "));
    }
    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, "Not authorizated "));
  }
};
