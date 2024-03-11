import dotenv from "dotenv";
import path from "path";
const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });
const { SECRET_KEY, SENDGRID_KEY, BASE_URL } = process.env;
export const env = { SECRET_KEY, SENDGRID_KEY, BASE_URL };
