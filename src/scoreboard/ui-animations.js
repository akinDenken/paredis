export function applyWaveAnimation(selector) {
  const el = document.querySelector(selector);
  if (!el) return;

  const text = el.textContent;
  el.textContent = "";

  [...text].forEach((char, i) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.style.display = "inline-block";
    span.style.animation = `wave 1.5s ease-in-out ${i * 0.1}s infinite`;
    el.appendChild(span);
  });
}

// Cria a keyframe via JS
const style = document.createElement("style");
style.textContent = `
@keyframes wave {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
`;
document.head.appendChild(style);
