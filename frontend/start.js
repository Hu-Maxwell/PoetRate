window.onload = function() {
    fetch('http://127.0.0.1:3000/get-random-image')
        .then(response => response.json())
        .then(data => {
            const clientImagePath = data.imagePath;
            const imageElement = document.getElementById('random-image');
            imageElement.src = clientImagePath;
            // Store the imagePath for sending to server
            window.selectedImagePath = clientImagePath;
        })
        .catch(error => {
            console.error('Error fetching random image:', error);
        });
};

async function fetchComparisonData() {
    const userInput = document.getElementById("userpoeminput").value;
    const clientImagePath = window.selectedImagePath; 
    const imagePath = clientImagePath.substring(1); 
    
  
    try {
      const response = await fetch('http://127.0.0.1:3000/get-comparison', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          poem: userInput,
          imagePath: imagePath
        })
      });
  
      const data = await response.text(); 
  
      const resultsContainer = document.getElementById('comparison-results');
      resultsContainer.textContent = data;
        
    } catch (error) {
      console.error("An error occurred while fetching comparison data:", error);
    } 
} 

/*
function fetchComparisonData(){

    const resultsDiv = document.getElementById("comparison-results");
    resultsDiv.innerHTML = "Score:";
    resultsDiv.scrollIntoView({behavior: 'smooth'});
}
*/