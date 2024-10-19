require('dotenv').config();

const { GoogleAIFileManager } = require("@google/generative-ai/server");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const fileManager = new GoogleAIFileManager(process.env.API_KEY);

// generates poem 
async function generatePoem() { // generatePoem(mood) 
  try {
    const uploadResult = await fileManager.uploadFile(
      `../assets/image_1.png`, // `../assets/${mood}/image_${rand}.png`
      {
        mimeType: "image/png",    
        displayName: "Inspiration for Poetry", 
      },
    );

    /* unncecessary code that prints something when file is uploaded
    console.log(
      `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`,
    );
    */ 

    // initializes the api 
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // sends a request for the api 
    const result = await model.generateContent([
      "Write a poem inspired by this image.",
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);

    const res = result.response.text(); 
    // prints ai prompt into console
    // console.log(res); 
    return res; 
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function compareUserAIPoem(difficulty) {
  const AIPoem = await generatePoem(); 
  
  const prompt = `
  Compare these two poems. 

  Poem 1:
    A cat sits in the light, 
    sun scattered from the window, 
    staring deep into the horizon. 

    He sits like a burrito bun, 
    sitting like there's no fun, 
    as if he's done. 

    In the somber afternoon, 
    in the cold June, 
    he waits for the moon.

  Poem 2: 
    ${AIPoem}

    Format your answer strictly as a JSON object with no code blocks, no extra text, and no explanations. Use this exact structure:

    {
      "poem_1": {
        "creativity": <score>,
        "originality": <score>,
        "prose": <score>,
        "personal_meaning": <score>,
        "overall": <score>
      },
      "poem_2": {
        "creativity": <score>,
        "originality": <score>,
        "prose": <score>,
        "personal_meaning": <score>,
        "overall": <score>
      }
    }

    Scores should be numerical values between 1 and 10. Only return this JSON object, and nothing else.
  `;
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const jsonResponse = JSON.parse(result.response.text());
    return jsonResponse; 
  } catch (error) {
    console.error("An error occurred:", error);
    return null;
  }
}

function formatPoemComparison(data) {
  let formatted = "\nComparison of Poem Scores:\n\n";

  formatted += "Poem 1:\n";
  formatted += `  Creativity: ${data.poem_1.creativity}\n`;
  formatted += `  Originality: ${data.poem_1.originality}\n`;
  formatted += `  Prose: ${data.poem_1.prose}\n`;
  formatted += `  Personal Meaning: ${data.poem_1.personal_meaning}\n`;
  formatted += `  Overall: ${data.poem_1.overall}\n`;

  formatted += "\nPoem 2:\n";
  formatted += `  Creativity: ${data.poem_2.creativity}\n`;
  formatted += `  Originality: ${data.poem_2.originality}\n`;
  formatted += `  Prose: ${data.poem_2.prose}\n`;
  formatted += `  Personal Meaning: ${data.poem_2.personal_meaning}\n`;
  formatted += `  Overall: ${data.poem_2.overall}\n`;

  return formatted;
}

module.exports = {
  generatePoem,
  compareUserAIPoem,
  formatPoemComparison
};