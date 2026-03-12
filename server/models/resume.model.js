import mongoose, { Schema } from "mongoose";

const resumeSchema = new Schema(
{
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  jobTitle: {
    type: String,
    default: "Untitled Resume",
  },

  fileName: {
    type: String,
    required: true,
  },

  fileUrl: {
    type: String,
    required: true,
  },

  fileSize: Number,

  fileType: {
    type: String,
    enum: ["pdf", "docx"],
  },

  rawText: {
    type: String,
    required: true,
  },

  jobDescription: String,

  analysis: {
    atsScore: { type: Number, default: 0 },
    suggestions: [String],
    keywordsMissing: [String],

    parsedData: {
      skills: [String],
      experience: String,
      education: String,
    },
  },

  aiModel: {
    type: String,
    default: "gpt-4",
  },

  status: {
    type: String,
    enum: ["processing", "completed", "failed"],
    default: "processing",
  },
},
{ timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);