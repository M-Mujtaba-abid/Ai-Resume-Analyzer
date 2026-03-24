// export const atsAnalyzer = (resumeText, jobDescription) => {

// const stopwords = [
// "the","is","at","which","on","for","a","an","and","to","in","of","with","looking"
// ];

// const skillsDB = [
// "javascript","react","node","mongodb","express",
// "redux","typescript","nextjs","sql","docker","nest.js","next.js","postgres","sql","react query","tanstack",
// ];

// const resumeWords = resumeText.toLowerCase().split(/\W+/);

// const jdWords = jobDescription
// .toLowerCase()
// .split(/\W+/)
// .filter(word => !stopwords.includes(word))
// .filter(word => word.length > 3);

// const jdSkills = jdWords.filter(word => skillsDB.includes(word));

// const matchedSkills = jdSkills.filter(skill => resumeWords.includes(skill));

// const missingSkills = jdSkills.filter(skill => !resumeWords.includes(skill));

// const atsScore = Math.round((matchedSkills.length / jdSkills.length) * 100);

// const suggestions = [];

// if(missingSkills.length > 0){
// suggestions.push(`Add these skills: ${missingSkills.join(", ")}`)
// }

// if(atsScore < 50){
// suggestions.push("Resume is poorly optimized for this job")
// }

// return {
// atsScore,
// keywordsMissing: missingSkills,
// suggestions
// }

// };