import HttpError from "../helpers/HttpError.js";
import { isValidObjectId } from "mongoose";
export const isValidMongoID = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    next(HttpError(400, "Invalid id"));
  }
  next();
};
