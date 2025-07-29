//swiper
var swiper = new Swiper(".slider-wrapper", {
    loop: true,
    slidesPerView: 3,
    spaceBetween: 30,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        0: {
            slidesPerView: 1
        },
        768: {
            slidesPerView: 2
        },
        1024: {
            slidesPerView: 3
        }
    }
});
//end swiper
//grab variables
function parseCssTime(value) {
    if (value.endsWith('ms')) return parseFloat(value);
    if (value.endsWith('s')) return parseFloat(value) * 1000;
    return 0; // fallback
}
const root = document.documentElement;
const styles = getComputedStyle(root);
const clipDuration = parseCssTime(styles.getPropertyValue('--clip-duration').trim());
const baseColor = styles.getPropertyValue("--base-color").trim();
const unselectedColor = styles.getPropertyValue("--unselected-color").trim();
//end grab variables
//typewriter effect
const typewriter = document.getElementById("typewriter");
if (typewriter != null){
    const borderStyle = window.getComputedStyle(typewriter, '::after');
    let values = ["Graphics Engineer", "Software Engineer", "Game Programmer", "Web Developer"];
    let vIndex = 0;
    let cIndex = 0;
    let reverse = false;
    let currentVal = values.at(vIndex);
    let typeSpeed = 500;
    let eraseSpeed = 100;
    let adjustment = 0;
    let adjustmentStep = 5;
    function type(){
        if (!reverse){
            const char = values.at(vIndex).at(cIndex);
            const newChar = char == " "? "\u00A0" : char;
            typewriter.textContent += newChar; 
            if (cIndex == values.at(vIndex).length - 1){
                reverse = true;
            }
            else{
                cIndex++;
            }
        }
        else{
            typewriter.textContent = typewriter.textContent.substring(0, typewriter.textContent.length - 1);
            if (cIndex == 0){
                adjustment = 0;
                if (vIndex == values.length - 1){
                    vIndex = 0;
                }
                else{
                    vIndex++;
                }
                reverse = false;
            }
            else{
                cIndex--;
                adjustment += adjustmentStep;
                if (adjustment >= (eraseSpeed - 30)){
                    adjustment = (eraseSpeed - 30);
                }
            }
        }
        setTimeout(type, reverse? eraseSpeed - adjustment: typeSpeed);
    }
    type();
    let visible = true;
    const blinkInterval = setInterval(() => {
        if (visible){
            document.documentElement.style.setProperty("--typing-width", "0px");
        }
        else{
            document.documentElement.style.setProperty("--typing-width", "2px");
        }
        visible = !visible;
        
    }, 500);
}
//end typewriter effect
//swapping windows
let lastActive = null;
let swapping = false;
function Swap(a){
    if (swapping){
        return;
    }
    const actives = document.getElementsByClassName("active");
    if (!actives){
        return;
    }
    const swapTo = document.getElementById(a);
    const swapFrom = actives[0];    
    const border = document.getElementById("border");
    const swapToButton = document.getElementById(a + "But");
    if (!swapTo || !swapFrom || !border || !swapToButton){
        return;
    }
    const swapFromButton = document.getElementById(swapFrom.id + "But");
    if (!swapFromButton){
        return;
    }
    if (swapTo == swapFrom){
        return;
    }
    const body = document.getElementById("body");
    body.style.overflow = "hidden";
    border.classList.add("shown");
    border.offsetHeight;
    border.classList.add("activeBorder");
    swapping = true;
    const scrollY = window.scrollY;
    swapTo.classList.add("noT");
    swapTo.classList.add("fixed");
    swapTo.classList.add("shown");
    swapTo.offsetHeight;
    swapTo.style.clipPath = "inset(100dvh 0 0 0)";
    swapTo.offsetHeight;
    swapTo.classList.remove("noT");
    swapTo.classList.add("non-clipped");
    swapTo.classList.add("active");
    swapFrom.classList.remove("active");
    swapFrom.classList.add("fixed");
    swapFrom.style.top = `-${scrollY}px`;
    setTimeout(()=>{
        body.style.overflow = "scroll";
        swapTo.classList.remove("fixed");
        swapTo.classList.add("noT");
        swapTo.style.clipPath = "inset(100% 0% 0% 0%)";
        swapTo.offsetHeight;
        swapTo.classList.remove("noT");
        swapFrom.classList.add("noT");
        swapFrom.classList.remove("shown");
        swapFrom.style.top = "0";
        swapFrom.classList.remove("fixed");
        swapFrom.classList.remove("non-clipped");
        swapFrom.offsetHeight;
        swapFrom.classList.remove("noT");
        border.classList.add("noT");
        border.classList.remove("activeBorder");
        border.classList.remove("shown");
        border.offsetHeight;
        border.classList.remove("noT");
        swapping = false;
    }, clipDuration);
    swapToButton.classList.add("activeBut");
    swapFromButton.classList.remove("activeBut");
}
//end swapping window
//close card
function CloseCard(a){
    const cardWindow = document.getElementById("card-expanded-container");
    const card = document.getElementById(a);
    if (!card || !cardWindow){
        return;
    }
    cardWindow.style.opacity = "0";
    card.style.opacity = "0";
    card.style.transform = "translateY(100%)";
    setTimeout(()=>{
        cardWindow.classList.remove("shown");
        card.classList.remove("shown");
    }, 1000);
    
}
//end close card
//open card
function OpenCard(a){
    const cardWindow = document.getElementById("card-expanded-container");
    const card = document.getElementById(a);
    if (!card || !cardWindow){
        return;
    }
    cardWindow.classList.add("shown");
    cardWindow.offsetHeight;
    cardWindow.style.opacity = "1";
    card.classList.add("shown");
    card.offsetHeight;
    card.style.opacity = "1";
    card.style.transform = "translateY(0%)";
}
//handle submission
document.getElementById('myForm').addEventListener('submit', function(e) {
    e.preventDefault(); 
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    // Example: send it via fetch to Flask without reloading the page
    fetch('/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    })
    .then(res => res.json())
    .then(response => {
    console.log('Server response:', response);
    // Update DOM or show a message without reload
    })
    .catch(error => {
    console.error('Error:', error);
    });
  });