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

let scoreText = '';
let poemText = '';

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
  
      scoreText = data.formattedData;

      poemText = data.AIPoem;

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


async function scrollDown(){
    await fetchComparisonData(); 

    const resultsDiv = document.getElementById("comparison-results");
    resultsDiv.innerHTML = ` 
        <div class="bigbox"> 
            <ul id="scoreText">${scoreText}
                <li>${scoreItem1}</li>
                <li>${scoreItem2}</li>
                <li>${scoreItem3}</li>
                <li>${scoreItem4}</li>
                </ul>
            <p>${poemText}</p>
        </div>

        <div class="bigbox"> 
            <p>Score</p>
        </div>
    `;
    resultsDiv.scrollIntoView({behavior: 'smooth'});

    setTimeout(function(){
        const hiddenElements = resultsDiv.querySelectorAll('.hidden');
        hiddenElements.forEach((el) => observer.observe(el));
        
    },2000);

}

function startOver(){
    document.getElementById('userpoeminput').value = '';
    regenerateImage();
    document.getElementById('comparison-results').innerHTML = '';
}

function regenerateImage() {
    fetch('http://127.0.0.1:3000/get-random-image')
        .then(response => response.json())
        .then(data => {
            const clientImagePath = data.imagePath;
            const imageElement = document.getElementById('random-image');
            imageElement.src = clientImagePath;
            window.selectedImagePath = clientImagePath; 
        })
        .catch(error => {
            console.error('Error fetching new image:', error);
        });
}