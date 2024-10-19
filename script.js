// Make sure to include these imports:
/*
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const fileManager = new GoogleAIFileManager(process.env.API_KEY);

const uploadResult = await fileManager.uploadFile(
    `${mediaPath}/image_1.png`, 
    {
      mimeType: "image/png",    
      displayName: "Inspiration for Poetry", 
    },
  );

// View the response.
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
*/ 



// js stuff: 
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