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


// -----------------------------------------------------
// js stuff: 

/* 

function getUserPoem() {
    poemContainer = document.getElementById("poem-input");
    poem = poemContainer.value;
    
    return poem; 
}

function getAIPoem() {
    code is above
}

function compareUserAIPoem(userPoem, AIPoem) {
    const prompt = `
    Compare the following poems and rate them from 1 to 10. Provide feedback for each poem.
    Poem 1 (User's Poem): 
    "${userPoem}"
    
    Poem 2 (AI's Poem): 
    "${AIPoem}"
    
    Which poem is better? Rate based off the following criteria: 
    creativity, originality, prose, personal meaning. Explain your choice.
    `;
    
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    return model.generateContent([prompt])
        .then(result => result.response.text())
        .catch(error => {
            console.error("An error occurred while comparing poems:", error);
            return null;
        });
}
*/ 

// -----------------------------------------------------
// server stuff:

/*
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

// Create the server
const server = http.createServer((req, res) => {
    res.statusCode = 200; // Set status code
    res.setHeader('Content-Type', 'text/plain'); // Set content type
    res.end('Hello, World!\n'); // Send response
});

// Listen on the specified port
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
*/