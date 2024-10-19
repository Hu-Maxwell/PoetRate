// this file is for testing a function only
require('dotenv').config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// "${userPoem}"
// "${AIPoem}"

async function compareUserAIPoem(difficulty) {
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
      const result = await model.generateContent(prompt);
      const jsonResponse = JSON.parse(result.response.text());
      return jsonResponse; 
    } catch (error) {
      console.error("An error occurred:", error);
      return null;
    }
}

module.exports = {
  compareUserAIPoem
};