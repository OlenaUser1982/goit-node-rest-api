import sgMail from "@sendgrid/mail";
import { env } from "../configEnv.js";

sgMail.setApiKey(env.SENDGRID_KEY);
export const sendMail = async (data) => {
  try {
    const email = { ...data, from: "ltdIloc@gmail.com" };
    await sgMail.send(email);
    return true;
  } catch (error) {
    console.log(error.message);
  }
};
