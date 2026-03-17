import fs from "fs/promises";

import cloudinary from "../config/cloudinary.js";
import Resume from "../models/resume.model.js";
import pdf from "pdf-parse-fork"; // <--- Yeh import add karein

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import ApiError from "../utils/apiErorr.js";
import { atsAnalyzer } from "../services/atsAnalyzer.service.js";
import { analyzeResumeWithAI } from "../services/aiAnalyzer.service.js";
import User from "../models/user.model.js";

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
    const cleanText = rawText.replace(/\s+/g, " ").substring(0, 8000);

    if (!cleanText) {
      throw new ApiError(
        400,
        "PDF text extract nahi ho saka. File check karein.",
      );
    }

    // 4. Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "image",
      format: "pdf", // Explicitly batayein ke ye PDF hai
      type: "upload",
      access_mode: "public",
    });

    // 5. Save to Database
    const resume = await Resume.create({
      owner: req.user._id,
      fileName: file.originalname,
      fileUrl: result.secure_url,
      fileSize: file.size,
      fileType: "pdf",
      rawText: cleanText,
      jobTitle: req.body.jobTitle || "Untitled Resume",
      status: "processing",
    });

    // Response bhejna
    return res
      .status(201)
      .json(new ApiResponse(201, resume, "Resume uploaded successfully"));
  } catch (error) {
    console.error("Error during upload/parse:", error);
    throw new ApiError(error.statusCode || 500, error.message);
  } finally {
    // 6. Cleanup (Always delete local file)
    // Check if file exists then delete
    try {
      await fs.unlink(file.path);
      console.log("Temp file deleted successfully", file.originalname);
    } catch (unlinkError) {
      console.error("File delete nahi ho saki:", unlinkError.message);
    }
  }
});

export const analyzeResume = asyncHandler(async (req, res) => {
  const { resumeId, jobDescription } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  // 2. Limit Check (Free Tier ke liye)
  // Agar plan "free" hai aur count limit se zyada hai
  if (user.plan === "free" && user.analysisCount >= user.maxLimit) {
    return res
      .status(403)
      .json(
        new ApiResponse(
          403,
          { upgradeRequired: true },
          "Monthly limit reached. Please upgrade to Silver or Gold plan.",
        ),
      );
    // Frontend par aap is 403 status code ko dekh kar Stripe payment page par redirect kar sakte hain
  }

  if (!resumeId || !jobDescription) {
    throw new ApiError(400, "Resume ID and Job Description are required");
  }

  const resume = await Resume.findById(resumeId);
  if (!resume) throw new ApiError(404, "Resume not found");

  // AI Analysis call
  const aiResult = await analyzeResumeWithAI(resume.rawText, jobDescription);

  // --- HYBRID SCORING LOGIC START ---
  const candidateSkills = aiResult.parsedData.skills || [];
  const requiredSkills = aiResult.missingSkills.concat(candidateSkills); // Total required skills

  // Calculate manual match
  const matched = candidateSkills.filter((skill) =>
    requiredSkills.some((reqS) => reqS.toLowerCase() === skill.toLowerCase()),
  );

  const manualScore =
    requiredSkills.length > 0
      ? (matched.length / requiredSkills.length) * 100
      : 0;

  // Final Score: AI intuition + Hard Math logic
  // Agar AI ne 90 diya aur manual 40 nikla, to score balance ho jayega
  let finalScore = Math.round(aiResult.atsScore * 0.6 + manualScore * 0.4);
  // --- HYBRID SCORING LOGIC END ---

  // MAPPING: Data ko sahi keys mein save karein
  resume.analysis = {
    atsScore: aiResult.atsScore,
    summary: aiResult.summary,
    suggestions: aiResult.recommendations, // AI se recommendations aa raha hai
    keywordsMissing: aiResult.missingSkills,
    interviewQuestions: {
      technical: aiResult.interviewQuestions.technical,
      behavioral: aiResult.interviewQuestions.behavioral,
    },
    parsedData: {
      // Basic Info (Sahi keys ke sath)
      name: aiResult.parsedData.name,
      email: aiResult.parsedData.email,
      phoneNumber: aiResult.parsedData.phoneNumber,

      // Education & Location
      education: aiResult.parsedData.education,
      university: aiResult.parsedData.university,
      home_town: aiResult.parsedData.home_town,

      // Professional Details
      skills: aiResult.parsedData.skills || [],
      experience: aiResult.parsedData.experience,
      fyp: aiResult.parsedData.fyp,
      certifications: aiResult.parsedData.certifications || [],

      // Agar aapko 'interest' alag se chahiye to:
      interest: aiResult.parsedData.interest,
    },
  };

  resume.jobDescription = jobDescription;
  resume.status = "completed";

  await resume.save();

  await User.findByIdAndUpdate(userId, {
    $inc: { analysisCount: 1 },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, resume, "AI Resume Analysis Completed"));
});

// Naya function add karein
export const getAnalysisResult = asyncHandler(async (req, res) => {
  const { resumeId } = req.params; // URL se ID uthayega

  if (!resumeId) {
    throw new ApiError(400, "Resume ID is required");
  }

  const resume = await Resume.findById(resumeId);

  if (!resume) {
    throw new ApiError(404, "Analysis result not found");
  }

  // Check karein ke analysis complete hai ya nahi
  if (resume.status !== "completed") {
    throw new ApiError(400, "Analysis is still in progress or failed");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, resume, "Analysis result fetched successfully"));
});

// POST /resume/analyze/:id
// export const analyzeResume = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { jobDescription } = req.body;

//   if (!jobDescription) throw new ApiError(400, "Job description is required");

//   const resume = await Resume.findById(id);
//   if (!resume) throw new ApiError(404, "Resume not found");

//   // Run ATS Analysis
//   const analysisResult = atsAnalyzer(resume.rawText, jobDescription);

//   // Update Resume document
//   resume.analysis.atsScore = analysisResult.atsScore;
// resume.analysis.keywordsMissing = analysisResult.keywordsMissing;
// resume.analysis.suggestions = analysisResult.suggestions;

//   resume.status = "completed";
//   await resume.save();

//   return res
//     .status(200)
//     .json(new ApiResponse(200, resume, "Resume analyzed successfully"));
// });
