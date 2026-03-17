import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config({ override: true });

// console.log("Loaded GROQ KEY:", process.env.GROQ_API_KEY);
// console.log("ENV PATH:", process.cwd());
// console.log("ENV KEY:", process.env.GROQ_API_KEY);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default groq;