async function fetchComparisonData() {
    const userInput = document.getElementById("userpoeminput").value;
  
    try {
      const response = await fetch('http://127.0.0.1:3000/get-comparison', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          poem: userInput,
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