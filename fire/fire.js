let width = window.innerWidth;
let height = window.innerHeight;
let particleLine = 0; // Percent of the screen the line of flame has burnt through
let particles = [];
const animationDuration = 4000;
const animationDelay = 500;
const animationStart = Date.now();
const gradientHeight = 10;

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function spawnParticle() {
  const size = randInt(20, 120);
  const x = randInt(size / 2, width - size / 2);
  const y = particleLine * height + 10;
  const temperature = randInt(4000, 5000);
  const lifespan = randInt(500, 1000);

  const particle = new Particle(x, y, temperature, lifespan, size, 0.03);
  particles.push(particle);
}

/**
 * @returns {number} Returns the progress of the fire animation from 0-1
 */
function getAnimationProgress() {
  const elapsed = Date.now() - animationStart - animationDelay;
  if (elapsed < 0) return 0;
  return Math.min(elapsed / animationDuration, 1);
}

async function setup() {
  canvas = createCanvas(width, height);

  // this is cause certain devices (cough cough, Retina) have a super high resolution
  // but they tell programs they have a lower resolution but a higher "pixel density"
  // so that UI renders larger
  // but we aint falling for that, so setting the pixel density to 1 means that 1 pixel
  // in our P5 canvas is ACTUALLY 1 pixel on the screen
  pixelDensity(1);
  noStroke();

  // blackbodyLoaded is fired from cachedBlackbody.js
  // which needs to run asynchonously to fetch the lookup table
  if (!window.BlackBody) {
    await new Promise(resolve => {
      document.addEventListener('blackbodyLoaded', resolve, { once: true });
    });
  }

  let i = 0;
  const particlesToSpawn = Math.floor(0.3 * width);

  const spawnParticlesInterval = setInterval(() => {
    spawnParticle();
    i++;

    if (i >= particlesToSpawn) {
      clearInterval(spawnParticlesInterval);
    }
  }, 2000 / particlesToSpawn);

  const container = document.querySelector('.container');
  if (container) {
    container.style.display = 'flex';
  }
}

function draw() {
  clear();

  // This code is for a transparency gradient at the flame line
  // The gradient disappears when the flame reaches the bottom
  if (particleLine < 1) {
    const whiteRectHeight = height * (1 - particleLine);
    fill(255);
    rect(0, height - whiteRectHeight, width, whiteRectHeight);

    const gradientY = height - whiteRectHeight;
    for (let i = 0; i < gradientHeight; i++) {
      const alpha = 255 - (255 * i / gradientHeight);
      fill(255, 255, 255, alpha);
      rect(0, gradientY - i - 1, width, 1);
    }
  }

  const progress = getAnimationProgress();
  particleLine = progress;

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.render();

    if (particleLine < 1 && (p.outOfBounds(width, height) || p.getAge() >= 1)) {
      const size = p.getSize();
      const newX = randInt(size / 2, width - size / 2);
      const resetY = (particleLine * height) + 10;
      p.move(newX, resetY);
      p.resetLifespan();
    }

    // Once the flame line hits the bottom, we can let all the particles die off naturally
    else if (particleLine >= 1 && (p.outOfBounds(width, height) || p.getAge() >= 1)) {
      particles.splice(i, 1);
    }
  }

  // Stop P5 when all particles are gone
  if (particleLine >= 1 && particles.length === 0) {
    noLoop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  width = windowWidth;
  height = windowHeight;
}
