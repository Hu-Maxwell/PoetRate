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
            // Serve the index.html file
            const indexHtml = path.join(__dirname, '../frontend/index.html');
            serveStaticFile(res, indexHtml, 'text/html');

        } else if (req.url === '/style.css' && req.method === 'GET') {
            // Serve the CSS file for index.html
            const indexStyle = path.join(__dirname, '../frontend/style.css');
            serveStaticFile(res, indexStyle, 'text/css');

        } else if (req.url === '/start.html' && req.method === 'GET') {
            // Serve the start.html file
            const startHtml = path.join(__dirname, '../frontend/start.html');
            serveStaticFile(res, startHtml, 'text/html');

        } else if (req.url === '/start.css' && req.method === 'GET') {
            // Serve the CSS file for start.html
            const startStyle = path.join(__dirname, '../frontend/start.css');
            serveStaticFile(res, startStyle, 'text/css');
            
        } else if (req.url === '/sunflower.jpg' && req.method === 'GET') {
            const sunflowerImage = path.join(__dirname, '../frontend/sunflower.jpg');
            serveStaticFile(res, sunflowerImage, 'image/jpg');

        } else if (req.url === '/help.html' && req.method === 'GET') {
            const helpHtml = path.join(__dirname, '../frontend/help.html');
            serveStaticFile(res, helpHtml, 'text/html');
            
        } else if (req.url === '/get-comparison' && req.method === 'GET') {
            // New endpoint to get comparison data
            try {
                const comparisonResults = await compareUserAIPoem();
                const formattedData = formatPoemComparison(comparisonResults);

                // Return the formatted data as a plain string
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end(formattedData);
            } catch (error) {
                res.statusCode = 500;
                res.end("An error occurred while processing the comparison.");
            }
            
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