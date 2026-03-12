import fs from "fs/promises"; 
import fsSync from "fs";
import cloudinary from "../config/cloudinary.js";
import Resume from "../models/resume.model.js";
import pdf from "pdf-parse-fork"; // <--- Yeh import add karein

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import ApiError from "../utils/apiErorr.js";

export const uploadResume = asyncHandler(async (req, res) => {
  const file = req.file;

  if (!file) {
    throw new ApiError(400, "Resume PDF file is required");
  }

  try {
    // 1. Parallel Task (Optional but Fast): 
    // Hum file read aur Cloudinary upload aik saath bhi shuru kar sakte hain
    // Lekin sequence behtar hai takay error jaldi pakra jaye
    
    // 2. Read file buffer (Non-blocking)
    const buffer = await fs.readFile(file.path);

    // 3. Parse PDF
    const data = await pdf(buffer);
    const rawText = data?.text?.trim();

    if (!rawText) {
      throw new ApiError(400, "PDF text extract nahi ho saka. File check karein.");
    }

    // 4. Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "raw",
      folder: "resumes",
    });

    // 5. Save to Database
    const resume = await Resume.create({
      owner: req.user._id,
      fileName: file.originalname,
      fileUrl: result.secure_url,
      fileSize: file.size,
      fileType: "pdf",
      rawText,
      jobTitle: req.body.jobTitle || "Untitled Resume",
      status: "processing",
    });

    // Response bhejna
    return res.status(201).json(
      new ApiResponse(201, resume, "Resume uploaded successfully")
    );

  } catch (error) {
    console.error("Error during upload/parse:", error);
    throw new ApiError(error.statusCode || 500, error.message);
    
  } finally {
    // 6. Cleanup (Always delete local file)
    // Check if file exists then delete
    try {
      await fs.unlink(file.path);
      console.log("Temp file deleted successfully" ,file.originalname );
    } catch (unlinkError) {
      console.error("File delete nahi ho saki:" ,  unlinkError.message);
    }
  }
});