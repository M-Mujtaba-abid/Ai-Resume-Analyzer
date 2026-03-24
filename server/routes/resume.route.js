import express from "express";
import { analyzeResume, getAllUserAnalyses, getAnalysisResult, uploadResume } from "../controllers/resume.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { checkAnalysisLimit } from "../middleware/checkAnalysisLimit.js";

const router = express.Router();

router.post("/upload", verifyJWT, upload.single("resume"), uploadResume);
router.post("/atsAnalyzer",  verifyJWT ,checkAnalysisLimit, analyzeResume);
router.get("/getAnalysisResult/:resumeId", verifyJWT , getAnalysisResult);
router.get("/getAllUserAnalyses", verifyJWT, getAllUserAnalyses);


export default router;
