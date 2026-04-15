const waPhone = "60149449065";

const quickForm = document.getElementById("quickForm");
const detailsForm = document.getElementById("detailsForm");

const heroSection = document.getElementById("heroSection");
const detailsSection = document.getElementById("detailsSection");
const resultsSection = document.getElementById("resultsSection");

const profileSummary = document.getElementById("profileSummary");
const resultsGrid = document.getElementById("resultsGrid");
const resultSummary = document.getElementById("resultSummary");
const insightBox = document.getElementById("insightBox");

const backToStep1 = document.getElementById("backToStep1");
const editProfileBtn = document.getElementById("editProfileBtn");

let userData = {};

quickForm.addEventListener("submit", function (e) {
  e.preventDefault();

  userData = {
    fullName: document.getElementById("q_name").value.trim(),
    age: document.getElementById("q_age").value,
    gender: document.getElementById("q_gender").value,
    income: document.getElementById("q_income").value,
    budget: document.getElementById("q_budget").value
  };

  if (
    !userData.fullName ||
    !userData.age ||
    !userData.gender ||
    !userData.income ||
    !userData.budget
  ) {
    alert("Please complete all fields in step 1.");
    return;
  }

  renderProfileSummary();
  heroSection.classList.add("hidden");
  resultsSection.classList.add("hidden");
  detailsSection.classList.remove("hidden");
  detailsSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

backToStep1.addEventListener("click", function () {
  detailsSection.classList.add("hidden");
  resultsSection.classList.add("hidden");
  heroSection.classList.remove("hidden");
  heroSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

editProfileBtn.addEventListener("click", function () {
  resultsSection.classList.add("hidden");
  detailsSection.classList.remove("hidden");
  detailsSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

detailsForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const extraData = {
    smoker: document.getElementById("smoker").value,
    marital: document.getElementById("marital").value,
    occupation: document.getElementById("occupation").value.trim(),
    goal: document.getElementById("goal").value
  };

  if (!extraData.smoker || !extraData.marital || !extraData.occupation || !extraData.goal) {
    alert("Please complete all fields in step 2.");
    return;
  }

  userData = {
    ...userData,
    ...extraData
  };

  renderResults(userData);
  detailsSection.classList.add("hidden");
  resultsSection.classList.remove("hidden");
  resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

function renderProfileSummary() {
  profileSummary.innerHTML = `
    <div class="summary-item">
      <span>Name</span>
      <strong>${escapeHtml(userData.fullName)}</strong>
    </div>
    <div class="summary-item">
      <span>Age</span>
      <strong>${escapeHtml(userData.age)}</strong>
    </div>
    <div class="summary-item">
      <span>Gender</span>
      <strong>${escapeHtml(userData.gender)}</strong>
    </div>
    <div class="summary-item">
      <span>Income</span>
      <strong>${formatIncomeLabel(userData.income)}</strong>
    </div>
    <div class="summary-item">
      <span>Budget</span>
      <strong>${formatBudgetLabel(userData.budget)}</strong>
    </div>
  `;
}

function formatIncomeLabel(value) {
  const map = {
    "1800-2200": "RM1,800 – RM2,200",
    "2200-3800": "RM2,200 – RM3,800",
    "3800-6000": "RM3,800 – RM6,000",
    "6000-10000": "RM6,000 – RM10,000",
    "10000-20000": "RM10,000 – RM20,000",
    "20000-50000": "RM20,000 – RM50,000",
    "50000+": "RM50,000+"
  };
  return map[value] || value;
}

function formatBudgetLabel(value) {
  const map = {
    "100": "RM50 – RM120",
    "180": "RM120 – RM220",
    "300": "RM220 – RM380",
    "400": "RM380+"
  };
  return map[value] || value;
}

function getRecommendedPlan(age, budget, income, smoker, marital, goal) {
  let recommended = "Standard";

  if (income === "1800-2200" || income === "2200-3800") {
    if (budget <= 180) recommended = "Basic";
    else recommended = "Standard";
  }

  if (income === "3800-6000" || income === "6000-10000") {
    recommended = budget >= 300 ? "Standard" : "Basic";
  }

  if (income === "10000-20000" || income === "20000-50000" || income === "50000+") {
    recommended = budget >= 300 ? "Premium" : "Standard";
  }

  if (goal === "Family Protection" || marital === "Married") {
    recommended = "Premium";
  }

  if (goal === "Medical Card" && budget <= 180 && recommended === "Premium") {
    recommended = "Standard";
  }

  if (smoker === "Yes" && recommended === "Basic") {
    recommended = "Standard";
  }

  if (Number(age) >= 45 && recommended === "Basic") {
    recommended = "Standard";
  }

  return recommended;
}

function buildPackages(age, budget, income, smoker, marital, goal) {
  const smokerLoad = smoker === "Yes" ? 30 : 0;
  const ageLoad = Number(age) >= 45 ? 45 : Number(age) >= 35 ? 20 : 0;
  const familyLoad = marital === "Married" || goal === "Family Protection" ? 30 : 0;

  let incomeLoad = 0;
  if (income === "3800-6000") incomeLoad = 15;
  if (income === "6000-10000") incomeLoad = 30;
  if (income === "10000-20000") incomeLoad = 60;
  if (income === "20000-50000") incomeLoad = 90;
  if (income === "50000+") incomeLoad = 130;

  let goalLoad = 0;
  if (goal === "Medical Card") goalLoad = 20;
  if (goal === "Hibah Takaful") goalLoad = 18;
  if (goal === "Family Protection") goalLoad = 36;

  const basicPrice = Math.max(95, budget - 15 + smokerLoad / 2 + ageLoad / 2);
  const standardPrice = Math.max(180, budget + smokerLoad + ageLoad + goalLoad / 2 + incomeLoad / 4);
  const premiumPrice = Math.max(300, budget + 90 + smokerLoad + ageLoad + familyLoad + goalLoad + incomeLoad / 2);

  return [
    {
      key: "Basic",
      label: "Essential Option",
      title: "Basic Plan",
      price: Math.round(basicPrice),
      description: "Suitable for individuals looking for essential protection with a lighter monthly commitment.",
      benefits: [
        "Starter medical protection",
        "Lower monthly commitment",
        "Suitable for budget-conscious individuals"
      ]
    },
    {
      key: "Standard",
      label: "Balanced Option",
      title: "Standard Plan",
      price: Math.round(standardPrice),
      description: "A more balanced option for those who want stronger coverage while staying practical monthly.",
      benefits: [
        "Balanced medical and life coverage",
        "Good fit for working adults",
        "Better long-term protection value"
      ]
    },
    {
      key: "Premium",
      label: "Comprehensive Option",
      title: "Premium Plan",
      price: Math.round(premiumPrice),
      description: "Best suited for those wanting higher benefits, broader protection, and family-focused planning.",
      benefits: [
        "Higher overall protection",
        "More complete long-term security",
        "Suitable for higher-income or family-focused profiles"
      ]
    }
  ];
}

function createWhatsAppLink(data, pkg) {
  const message =
    `Hi, I completed the insurance recommendation form.%0A%0A` +
    `Name: ${encodeURIComponent(data.fullName)}%0A` +
    `Age: ${encodeURIComponent(data.age)}%0A` +
    `Gender: ${encodeURIComponent(data.gender)}%0A` +
    `Monthly Income: ${encodeURIComponent(formatIncomeLabel(data.income))}%0A` +
    `Monthly Budget: ${encodeURIComponent(formatBudgetLabel(data.budget))}%0A` +
    `Smoking Status: ${encodeURIComponent(data.smoker)}%0A` +
    `Marital Status: ${encodeURIComponent(data.marital)}%0A` +
    `Occupation: ${encodeURIComponent(data.occupation)}%0A` +
    `Protection Goal: ${encodeURIComponent(data.goal)}%0A` +
    `Interested Package: ${encodeURIComponent(pkg.title)}%0A` +
    `Estimated Contribution: RM${encodeURIComponent(pkg.price)}/month%0A%0A` +
    `I would like to know more details about this package.`;

  return `https://wa.me/${waPhone}?text=${message}`;
}

function renderResults(data) {
  const age = Number(data.age);
  const budget = Number(data.budget);

  const recommendedPlan = getRecommendedPlan(
    age,
    budget,
    data.income,
    data.smoker,
    data.marital,
    data.goal
  );

  const packages = buildPackages(
    age,
    budget,
    data.income,
    data.smoker,
    data.marital,
    data.goal
  );

  const insight =
    `Based on your income (${formatIncomeLabel(data.income)}) and monthly budget (${formatBudgetLabel(data.budget)}), ` +
    `our ${recommendedPlan} Plan appears to be the most suitable starting point for your current lifestyle and protection goals.`;

  insightBox.textContent = insight;

  resultSummary.innerHTML =
    `<strong>${escapeHtml(data.fullName)}</strong>, here are the plans that best match your profile. ` +
    `Our <strong>${recommendedPlan} Plan</strong> stands out as the best fit to start with.`;

  resultsGrid.innerHTML = "";

  packages.forEach((pkg) => {
    const isRecommended = pkg.key === recommendedPlan;

    const card = document.createElement("article");
    card.className = `result-card ${isRecommended ? "recommended" : ""}`;

    card.innerHTML = `
      ${isRecommended ? `<div class="badge">Recommended</div>` : ""}
      <div class="plan-label">${pkg.label}</div>
      <div class="plan-title">${pkg.title}</div>
      <div class="plan-price">RM${pkg.price}<span>/month</span></div>
      <div class="plan-desc">${pkg.description}</div>
      <ul class="plan-list">
        ${pkg.benefits.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
      <a class="whatsapp-btn" href="${createWhatsAppLink(data, pkg)}" target="_blank" rel="noopener noreferrer">
        Continue on WhatsApp
      </a>
    `;

    resultsGrid.appendChild(card);
  });
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}