import express from "express";
import { analyzeResume, getAnalysisResult, uploadResume } from "../controllers/resume.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/upload", verifyJWT, upload.single("resume"), uploadResume);
router.post("/atsAnalyzer", verifyJWT , analyzeResume);
router.get("/getAnalysisResult/:resumeId", verifyJWT , getAnalysisResult);



export default router;
