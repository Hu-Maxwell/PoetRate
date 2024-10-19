require('dotenv').config();

const { GoogleAIFileManager } = require("@google/generative-ai/server");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const fileManager = new GoogleAIFileManager(process.env.API_KEY);

async function generateRandomImage(mood) {
  const rand = Math.floor(Math.random() * 2); 
  const uploadResult = await fileManager.uploadFile(
    `../assets/${mood}/image_${rand}.png`,
    {
      mimeType: "image/png",    
      displayName: "Inspiration for Poetry", 
    },
  );

  return uploadResult; 
}

/* function to read user's poem after button click
function getUserPoem() {
  const userPoemContainer = document.getElementById("userpoeminput"); 
  return userPoemContainer.value;
}
*/ 

// generates poem 
async function generatePoem() { 
  try {
    const uploadResult = await generateRandomImage("happy"); // placeholder mood

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
    return res; 
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function compareUserAIPoem() { // compareUserAIPoem(difficulty)
  const AIPoem = await generatePoem(); 
  
  // currently a placeholder user poem until frontend implements input box 
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

// this part is client-side, should not be in here
// global variables
let userWins = 0; 
let AIWins = 0; 
let ties = 0; 
let winRate = 0.0; 

// update saveData so that it's saved even after reload
function saveDataToFile(data) {
  if (data.poem_1.overall > data.poem_2.overall) {
    userWins++; 
  } 
  else if (data.poem_1.overall < data.poem_2.overall) {
    AIWins++; 
  } else {
    ties++; 
  }
  
  const totalGames = userWins + AIWins + ties; 
  winRate = userWins / totalGames; 

  const stats = {
    userWins,
    AIWins,
    ties,
    winRate
  };

  // Write stats to a file
  fs.writeFileSync('poetry-stats.json', JSON.stringify(stats));
}

async function displayFormattedData() {
  const data = await compareUserAIPoem(); 
  const formattedData = formatPoemComparison(data); 
  
  console.log(formattedData);
}

displayFormattedData(); 

module.exports = {
  generatePoem,
  compareUserAIPoem,
  formatPoemComparison,
  saveDataToFile, 
  displayFormattedData
};