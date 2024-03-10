import multer from "multer";
import path from "path";

const tmpDir = path.resolve("../", "tmp");

export const upload = multer({
  storage: multer.diskStorage({
    destination: tmpDir,
    filename: (req, file, callback) => {
      callback(null, file.originalname);
    },
  }),
});
