require('dotenv').config();

const fs = require('fs');
const path = require('path'); 

const { GoogleAIFileManager } = require("@google/generative-ai/server");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const fileManager = new GoogleAIFileManager(process.env.API_KEY);

function selectRandomImage() {
  const mood = "happy"; 
  const totalImages = 2; 

  const rand = Math.floor(Math.random() * totalImages);
  const imagePath = `assets/${mood}/image_${rand}.png`; 

  return imagePath;
}

// generates poem 
async function generatePoem(imagePath) { 
  try {
    const fsImagePath = path.join(__dirname, '..', 'frontend', imagePath);
    console.log('fsImagePath:', fsImagePath);

    if (!fs.existsSync(fsImagePath)) {
      throw new Error(`File not found at path: ${fsImagePath}`);
    }

    const uploadResult = await fileManager.uploadFile(
        fsImagePath,
        {
            mimeType: "image/png",    
            displayName: "Inspiration for Poetry", 
        },
    );

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

async function compareUserAIPoem(userPoem, imagePath) { // compareUserAIPoem(difficulty)
  const AIPoem = await generatePoem(imagePath);
  
  const prompt = `
  Compare these two poems. 

  Poem 1:
    ${userPoem}

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

  fs.writeFileSync('poetry-stats.json', JSON.stringify(stats));
}

// test function
async function displayFormattedData() {
  const data = await compareUserAIPoem(); 
  const formattedData = formatPoemComparison(data); 
  
  console.log(formattedData);
}

module.exports = {
  generatePoem,
  compareUserAIPoem,
  formatPoemComparison,
  saveDataToFile, 
  displayFormattedData,
  selectRandomImage
};