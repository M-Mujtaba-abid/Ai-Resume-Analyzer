import multer from "multer";
import fs from "fs";
import os from "os";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use a writable directory in both local + Vercel.
    // Vercel serverless filesystem is ephemeral, so /tmp is the safest option.
    const uploadDir =
      process.env.UPLOAD_DIR || path.join(os.tmpdir(), "uploads");

    // Ensure directory exists before multer tries to write the file.
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files allowed"));
    }
    cb(null, true);
  },
});