require('dotenv').config();

const { GoogleAIFileManager } = require("@google/generative-ai/server");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const fileManager = new GoogleAIFileManager(process.env.API_KEY);

async function generatePoem() {
  try {
    const uploadResult = await fileManager.uploadFile(
      `assets/image_1.png`, 
      {
        mimeType: "image/png",    
        displayName: "Inspiration for Poetry", 
      },
    );

    console.log(
      `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`,
    );

    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      "Write a poem inspired by this image.",
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);

    console.log(result.response.text());
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

generatePoem();