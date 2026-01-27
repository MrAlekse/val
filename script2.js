document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("heart-container");

  if (!container) {
    console.error("❌ heart-container not found");
    return;
  }

  function createHeart() {
    const heart = document.createElement("div");
    heart.className = "floating-heart";

    const hearts = ["❤","💖","💕","💗","❤️","🧡","💛","💚","💙","💜","🤍","💐","🌷","🌹","🌸","🌺"];
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

    heart.style.left = Math.random() * 100 + "vw";

    heart.style.fontSize = 16 + Math.random() * 20 + "px";

    const duration = 4 + Math.random() * 3;
    heart.style.animationDuration = duration + "s";

    container.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, duration * 1000);
  }

  setInterval(createHeart, 300);
});
