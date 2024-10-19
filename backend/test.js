// this file is for testing a function only

require('dotenv').config();

const { GoogleAIFileManager } = require("@google/generative-ai/server");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const fileManager = new GoogleAIFileManager(process.env.API_KEY);

async function compareUserAIPoem() {
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
    A tabby cat sits in the sun,
    A golden glow, a day begun.
    He basks in warmth, a peaceful sight,
    As sunlight streaks paint shadows bright.

    A furry form, a sleepy sigh,
    He watches the world go drifting by.
    With eyes half closed, and whisker twitch,
    He relishes the golden stitch.

    The world outside, a blur of sound,
    He cares not, he's safe and profound.
    On his perch, a king he reigns,
    As sunlight dances, and morning reigns.

    Format your answer as a JSON object and nothing else. Ensure the JSON follows this exact structure:

    
    Format your answer as a JSON object and nothing else. Ensure the JSON follows this exact structure:

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

    Provide scores as numerical values between 1 and 10 (1 being poor, 10 being excellent). Only return the JSON response. No extra commentary. 
    `;
    
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const result = await model.generateContent([prompt]);
        const responseText = result.response.text();
        
        // Parse the JSON response from the AI
        const comparisonResult = JSON.parse(responseText);
        
        // Now you can access scores from the parsed JSON
        console.log("Poem 1 Scores:", comparisonResult.poem_1);
        console.log("Poem 2 Scores:", comparisonResult.poem_2);

        return comparisonResult;
    } catch (error) {
        console.error("An error occurred while comparing poems:", error);
        return null;
    }
}

compareUserAIPoem(); 