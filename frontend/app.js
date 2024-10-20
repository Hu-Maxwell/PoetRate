
function goToNextPage(){
    window.location.href = 'start.html';
}
const observer = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
        if(entry.isIntersecting){
            entry.target.classList.add('show');
        }else{
            entry.target.classList.remove('show');
        }
    });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el)=> observer.observe(el));


const faqHeader = document.querySelectorAll(".faq-header");
faqHeader.forEach(faqHeader=>{
    faqHeader.addEventListener("click", event =>{
        faqHeader.classList.toggle("active");
        const faqBody = faqHeader.nextElementSibling;
        if(faqHeader.classList.contains("active")){
            faqBody.style.maxHeight = faqBody.scrollHeight + "px";
        }else{
            faqBody.style.maxHeight = 0;
        }
    });
    
});

