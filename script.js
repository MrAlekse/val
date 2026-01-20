const lever = document.getElementById('lever');
const wrapper = document.getElementById('leverWrapper');
const music = document.getElementById('music');
const lid = document.getElementById('lid');
const status = document.getElementById('status');
const image = document.getElementById('innerImage');

let dragging = false;
let lastAngle = null;
let rotation = 0;

// 0 = fully hidden, 1 = fully revealed
let liftProgress = 0;

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

  // Clamp between 0 and 1  
  liftProgress = Math.max(0, Math.min(1, liftProgress));

  rotation += delta * 0.35;
  lever.style.transform = `rotate(${rotation}deg)`;

  updateImage();
  updateLid();

  if (music.paused && liftProgress > 0) {
    music.play().catch(() => {});
    status.textContent = 'Playing while winding…';
  }
}

function end() {
  dragging = false;
  lastAngle = null;
  lever.style.cursor = 'grab';
  music.pause();
  status.textContent = 'Stopped';
}

function updateImage() {
  const imageHeight = image.offsetHeight;

  // Max rise = image height
  const rise = imageHeight * liftProgress;

  image.style.transform = `translateX(-50%) translateY(${-rise}px)`;

  if (liftProgress > 0) {
    image.classList.add('show');
  } else {
    image.classList.remove('show');
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
