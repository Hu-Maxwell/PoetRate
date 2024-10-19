const fs = require('fs');
const path = require('path'); 

const { compareUserAIPoem } = require('./script'); 
const { formatPoemComparison } = require('./script'); 

function serveStaticFile(res, filePath, contentType) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.statusCode = 500;
            res.end("An error occurred while loading the file.");
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', contentType);
            res.end(data);
        }
    });
}

function createServer() {
    const http = require('http');

    const hostname = '127.0.0.1';
    const port = 3000;

    const server = http.createServer(async (req, res) => {
        if (req.url === '/' && req.method === 'GET') {
            // serve index.html
            const indexHtml = path.join(__dirname, '../frontend/index.html');
            serveStaticFile(res, indexHtml, 'text/html');

        } else if (req.url === '/style.css' && req.method === 'GET') {
            // serve style.css
            const indexStyle = path.join(__dirname, '../frontend/style.css');
            serveStaticFile(res, indexStyle, 'text/css');

        } else if (req.url === '/start.html' && req.method === 'GET') {
            // serve start.html 
            const startHtml = path.join(__dirname, '../frontend/start.html');
            serveStaticFile(res, startHtml, 'text/html');

        } else if (req.url === '/start.css' && req.method === 'GET') {
            // serve start.css
            const startStyle = path.join(__dirname, '../frontend/start.css');
            serveStaticFile(res, startStyle, 'text/css');
            
        } else if (req.url === '/sunflower.jpg' && req.method === 'GET') {
            // serve the sunflower image
            const sunflowerImage = path.join(__dirname, '../frontend/sunflower.jpg');
            serveStaticFile(res, sunflowerImage, 'image/jpg');
            
        } else if (req.url === '/start.js' && req.method === 'GET') {
            const startJsPath = path.join(__dirname, '../frontend/start.js');
            serveStaticFile(res, startJsPath, 'application/javascript');

        } else if (req.url === '/help.html' && req.method === 'GET') {
            const helpHtml = path.join(__dirname, '../frontend/help.html');
            serveStaticFile(res, helpHtml, 'text/html');

        } else if (req.url === '/get-comparison' && req.method === 'POST') {
            let userPoem = '';

            req.on('data', chunk => {
                userPoem += chunk.toString(); 
            });

            req.on('end', async () => {
                console.log("Received user poem:", userPoem); 

                try {
                    const comparisonResults = await compareUserAIPoem(userPoem);
                    const formattedData = formatPoemComparison(comparisonResults);

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end(formattedData);
                } catch (error) {
                    console.error("An error occurred while processing the comparison:", error);
                    res.statusCode = 500;
                    res.end("An error occurred while processing the comparison.");
                }
            });
        } else {
            res.statusCode = 404;
            res.end("Page Not Found");
        }
    });

    server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
}

createServer(); 