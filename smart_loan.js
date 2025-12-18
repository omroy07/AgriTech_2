// ---------- Theme Toggle ----------
document.addEventListener("DOMContentLoaded", () => {
  const themeToggleBtn = document.querySelector(".theme-toggle");
  const sunIcon = document.querySelector(".sun-icon");
  const moonIcon = document.querySelector(".moon-icon");
  const themeText = document.querySelector(".theme-text");

  // Load saved theme
  const currentTheme = localStorage.getItem("theme") || "light";
  setTheme(currentTheme);

  themeToggleBtn.addEventListener("click", () => {
    const newTheme = document.body.classList.contains("dark-mode")
      ? "light"
      : "dark";
    setTheme(newTheme);
  });

  function setTheme(mode) {
    if (mode === "dark") {
      document.body.classList.add("dark-mode");
      sunIcon.style.display = "none";
      moonIcon.style.display = "inline-block";
      themeText.textContent = "Dark";
    } else {
      document.body.classList.remove("dark-mode");
      sunIcon.style.display = "inline-block";
      moonIcon.style.display = "none";
      themeText.textContent = "Light";
    }
    localStorage.setItem("theme", mode);
  }
});


// ---------- Loan Eligibility Checker ----------
const loanForm = document.getElementById("loanForm");
const loanResult = document.getElementById("loanResult");

loanForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const loanType = document.getElementById("loanType").value;
  const loanAmount = parseFloat(document.getElementById("loanAmount").value);
  const income = parseFloat(document.getElementById("income").value);
  const experience = parseFloat(document.getElementById("experience").value);

  let eligibilityMessage = "";
  let improvementTip = "";

  // Basic eligibility logic (you can adjust the rules)
  if (income >= loanAmount * 0.5 && experience >= 2) {
    eligibilityMessage = `✅ Congratulations! You are eligible for the <b>${loanType}</b> loan.`;
  } else {
    eligibilityMessage = `⚠️ You may not be eligible for the <b>${loanType}</b> loan.`;
    if (income < loanAmount * 0.5) {
      improvementTip += "<li>Increase your annual income or apply for a smaller loan amount.</li>";
    }
    if (experience < 2) {
      improvementTip += "<li>Gain more farming experience (minimum 2 years recommended).</li>";
    }
  }

  // Suggested schemes
  let schemes = "";
  switch (loanType) {
    case "crop":
      schemes = "💡 Suggested Scheme: Kisan Credit Card (KCC)";
      break;
    case "equipment":
      schemes = "💡 Suggested Scheme: Agricultural Mechanization Scheme";
      break;
    case "water":
      schemes = "💡 Suggested Scheme: PMKSY (Pradhan Mantri Krishi Sinchayee Yojana)";
      break;
    case "land":
      schemes = "💡 Suggested Scheme: Land Purchase Loan (NABARD)";
      break;
    default:
      schemes = "";
  }

  loanResult.innerHTML = `
    <h3>Loan Result</h3>
    <p>${eligibilityMessage}</p>
    ${improvementTip ? `<ul>${improvementTip}</ul>` : ""}
    <p>${schemes}</p>
  `;
});
