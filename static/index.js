// =============== IMPORTS ===============
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.154.0/build/three.module.js';
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

// Typewriter variables
let typewriter;
let typewriterValues = ["Graphics Engineer", "Software Engineer", "Game Programmer", "Web Developer"];
let vIndex = 0;
let cIndex = 0;
let reverse = false;
let typeSpeed = 275;
let eraseSpeed = 100;
let adjustment = 0;
let adjustmentStep = 5;
let visible = true;
let blinkInterval;
let pauseTime = 0;
let ranTime = 0;
// DOM elements
let body;
let border;
let projectsPage;
let cardWindow;
let activePage;
let smokeVideo;
//Smoke Variables
//smoke values
let darkAmp = 10.0;
let eVX = 0.0;
let eVY = 5.0;
let visc = 0.0001;
let diff = 0.001;
let radius = 0.1;
let resolution = 100;
let size = resolution + 2;
let pressure;
let div;
let oldvX;
let oldvY;
let vX;
let vY;
let colors;
let densities;
let oldDensities;
let velMag = 20;
let inputMode = 0;
let sourceMode = 0;
let spawn;
let vel;
let open = false;
let smokeOptHolder;
//three js values
let orthoSize = 0.5;
let width;
let height;
let aspect;
let camera;
let scene;
let renderer;
let smokeTexture;
let canvas;
class Mouse{
    static first = true;
    static moving = false;
    static held = false;
    static lastMoveTime = 0;
    static movingThreshold = 0.1;
    static clickPos = {x : 0, y : 0};
    static pos = {x : 0, y : 0};
    static lastPos = {x : 0, y : 0};
    static deltaMousePos = {x : 0, y : 0};
}
class Time{
    static deltaTime = 0;
    static lastTime = 0;
}
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
        activePage = getElementSafely("home");
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
        
        function type() {
            try {
                ranTime = Math.random() * 50;
                pauseTime = 0;
                if (!reverse) {
                    const char = typewriterValues[vIndex][cIndex];
                    const newChar = char === " " ? "\u00A0" : char;
                    typewriter.textContent += newChar;
                    
                    if (cIndex === typewriterValues[vIndex].length - 1) {
                        reverse = true;
                        pauseTime = 750;
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
                setTimeout(type, reverse ? eraseSpeed - adjustment + pauseTime: typeSpeed + ranTime);
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
                activePage = swapTo;
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
                if (swapTo.id == "home"){
                    requestAnimationFrame(animate);
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
        const form = getElementSafely('myForm');
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
// =============== SMOKE SIM ===============
function resizeScene() {
    width = window.innerWidth;
    height = window.innerHeight;

    // update drawing buffer to match window size (handles devicePixelRatio)
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height, false); // false: don’t update the canvas style, just the buffer
    aspect = window.innerWidth/window.innerHeight;
    camera.left = -orthoSize;
    camera.right = orthoSize;
    camera.top = orthoSize;
    camera.bottom = -orthoSize;
    camera.updateProjectionMatrix();
}
function animate(){
    try{
        let currentTime = performance.now() / 1000;
        if (activePage != getElementSafely("home")){
            Time.lastTime = 0;
            return;
        }
        if (Time.lastTime == 0){
            Time.deltaTime = 0.16667;
            Time.lastTime = performance.now()/1000;
        }
        else{
            Time.deltaTime = currentTime - Time.lastTime;
            Time.lastTime = currentTime;
        }
        if (Mouse.moving){
            if ((currentTime - Mouse.movingThreshold) > Mouse.lastMoveTime){
                Mouse.moving = false;
            }
        }
        if (Mouse.held){
            if ((currentTime - 1) > Mouse.lastMoveTime){
                Mouse.held = false;
            }
        }
        switch (inputMode){
            case 0:
                InputFollow();
                break;
            case 1:
                InputSAD();
                break;
            default:
                break;
        }
        SmokeUpdate();
        renderer.render(scene,camera);
        requestAnimationFrame(animate);
    }
    catch(error){
        console.error("Error running Smoke Simulation; switching to static video.", error);
        if (smokeVideo){
            safeAddClass(smokeVideo, "shown");
        }
        if (canvas){
            safeRemoveClass(canvas, "shown");
        }
    }
}
function ShowInfo(){
    window.alert(clickPos.x);
}
function InputSAD(){
    if (!Mouse.held){
        return;
    }
    spawn = {x : Mouse.clickPos.x * resolution, y : Mouse.clickPos.y * resolution, z : 0};
    vel = {x : (Mouse.pos.x - Mouse.clickPos.x) * velMag, y : (Mouse.pos.y - Mouse.clickPos.y) * velMag};
    AddToSmoke(spawn, radius, vel.x, vel.y);
}
function InputFollow(){
    if (!Mouse.moving){
        return;
    }
    spawn = {x : Mouse.pos.x * resolution, y : Mouse.pos.y * resolution, z : 0};
    vel = { x : 0, y : velMag};
    AddToSmoke(spawn, radius, vel.x, vel.y);
}
function IX(x, y){
    return (y) * (resolution+2) + x;
} 

function CPUStart() {
    vX = new Float32Array(size * size);
    vY = new Float32Array(size * size);
    densities = new Float32Array(size * size);
    oldvX = new Float32Array(size * size);
    oldvY = new Float32Array(size * size);
    oldDensities = new Float32Array(size * size);
    pressure = new Float32Array(size * size);
    div = new Float32Array(size * size);
    colors = new Float32Array(resolution * resolution);
    
    colors.fill(0);
}

function SmokeUpdate() {
    AdvectUpdate();
    switch(sourceMode){
        case 0:
            break;
        case 1:
            AddSource();
            break;
        default:
            break;
    }
    Diffuse();
    VelUpdate();
    TextureUpdate();
}

function Diffuse() {
    [oldvX, vX] = [vX, oldvX];
    [oldvY, vY] = [vY, oldvY];
    DiffuseArray(vX, oldvX, visc, 1);
    DiffuseArray(vY, oldvY, visc, 2);
    [oldDensities, densities] = [densities, oldDensities];
    DiffuseArray(densities, oldDensities, diff, 0);
}

function TextureUpdate() {
    for (let y = 1; y <= resolution; y++) {
        for (let x = 1; x <= resolution; x++) {
            const colorIndex = ((x - 1) + (y - 1) * resolution);
            colors[colorIndex] = densities[IX(x, y)];
        }
    }
    smokeTexture.needsUpdate = true;
}

function AdvectUpdate() {
    [oldDensities, densities] = [densities, oldDensities];
    Advect(densities, oldDensities, vX, vY, 0);
    [oldvX, vX] = [vX, oldvX];
    [oldvY, vY] = [vY, oldvY];
    Advect(vX, oldvX, oldvX, oldvY, 1);
    Advect(vY, oldvY, oldvX, oldvY, 2);
}

function AddSource() {
    const xPos = Math.floor(0.5 * resolution);
    const yPos = Math.floor(0.1 * resolution);
    const ranVelocityX = Math.floor(Math.random() * 21);
    AddToSmoke({x: xPos, y: yPos, z: 0}, radius, -10 + ranVelocityX, eVY);
}

function VelUpdate() {
    Project(vX, vY, pressure, div);
}

function AddToSmoke(position, radius, xDir = 0, yDir = 0) {
    const gridRad = radius * resolution;
    const arrayRad = Math.floor(gridRad);
    const leftSide = Math.max(0, Math.min(Math.floor(position.x - arrayRad), resolution - 1));
    const rightSide = Math.max(0, Math.min(Math.floor(position.x + arrayRad), resolution - 1));
    const topSide = Math.max(0, Math.min(Math.floor(position.y + arrayRad), resolution - 1));
    const bottomSide = Math.max(0, Math.min(Math.floor(position.y - arrayRad), resolution - 1));
    
    for (let y = bottomSide; y <= topSide; y++) {
        for (let x = leftSide; x <= rightSide; x++) {
            const i = x + 1;
            const j = y + 1;
            const offset = {
                x: x - position.x,
                y: y - position.y,
                z: 0 - position.z
            };
            const distance = Math.sqrt(offset.x * offset.x + offset.y * offset.y + offset.z * offset.z);
            
            if (distance <= gridRad) {
                const dens = (1.0 - distance / (gridRad > 0 ? gridRad : 1));
                densities[IX(i, j)] = Math.max(0.0, Math.min(1.0, 
                    densities[IX(i, j)] + dens * darkAmp * Time.deltaTime));
                vX[IX(i, j)] = Math.max(-10.0, Math.min(10.0, 
                    vX[IX(i, j)] + dens * xDir * Time.deltaTime));
                vY[IX(i, j)] = Math.max(-10.0, Math.min(10.0, 
                    vY[IX(i, j)] + dens * yDir * Time.deltaTime));
            }
        }
    }
}

function Advect(newData, oldData, xVel, yVel, b) {
    for (let y = 1; y <= resolution; y++) {
        for (let x = 1; x <= resolution; x++) {
            // Find positions that current positions came from using current velocity
            let xPos = x - xVel[IX(x, y)] * Time.deltaTime * resolution;
            xPos = Math.max(0.0, Math.min(resolution, xPos));
            let yPos = y - yVel[IX(x, y)] * Time.deltaTime * resolution;
            yPos = Math.max(0.0, Math.min(resolution, yPos));
            
            const i = Math.floor(xPos);
            const j = Math.floor(yPos);
            const iProp = xPos - i;
            const jProp = yPos - j;
            
            const bottomLeftData = (1 - iProp) * (1 - jProp) * oldData[IX(i, j)];
            const bottomRightData = (iProp) * (1 - jProp) * oldData[IX(i + 1, j)];
            const topLeftData = (1 - iProp) * (jProp) * oldData[IX(i, j + 1)];
            const topRightData = (iProp) * (jProp) * oldData[IX(i + 1, j + 1)];
            
            newData[IX(x, y)] = bottomLeftData + bottomRightData + topLeftData + topRightData;
        }
    }
    set_bnd(b, newData);
}

function DiffuseArray(newData, oldData, diff, b) {
    const a = resolution * resolution * diff * Time.deltaTime;
    
    // Scale diffusion iterations with resolution for proper convergence
    const baseIterations = 20;
    let adaptiveIterations = baseIterations + Math.floor(resolution / 64) * 10;
    adaptiveIterations = Math.min(adaptiveIterations, 100);
    
    for (let k = 0; k < adaptiveIterations; k++) {
        for (let y = 1; y <= resolution; y++) {
            for (let x = 1; x <= resolution; x++) {
                newData[IX(x, y)] = (oldData[IX(x, y)] + a * (
                    newData[IX(x - 1, y)] + 
                    newData[IX(x + 1, y)] + 
                    newData[IX(x, y + 1)] + 
                    newData[IX(x, y - 1)]
                )) / (4 * a + 1);
            }
        }
    }
    set_bnd(b, newData);
}

function Project(xVel, yVel, pressure, div) {
    const h = (1.0 / resolution);
    
    for (let y = 1; y <= resolution; y++) {
        for (let x = 1; x <= resolution; x++) {
            div[IX(x, y)] = -0.5 * h * (
                xVel[IX(x + 1, y)] - xVel[IX(x - 1, y)] + 
                yVel[IX(x, y + 1)] - yVel[IX(x, y - 1)]
            );
            pressure[IX(x, y)] = 0;
        }
    }
    set_bnd(0, div);
    set_bnd(0, pressure);
    
    const baseIterations = 20;    
    for (let k = 0; k < baseIterations; k++) {
        for (let y = 1; y <= resolution; y++) {
            for (let x = 1; x <= resolution; x++) {
                pressure[IX(x, y)] = (
                    div[IX(x, y)] + 
                    pressure[IX(x + 1, y)] + 
                    pressure[IX(x - 1, y)] + 
                    pressure[IX(x, y + 1)] + 
                    pressure[IX(x, y - 1)]
                ) / 4.0;
            }
        }
    }
    set_bnd(0, pressure);
    
    for (let y = 1; y <= resolution; y++) {
        for (let x = 1; x <= resolution; x++) {
            xVel[IX(x, y)] -= (pressure[IX(x + 1, y)] - pressure[IX(x - 1, y)]) * 0.5 / h;
            yVel[IX(x, y)] -= (pressure[IX(x, y + 1)] - pressure[IX(x, y - 1)]) * 0.5 / h;
        }
    }
    set_bnd(1, xVel);
    set_bnd(2, yVel);
}

function set_bnd(b, x) {
    for (let i = 1; i <= resolution; i++) {
        x[IX(0, i)] = b === 1 ? -x[IX(1, i)] : x[IX(1, i)];
        x[IX(resolution + 1, i)] = b === 1 ? -x[IX(resolution, i)] : x[IX(resolution, i)];
        x[IX(i, 0)] = b === 2 ? -x[IX(i, 1)] : x[IX(i, 1)];
        x[IX(i, resolution + 1)] = b === 2 ? -x[IX(i, resolution)] : x[IX(i, resolution)];
    }
    x[IX(0, 0)] = b !== 0 ? -x[IX(1, 1)] : x[IX(1, 1)];
    x[IX(0, resolution + 1)] = b !== 0 ? -x[IX(1, resolution)] : x[IX(1, resolution)];
    x[IX(resolution + 1, 0)] = b !== 0 ? -x[IX(resolution, 1)] : x[IX(resolution, 1)];
    x[IX(resolution + 1, resolution + 1)] = b !== 0 ? -x[IX(resolution, resolution)] : x[IX(resolution, resolution)];
}
function initializeSmokeSim(){
    try{
        smokeOptHolder = getElementSafely("controls-bar");
        smokeVideo = getElementSafely("smoke-vid");
        scene = new THREE.Scene();

        aspect = window.innerWidth/window.innerHeight;
        camera = new THREE.OrthographicCamera(-orthoSize * aspect, orthoSize * aspect, orthoSize, -orthoSize, 0.1, 1000);
        canvas = document.querySelector('#smoke-sim')
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
        });
        camera.position.setZ(30);
        resizeScene();
        scene.background = new THREE.Color(0xeaeaea);
        CPUStart();
        const geometry = new THREE.PlaneGeometry(1,1);
        smokeTexture = new THREE.DataTexture(colors, resolution, resolution, THREE.RedFormat, THREE.FloatType);
        smokeTexture.needsUpdate = true;
        smokeTexture.minFilter = THREE.LinearFilter;
        smokeTexture.magFilter = THREE.LinearFilter;
        smokeTexture.wrapS = smokeTexture.wrapT = THREE.ClampToEdgeWrapping;
        const material = new THREE.ShaderMaterial({
            uniforms: {
                myDataTex: {value: smokeTexture}, 
                texSize: {value: new THREE.Vector2(resolution, resolution)},
            },
            vertexShader: `
                varying vec2 vUv;
                void main(){
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                precision highp float;
                uniform sampler2D myDataTex;
                varying vec2 vUv;
                
                void main(){
                vec4 data = texture(myDataTex, vUv);
                float value = data.r;
                gl_FragColor = vec4(15.0/255.0, 15.0/255.0, 15.0/255.0, value);
                }
            `,
            transparent: true
        });
        const smokePlane = new THREE.Mesh(geometry, material);
        scene.add(smokePlane);
        window.addEventListener('resize', (evt) => {
            resizeScene();
        });
        const home = canvas;
        home.addEventListener('mousedown', (evt) => {
            Mouse.clickPos = getMousePos(evt);
            Mouse.held = true;
        });
        home.addEventListener("mousemove", (evt) => {
            if (!Mouse.first){
                Mouse.lastPos = Mouse.pos;
            }
            Mouse.pos = getMousePos(evt);
            if (Mouse.first){
                Mouse.lastPos = Mouse.pos;
                Mouse.first = false;
            }
            Mouse.deltaMousePos = {x : Mouse.pos.x - Mouse.lastPos.x, y : Mouse.pos.y - Mouse.lastPos.y};
            Mouse.moving = true;
            Mouse.lastMoveTime = performance.now() / 1000;
        });
        home.addEventListener('mouseup', (evt) => {
            Mouse.held = false;
        });
        home.addEventListener('touchstart', (evt) =>{
            const touch = evt.touches[0];
            Mouse.clickPos = getMousePos(touch);
            Mouse.held = true;
        });
        home.addEventListener('touchmove', (evt) =>{
            const touch = evt.touches[0];
            if (!Mouse.first){
                Mouse.lastPos = Mouse.pos;
            }
            Mouse.pos = getMousePos(touch);
            if (Mouse.first){
                Mouse.lastPos = Mouse.pos;
                Mouse.first = false;
            }
            Mouse.deltaMousePos = {x : Mouse.pos.x - Mouse.lastPos.x, y : Mouse.pos.y - Mouse.lastPos.y};
            Mouse.moving = true;
            Mouse.lastMoveTime = performance.now() / 1000;
        });
        home.addEventListener('touchend', (evt) =>{
            Mouse.held = false;
        });
        safeAddClass(canvas, "shown");
        requestAnimationFrame(animate);
        console.log('Smoke Sim initialized successfully');
    }
    catch(error){
        console.error('Error initializing smoke sim:', error);
        if (smokeVideo){
            safeAddClass(smokeVideo, "shown");
        }
        if (canvas){
            safeRemoveClass(canvas, "shown");
        }
    }
}
function getMousePos(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: ((event.clientX - rect.left) / (rect.right - rect.left)),
        y: (1 - (event.clientY - rect.top) / (rect.bottom - rect.top))
    };
}
// =============== SMOKE SIM FORM ===============
function initializeSmokeFormHandling() {
    try {
        const form = getElementSafely('smokeForm');
        if (!form) {
            console.warn('Smke form not found');
            return;
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            try {
                const formData = new FormData(this);
                const data = Object.fromEntries(formData.entries());
                // Validate required fields
                const requiredFields = ['diffusion', 'viscocity', 'density', 'radius', 'input', 'source', 'velocity'];
                const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');
                
                if (missingFields.length > 0) {
                    console.error('Missing required fields:', missingFields);
                    alert('Please fill in all required fields.');
                    return;
                }

                diff = parseFloat(data.diffusion) * 0.001;
                visc = parseFloat(data.viscocity) * 0.0001;
                darkAmp = parseFloat(data.density) * 10;
                radius = parseFloat(data.radius) * 0.1;
                velMag = parseFloat(data.velocity) * 20;
                inputMode = parseInt(data.input);
                sourceMode = parseInt(data.source);
            }
            catch(error){
                console.error('Error sending smoke form:', error);
                alert('Error setting parameters. Please try again.');
            }
        });
        
        console.log('Smoke form handling initialized successfully');
    } catch (error) {
        console.error('Error initializing smoke form handling:', error);
    }
}
function RestartSim(){
    densities.fill(0);
    oldDensities.fill(0);
    vX.fill(0);
    vY.fill(0);
    oldvX.fill(0);
    oldvY.fill(0);
    pressure.fill(0);
    div.fill(0);
    colors.fill(0);
    smokeTexture.needsUpdate = true;
}
function SmokeOpenClose(){
    try{
        if (inAnim){
        return;
        }
        if (open){
            safeRemoveClass(smokeOptHolder, "shown-controls");
        }
        else{
            safeAddClass(smokeOptHolder, "shown-controls");
        }
        open = !open;
    }
    catch(error){
        console.error("Error opening/closing smoke controls, ", error);
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
        if (scene){
            scene.destroy();
        }
        if (camera){
            camera.destroy();
        }
        if (renderer){
            renderer.destroy();
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
        initializeSmokeSim();
        initializeSmokeFormHandling();
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error during application initialization:', error);
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);
window.Swap = Swap;
window.OpenCard = OpenCard;
window.CloseCard = CloseCard;
window.RestartSim = RestartSim;
window.ShowInfo = ShowInfo;
window.SmokeOpenClose = SmokeOpenClose;