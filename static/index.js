// =============== VARIABLES ===============
// Swiper configuration
let swiper;

// CSS Variables
let clipDuration;
let baseColor;
let unselectedColor;

// Animation and state variables
let scrollY = 0;
let openedCard = false;
let cardName = null;
let inAnim = false;
let lastActive = null;

// Typewriter variables
let typewriter;
let typewriterValues = ["Graphics Engineer", "Software Engineer", "Game Programmer", "Web Developer"];
let vIndex = 0;
let cIndex = 0;
let reverse = false;
let currentVal = "";
let typeSpeed = 500;
let eraseSpeed = 100;
let adjustment = 0;
let adjustmentStep = 5;
let visible = true;
let blinkInterval;

// DOM elements
let body;
let border;
let projectsPage;
let cardWindow;

// =============== UTILITY FUNCTIONS ===============
function parseCssTime(value) {
    try {
        if (!value) return 0;
        if (value.endsWith('ms')) return parseFloat(value);
        if (value.endsWith('s')) return parseFloat(value) * 1000;
        return 0; // fallback
    } catch (error) {
        console.error('Error parsing CSS time:', error);
        return 0;
    }
}

function getElementSafely(id) {
    try {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with id '${id}' not found`);
            return null;
        }
        return element;
    } catch (error) {
        console.error(`Error getting element with id '${id}':`, error);
        return null;
    }
}

function safeSetProperty(element, property, value) {
    try {
        if (element && element.style) {
            element.style[property] = value;
        }
    } catch (error) {
        console.error(`Error setting property '${property}' to '${value}':`, error);
    }
}

function safeAddClass(element, className) {
    try {
        if (element && element.classList) {
            element.classList.add(className);
        }
    } catch (error) {
        console.error(`Error adding class '${className}':`, error);
    }
}

function safeRemoveClass(element, className) {
    try {
        if (element && element.classList) {
            element.classList.remove(className);
        }
    } catch (error) {
        console.error(`Error removing class '${className}':`, error);
    }
}

// =============== INITIALIZATION ===============
function initializeVariables() {
    try {
        // Get CSS variables
        const root = document.documentElement;
        const styles = getComputedStyle(root);
        clipDuration = parseCssTime(styles.getPropertyValue('--clip-duration').trim());
        baseColor = styles.getPropertyValue("--base-color").trim();
        unselectedColor = styles.getPropertyValue("--unselected-color").trim();

        // Get DOM elements
        body = getElementSafely("body");
        border = getElementSafely("border");
        projectsPage = getElementSafely("projects");
        cardWindow = getElementSafely("card-expanded-container");
        typewriter = getElementSafely("typewriter");

        console.log('Variables initialized successfully');
    } catch (error) {
        console.error('Error initializing variables:', error);
    }
}

// =============== SWIPER INITIALIZATION ===============
function initializeSwiper() {
    try {
        const sliderWrapper = document.querySelector(".slider-wrapper");
        if (!sliderWrapper) {
            console.warn('Swiper container not found');
            return;
        }

        swiper = new Swiper(".slider-wrapper", {
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
        console.log('Swiper initialized successfully');
    } catch (error) {
        console.error('Error initializing Swiper:', error);
    }
}

// =============== TYPEWRITER EFFECT ===============
function initializeTypewriter() {
    try {
        if (!typewriter) {
            console.warn('Typewriter element not found');
            return;
        }

        currentVal = typewriterValues[vIndex];
        
        function type() {
            try {
                if (!reverse) {
                    const char = typewriterValues[vIndex][cIndex];
                    const newChar = char === " " ? "\u00A0" : char;
                    typewriter.textContent += newChar;
                    
                    if (cIndex === typewriterValues[vIndex].length - 1) {
                        reverse = true;
                    } else {
                        cIndex++;
                    }
                } else {
                    typewriter.textContent = typewriter.textContent.substring(0, typewriter.textContent.length - 1);
                    if (cIndex === 0) {
                        adjustment = 0;
                        if (vIndex === typewriterValues.length - 1) {
                            vIndex = 0;
                        } else {
                            vIndex++;
                        }
                        reverse = false;
                    } else {
                        cIndex--;
                        adjustment += adjustmentStep;
                        if (adjustment >= (eraseSpeed - 30)) {
                            adjustment = (eraseSpeed - 30);
                        }
                    }
                }
                setTimeout(type, reverse ? eraseSpeed - adjustment : typeSpeed);
            } catch (error) {
                console.error('Error in typewriter animation:', error);
            }
        }

        type();

        // Blinking cursor effect
        blinkInterval = setInterval(() => {
            try {
                if (visible) {
                    document.documentElement.style.setProperty("--typing-width", "0px");
                } else {
                    document.documentElement.style.setProperty("--typing-width", "2px");
                }
                visible = !visible;
            } catch (error) {
                console.error('Error in blinking cursor:', error);
            }
        }, 500);

        console.log('Typewriter effect initialized successfully');
    } catch (error) {
        console.error('Error initializing typewriter:', error);
    }
}

// =============== WINDOW SWAPPING ===============
function Swap(targetId) {
    try {
        if (inAnim) {
            console.log('Animation in progress, ignoring swap request');
            return;
        }

        const actives = document.getElementsByClassName("active");
        if (!actives || actives.length === 0) {
            console.warn('No active elements found');
            return;
        }

        const swapTo = getElementSafely(targetId);
        const swapFrom = actives[0];
        const swapToButton = getElementSafely(targetId + "But");
        const swapFromButton = getElementSafely(swapFrom.id + "But");

        if (!swapTo || !swapFrom || !border || !swapToButton || !swapFromButton) {
            console.error('Required elements not found for swap');
            return;
        }

        if (swapTo === swapFrom) {
            console.log('Already on target section');
            return;
        }

        // Store scroll position
        scrollY = window.scrollY;

        // Start animation
        safeSetProperty(body, "overflow", "hidden");
        safeAddClass(border, "shown");
        border.offsetHeight; // Force reflow
        safeAddClass(border, "activeBorder");
        inAnim = true;

        // Prepare target section
        safeAddClass(swapTo, "noT");
        safeAddClass(swapTo, "fixed");
        safeAddClass(swapTo, "shown");
        swapTo.offsetHeight; // Force reflow
        safeSetProperty(swapTo, "clipPath", "inset(100vh 0 0 0)");
        swapTo.offsetHeight; // Force reflow
        safeRemoveClass(swapTo, "noT");
        safeAddClass(swapTo, "non-clipped");
        safeAddClass(swapTo, "active");

        // Remove active from current section
        safeRemoveClass(swapFrom, "active");
        if(!openedCard){
            safeAddClass(swapFrom, "fixed");
            safeSetProperty(swapFrom, "top", `-${scrollY}px`);
        }

        // Complete animation after duration
        setTimeout(() => {
            try {
                safeSetProperty(body, "overflow", "scroll");
                safeRemoveClass(swapTo, "fixed");
                safeAddClass(swapTo, "noT");
                safeSetProperty(swapTo, "clipPath", "inset(100% 0% 0% 0%)");
                swapTo.offsetHeight; // Force reflow
                safeRemoveClass(swapTo, "noT");

                // Clean up previous section
                safeAddClass(swapFrom, "noT");
                safeRemoveClass(swapFrom, "shown");
                safeSetProperty(swapFrom, "top", "0");
                safeRemoveClass(swapFrom, "fixed");
                safeRemoveClass(swapFrom, "non-clipped");
                swapFrom.offsetHeight; // Force reflow
                safeRemoveClass(swapFrom, "noT");

                // Clean up border
                safeAddClass(border, "noT");
                safeRemoveClass(border, "activeBorder");
                safeRemoveClass(border, "shown");
                border.offsetHeight; // Force reflow
                safeRemoveClass(border, "noT");

                // Close any open cards
                if (swapFrom.id === "projects" && openedCard) {
                    ForceCloseCard(cardName);
                }

                inAnim = false;
            } catch (error) {
                console.error('Error completing swap animation:', error);
                inAnim = false;
            }
        }, clipDuration);

        // Update button states
        safeAddClass(swapToButton, "activeBut");
        safeRemoveClass(swapFromButton, "activeBut");

    } catch (error) {
        console.error('Error in Swap function:', error);
        inAnim = false;
    }
}

// =============== CARD MANAGEMENT ===============
function ForceCloseCard(cardId) {
    try {
        const card = getElementSafely(cardId);
        
        if (!card || !cardWindow) {
            console.warn('Card or card window not found for force close');
            return;
        }

        safeAddClass(cardWindow, "noT");
        safeSetProperty(cardWindow, "opacity", "0");
        safeRemoveClass(cardWindow, "shown");
        safeRemoveClass(cardWindow, "noT");

        safeAddClass(card, "noT");
        safeSetProperty(card, "opacity", "0");
        safeSetProperty(card, "transform", "translateY(100%)");
        safeRemoveClass(card, "shown");
        safeRemoveClass(card, "noT");

        if (projectsPage) {
            safeAddClass(projectsPage, "noT");
            safeSetProperty(projectsPage, "position", "absolute");
            safeSetProperty(projectsPage, "top", "0px");
            safeRemoveClass(projectsPage, "noT");
        }

        // Force reflow
        cardWindow.offsetHeight;
        card.offsetHeight;
        if (projectsPage) projectsPage.offsetHeight;

        openedCard = false;
        cardName = null;

    } catch (error) {
        console.error('Error in ForceCloseCard:', error);
    }
}

function CloseCard(cardId) {
    try {
        if (inAnim) {
            console.log('Animation in progress, ignoring close request');
            return;
        }

        const card = getElementSafely(cardId);
        
        if (!card || !cardWindow) {
            console.warn('Card or card window not found for close');
            return;
        }

        safeSetProperty(cardWindow, "opacity", "0");
        safeSetProperty(card, "opacity", "0");
        safeSetProperty(card, "transform", "translateY(100%)");
        inAnim = true;

        setTimeout(() => {
            try {
                safeRemoveClass(cardWindow, "shown");
                safeRemoveClass(card, "shown");
                
                if (projectsPage) {
                    safeSetProperty(projectsPage, "position", "absolute");
                    safeSetProperty(projectsPage, "top", "0px");
                }
                
                window.scrollTo(0, scrollY);
                inAnim = false;
                openedCard = false;
                cardName = null;
            } catch (error) {
                console.error('Error completing card close:', error);
                inAnim = false;
            }
        }, 1000);

    } catch (error) {
        console.error('Error in CloseCard:', error);
        inAnim = false;
    }
}

function OpenCard(cardId) {
    try {
        if (inAnim) {
            console.log('Animation in progress, ignoring open request');
            return;
        }

        const card = getElementSafely(cardId);
        
        if (!card || !cardWindow) {
            console.warn('Card or card window not found for open');
            return;
        }

        cardName = cardId;
        scrollY = window.scrollY;

        if (projectsPage) {
            safeSetProperty(projectsPage, "position", "fixed");
            safeSetProperty(projectsPage, "top", `-${scrollY}px`);
        }

        safeAddClass(cardWindow, "shown");
        cardWindow.offsetHeight; // Force reflow
        safeSetProperty(cardWindow, "opacity", "1");

        safeAddClass(card, "shown");
        card.offsetHeight; // Force reflow
        safeSetProperty(card, "opacity", "1");
        safeSetProperty(card, "transform", "translateY(0%)");

        openedCard = true;
        inAnim = true;

        setTimeout(() => {
            inAnim = false;
        }, 1000);

    } catch (error) {
        console.error('Error in OpenCard:', error);
        inAnim = false;
    }
}

// =============== FORM HANDLING ===============
function initializeFormHandling() {
    try {
        const form = document.getElementById('myForm');
        if (!form) {
            console.warn('Contact form not found');
            return;
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            try {
                const formData = new FormData(this);
                const data = Object.fromEntries(formData.entries());

                // Validate required fields
                const requiredFields = ['firstName', 'lastName', 'email', 'subject', 'message'];
                const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');
                
                if (missingFields.length > 0) {
                    console.error('Missing required fields:', missingFields);
                    alert('Please fill in all required fields.');
                    return;
                }

                // Email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(data.email)) {
                    console.error('Invalid email format');
                    alert('Please enter a valid email address.');
                    return;
                }

                // Send form data
                fetch('/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(response => {
                    console.log('Server response:', response);
                    alert('Message sent successfully!');
                    form.reset();
                })
                .catch(error => {
                    console.error('Error sending form:', error);
                    alert('Error sending message. Please try again.');
                });

            } catch (error) {
                console.error('Error in form submission:', error);
                alert('An error occurred. Please try again.');
            }
        });

        console.log('Form handling initialized successfully');
    } catch (error) {
        console.error('Error initializing form handling:', error);
    }
}

// =============== CLEANUP ===============
function cleanup() {
    try {
        if (blinkInterval) {
            clearInterval(blinkInterval);
        }
        if (swiper) {
            swiper.destroy();
        }
    } catch (error) {
        console.error('Error in cleanup:', error);
    }
}

// =============== INITIALIZATION ===============
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('Initializing application...');
        
        initializeVariables();
        initializeSwiper();
        initializeTypewriter();
        initializeFormHandling();
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error during application initialization:', error);
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);