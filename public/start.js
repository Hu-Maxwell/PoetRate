

window.onload = function() {
    fetch('https://poetry-i32yqzozu-hu-maxwells-projects.vercel.app/get-random-image')
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
      const response = await fetch('https://poetry-i32yqzozu-hu-maxwells-projects.vercel.app/get-comparison', {
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
            <p>${scoreText}</p>
            <p>${poemText}</p>
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
    fetch('https://poetry-i32yqzozu-hu-maxwells-projects.vercel.app/get-random-image')
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