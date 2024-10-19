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

function compareUserAIPoem() {
    let userPoem = getUserPoem(); 
    let AIPoem = getAIPoem(); 
    
    prompt = "Compare the following poems. Poem 1: \n" + userPoem "\n Poem 2: \n" + AIPoem; 

    do ai api stuff
    return the results
}

*/ 
// get input from webpage 
// concatenate the input from gemini and user into one string, prompting it to rate it 
// display it onto the frontend 



// server stuff:

/*
// Import the http module
const http = require('http');

// Define the hostname and port
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