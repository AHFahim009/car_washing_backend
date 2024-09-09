// middlewares/multer.ts

import multer from "multer";
import path from "path";
import fs from "fs";

// Define storage location and filename format
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "./uploads"; // Define the folder where files will be stored

    fs.mkdirSync(uploadPath, { recursive: true }); // Ensure the folder exists
    cb(null, uploadPath); // Store files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

export default upload;
