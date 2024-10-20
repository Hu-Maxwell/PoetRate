const fs = require('fs');
const path = require('path'); 

const { compareUserAIPoem, formatPoemComparison, selectRandomImage } = require('./script');

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
         // Allow CORS
    // res.setHeader('Access-Control-Allow-Origin', 'https://poetry-i32yqzozu-hu-maxwells-projects.vercel.app'); // Allow your Vercel URL
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        if (req.url === '/' && req.method === 'GET') {
            // serve index.html
            const indexHtml = path.join(__dirname, '../public/index.html');
            serveStaticFile(res, indexHtml, 'text/html');

        } else if (req.url === '/style.css' && req.method === 'GET') {
            // serve style.css
            const indexStyle = path.join(__dirname, '../public/style.css');
            serveStaticFile(res, indexStyle, 'text/css');

        } else if (req.url === '/start.html' && req.method === 'GET') {
            // serve start.html 
            const startHtml = path.join(__dirname, '../public/start.html');
            serveStaticFile(res, startHtml, 'text/html');

        } else if (req.url === '/start.css' && req.method === 'GET') {
            // serve start.css
            const startStyle = path.join(__dirname, '../public/start.css');
            serveStaticFile(res, startStyle, 'text/css');
            
        } else if (req.url === '/sunflower.jpg' && req.method === 'GET') {
            // serve the sunflower image
            const sunflowerImage = path.join(__dirname, '../public/sunflower.jpg');
            serveStaticFile(res, sunflowerImage, 'image/jpg');
            
        } else if (req.url === '/start.js' && req.method === 'GET') {
            // serve start.js file
            const startJsPath = path.join(__dirname, '../public/start.js');
            serveStaticFile(res, startJsPath, 'application/javascript');

        } else if (req.url === '/help.html' && req.method === 'GET') {
            // serve help.html 
            const helpHtml = path.join(__dirname, '../public/help.html');
            serveStaticFile(res, helpHtml, 'text/html');

        } else if (req.url === '/get-comparison' && req.method === 'POST') {
            // returns data comparison data
            let body = '';

            req.on('data', chunk => {
                body += chunk.toString(); 
            });

            req.on('end', async () => {
                console.log("Received body:", body); 

                try {
                    const parsedBody = JSON.parse(body);
                    const userPoem = parsedBody.poem;
                    const imagePath = parsedBody.imagePath;

                    console.log("Received image path:", imagePath);

                    const comparisonResults = await compareUserAIPoem(userPoem, imagePath);
                    const formattedData = formatPoemComparison(comparisonResults.comparisonResults);

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({
                        formattedData: formattedData,
                        AIPoem: comparisonResults.AIPoem
                    }));
        
                } catch (error) {
                    console.error("An error occurred while processing the comparison:", error);
                    res.statusCode = 500;
                    res.end("An error occurred while processing the comparison.");
                }
            });
        } else if (req.url === '/get-random-image' && req.method === 'GET') {
            // serve randomly generated image
            const { imagePath, clientImagePath } = selectRandomImage();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ imagePath: clientImagePath }));
        
        } else if (req.url.startsWith('/assets/') && req.method === 'GET') {
            // serve assets folder
            const filePath = path.join(__dirname, '../public', req.url);
            const extname = String(path.extname(filePath)).toLowerCase();
            const mimeTypes = {
                '.png': 'image/png',
                '.jpg': 'image/jpg',
            };
            const contentType = mimeTypes[extname] || 'application/octet-stream';
            serveStaticFile(res, filePath, contentType);
        
        } else if (req.url === '/app.js' && req.method === 'GET') {
            // serve app.js file
            const startJsPath = path.join(__dirname, '../public/app.js');
            serveStaticFile(res, startJsPath, 'application/javascript');
        
        } else if (req.url === '/help.css' && req.method === 'GET') {
            // serve start.css
            const startStyle = path.join(__dirname, '../public/help.css');
            serveStaticFile(res, startStyle, 'text/css');
        
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