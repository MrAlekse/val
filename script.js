const lever = document.getElementById('lever');
const wrapper = document.getElementById('leverWrapper');
const music = document.getElementById('music');
const lid = document.getElementById('lid');

const slides = document.getElementById("slides");

let dragging = false;
let lastAngle = null;
let rotation = 0;
let liftProgress = 0;

const slideCount = slides.children.length;
const slideWidth = 120;

const image = document.getElementById('innerImage');
const statusText = document.getElementById('status');

let cachedImageHeight = 0;

function cacheSizes() {
  cachedImageHeight = image.getBoundingClientRect().height || image.offsetHeight;
}
window.addEventListener("load", cacheSizes);
window.addEventListener("resize", cacheSizes);

let currentIndex = 1;                 // start at actual first image (because of duplicate)
let carouselOffset = -slideWidth;     // show first image

// initialize
slides.style.transform = `translateX(${carouselOffset}px)`;


function getAngle(x, y) {
  const rect = wrapper.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  return Math.atan2(y - cy, x - cx) * (180 / Math.PI);
}

function start(e) {
  dragging = true;
  lastAngle = getAngle(e.clientX, e.clientY);
  lever.style.cursor = 'grabbing';
}

function move(e) {
  if (!dragging) return;

  const angle = getAngle(e.clientX, e.clientY);
  let delta = angle - lastAngle;

  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;

  lastAngle = angle;

  const sensitivity = 0.004;
  liftProgress += delta * sensitivity;
  liftProgress = Math.max(0, Math.min(1, liftProgress));

  rotation += delta * 0.35;
  lever.style.transform = `rotate(${rotation}deg)`;

  updateImage();
  updateLid();

  if (music.paused && liftProgress > 0) {
    music.play().catch(() => {});
  }

  // <-- IMPORTANT: use this function for carousel movement
  moveCarousel(delta);
}

function end() {
  dragging = false;
  lastAngle = null;
  lever.style.cursor = 'grab';
  music.pause();
}

function updateImage() {
  const image = document.getElementById('innerImage');
  const imageHeight = image.offsetHeight;
  const riseMultiplier = 1.4;
  const rise = imageHeight * liftProgress * riseMultiplier;
  image.style.transform = `translateX(-50%) translateY(${-rise}px)`;

  if (liftProgress > 0) {
    image.classList.add('show');
  } else {
    image.classList.remove('show');
  }
   if (liftProgress >= 0.95) {
    image.style.pointerEvents = "auto";
  } else {
    image.style.pointerEvents = "none";
  }
}

function updateLid() {
  if (liftProgress > 0) {
    lid.classList.add('open');
  } else {
    lid.classList.remove('open');
  }
}

lever.addEventListener('pointerdown', e => {
  lever.setPointerCapture(e.pointerId);
  start(e);
});

lever.addEventListener('pointermove', move);
lever.addEventListener('pointerup', end);
lever.addEventListener('pointercancel', end);

const windButton = document.getElementById('windButton');
let winding = false;
let windInterval = null;

function startWinding(e) {
  if (winding) return;
  winding = true;

  windButton.setPointerCapture(e.pointerId);
  music.play().catch(() => {});

  windInterval = setInterval(() => {
    liftProgress += 0.01;
    liftProgress = Math.min(1, liftProgress);
    updateImage();
    updateLid();

    rotation += 5;
    lever.style.transform = `rotate(${rotation}deg)`;

    // also move carousel while winding
    moveCarousel(5);
  }, 50);
}

function stopWinding() {
  winding = false;
  clearInterval(windInterval);
  windInterval = null;
  music.pause();
}

windButton.addEventListener('pointerdown', startWinding);
windButton.addEventListener('pointerup', stopWinding);
windButton.addEventListener('pointerleave', stopWinding);
windButton.addEventListener('pointercancel', stopWinding);


// ===============================
// Carousel Move Function (Infinite Loop)
// ===============================
function moveCarousel(delta) {
  carouselOffset -= delta * 0.3;
  slides.style.transform = `translateX(${carouselOffset}px)`;

  currentIndex = Math.round(Math.abs(carouselOffset) / slideWidth);

  if (currentIndex === 0) {
    currentIndex = slideCount - 2;
    carouselOffset = -slideWidth * currentIndex;
    slides.style.transition = "none";
    slides.style.transform = `translateX(${carouselOffset}px)`;
    requestAnimationFrame(() => {
      slides.style.transition = "transform 0.2s ease";
    });
  } else if (currentIndex === slideCount - 1) {
    currentIndex = 1;
    carouselOffset = -slideWidth * currentIndex;
    slides.style.transition = "none";
    slides.style.transform = `translateX(${carouselOffset}px)`;
    requestAnimationFrame(() => {
      slides.style.transition = "transform 0.2s ease";
    });
  }
}