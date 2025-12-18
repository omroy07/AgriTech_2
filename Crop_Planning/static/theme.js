document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("theme-toggle");
  const themeText = document.getElementById("theme-text");
  const body = document.body;

  toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark");
    body.classList.toggle("light");
    themeText.textContent = body.classList.contains("dark") ? "Dark" : "Light";
  });
});
