const { compareUserAIPoem } = require('./test'); 

function createServer() {
    const http = require('http');

    const hostname = '127.0.0.1';
    const port = 3000;

    const server = http.createServer(async (req, res) => {
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

function formatPoemComparison(data) {
    let formatted = "\nComparison of Poem Scores:\n\n";

    formatted += "Poem 1:\n";
    formatted += `  Creativity: ${data.poem_1.creativity}\n`;
    formatted += `  Originality: ${data.poem_1.originality}\n`;
    formatted += `  Prose: ${data.poem_1.prose}\n`;
    formatted += `  Personal Meaning: ${data.poem_1.personal_meaning}\n`;
    formatted += `  Overall: ${data.poem_1.overall}\n`;

    formatted += "\nPoem 2:\n";
    formatted += `  Creativity: ${data.poem_2.creativity}\n`;
    formatted += `  Originality: ${data.poem_2.originality}\n`;
    formatted += `  Prose: ${data.poem_2.prose}\n`;
    formatted += `  Personal Meaning: ${data.poem_2.personal_meaning}\n`;
    formatted += `  Overall: ${data.poem_2.overall}\n`;

    return formatted;
}

createServer(); 