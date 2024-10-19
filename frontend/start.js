window.onload = function() {
    fetch('http://127.0.0.1:3000/get-random-image')
        .then(response => response.json())
        .then(data => {
            const clientImagePath = data.imagePath;
            const imageElement = document.getElementById('random-image');
            imageElement.src = clientImagePath;
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
  
      const data = await response.json(); 
  
      const resultsContainer = document.getElementById('comparison-results');
      resultsContainer.textContent = data.formattedData;

      const aiPoemContainer = document.getElementById('AI-poem');
      aiPoemContainer.textContent = data.AIPoem;

        
    } catch (error) {
      console.error("An error occurred while fetching comparison data:", error);
    } 
} 


const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting){
            entry.target.classList.add('show');
        } 
        else{
            entry.target.classList.remove('show');
        }
        });
    });


function fetchComparisonData(){

    const resultsDiv = document.getElementById("comparison-results");
    resultsDiv.innerHTML = ` 
    <div id="comparison-results"> </div>
    <div class="bigbox"></div>
    `;
    resultsDiv.scrollIntoView({behavior: 'smooth'});

    setTimeout(function(){
        const hiddenElements = resultsDiv.querySelectorAll('.hidden');
        hiddenElements.forEach((el) => observer.observe(el));

        const additionalScroll = 300;
        const scrollInterval = setInterval(() => {
            window.scrollBy(0,10);
            if(window.scrollY >= additionalScroll){
                clearInterval(scrollInterval);
            }
        }, 30);
        
    },2000);

}