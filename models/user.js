import { model, Schema } from "mongoose";
import { handleMongooseError } from "../helpers/handleMongooseError.js";
const usersSchema = new Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: String,
});
usersSchema.post("save", handleMongooseError);
export const User = model("user", usersSchema);
