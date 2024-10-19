const { compareUserAIPoem } = require('./script'); 
const { formatPoemComparison } = require('./script'); 

function createServer() {
    const http = require('http');

    const hostname = '127.0.0.1';
    const port = 3000;

    const server = http.createServer(async (_req, res) => {
        res.statusCode = 200; 
        res.setHeader('Content-Type', 'application/json'); 

        try {
            const comparisonResults = await compareUserAIPoem();
            if (comparisonResults) {
                const formattedResults = formatPoemComparison(comparisonResults);
                res.end(formattedResults); 
            } else {
                res.end("Failed to generate comparison results.");
            }
        } catch (error) {
            res.end("An error occurred while generating comparison results.");
        }
    });

    server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
}

createServer(); 