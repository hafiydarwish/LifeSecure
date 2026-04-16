const WA_PHONE = "60149449065";

const nav = document.getElementById("mainNav");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

const heroStartBtn = document.getElementById("heroStartBtn");
const heroName = document.getElementById("heroName");
const heroDob = document.getElementById("heroDob");
const heroGender = document.getElementById("heroGender");
const heroBudget = document.getElementById("heroBudget");

const recForm = document.getElementById("recForm");
const resultsModal = document.getElementById("resultsModal");
const resultCards = document.getElementById("resultCards");
const modalClose = document.getElementById("modalClose");
const waFloat = document.getElementById("waFloat");

const fieldIds = [
  "fName",
  "fDob",
  "fGender",
  "fSmoker",
  "fMarital",
  "fIncome",
  "fBudget",
  "fGoal"
];

document.addEventListener("DOMContentLoaded", () => {
  initAOS();
  initSwiper();
  initNav();
  initFAQ();
  initCounters();
  initHeroStart();
  initPlanButtons();
  initModal();
  initWhatsappFloat();
  initForm();
  initDatePickers();
});

function initAOS() {
  if (window.AOS) {
    AOS.init({
      once: true,
      duration: 700,
      easing: "ease-out-quad"
    });
  }
}

function initSwiper() {
  if (window.Swiper) {
    new Swiper(".mySwiper", {
      slidesPerView: 1,
      spaceBetween: 20,
      pagination: {
        el: ".swiper-pagination",
        clickable: true
      },
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      },
      autoplay: {
        delay: 4000,
        disableOnInteraction: false
      },
      loop: true
    });
  }
}

function initNav() {
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
  });

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
    });
  });
}

function initFAQ() {
  document.querySelectorAll(".faq-q").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const wasOpen = item.classList.contains("open");

      document.querySelectorAll(".faq-item").forEach((faq) => {
        faq.classList.remove("open");
        const answer = faq.querySelector(".faq-a");
        if (answer) answer.style.maxHeight = null;
      });

      if (!wasOpen) {
        item.classList.add("open");
        const answer = item.querySelector(".faq-a");
        if (answer) answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });
}

function initCounters() {
  const countEls = document.querySelectorAll(".count-up");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCountUp(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  countEls.forEach((el) => observer.observe(el));
}

function animateCountUp(el) {
  const target = Number(el.dataset.target || 0);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current).toLocaleString();

    if (current >= target) {
      clearInterval(timer);
    }
  }, 16);
}

function initDatePickers() {
  [heroDob, document.getElementById("fDob")].forEach((input) => {
    if (!input) return;

    input.addEventListener("focus", () => {
      if (typeof input.showPicker === "function") {
        input.showPicker();
      }
    });

    input.addEventListener("click", () => {
      if (typeof input.showPicker === "function") {
        input.showPicker();
      }
    });
  });
}

function calculateAgeFromDob(dob) {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

function initHeroStart() {
  heroStartBtn.addEventListener("click", () => {
    const formName = document.getElementById("fName");
    const formDob = document.getElementById("fDob");
    const formGender = document.getElementById("fGender");
    const formBudget = document.getElementById("fBudget");

    if (heroName.value.trim()) formName.value = heroName.value.trim();
    if (heroDob.value) formDob.value = heroDob.value;
    if (heroGender.value) formGender.value = heroGender.value;
    if (heroBudget.value) formBudget.value = heroBudget.value;

    document.getElementById("recommend").scrollIntoView({ behavior: "smooth" });
  });
}

function initPlanButtons() {
  document.querySelectorAll(".plan-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const tier = button.dataset.tier;
      const budgetMap = {
        Basic: "100",
        Standard: "300",
        Premium: "400"
      };

      document.getElementById("fBudget").value = budgetMap[tier] || "";
      document.getElementById("recommend").scrollIntoView({ behavior: "smooth" });
    });
  });
}

function initModal() {
  modalClose.addEventListener("click", closeResultsModal);

  resultsModal.addEventListener("click", (e) => {
    if (e.target === resultsModal) {
      closeResultsModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && resultsModal.classList.contains("open")) {
      closeResultsModal();
    }
  });
}

function openResultsModal() {
  resultsModal.classList.add("open");
  resultsModal.setAttribute("aria-hidden", "false");
}

function closeResultsModal() {
  resultsModal.classList.remove("open");
  resultsModal.setAttribute("aria-hidden", "true");
}

function initWhatsappFloat() {
  waFloat.addEventListener("click", () => {
    window.open(`https://wa.me/${WA_PHONE}`, "_blank", "noopener,noreferrer");
  });
}

function initForm() {
  recForm.addEventListener("submit", (e) => {
    e.preventDefault();

    clearErrors();

    const data = {
      name: sanitizeText(document.getElementById("fName").value),
      dob: document.getElementById("fDob").value,
      gender: sanitizeText(document.getElementById("fGender").value),
      smoker: sanitizeText(document.getElementById("fSmoker").value),
      marital: sanitizeText(document.getElementById("fMarital").value),
      income: sanitizeText(document.getElementById("fIncome").value),
      budget: sanitizeNumber(document.getElementById("fBudget").value),
      goal: sanitizeText(document.getElementById("fGoal").value)
    };

    data.age = calculateAgeFromDob(data.dob);

    const validation = validateFormData(data);

    if (!validation.valid) {
      showValidationErrors(validation.errors);
      showToast("⚠️ Please complete all required fields correctly.", "error");
      return;
    }

    try {
      const recommended = getRecommendedPlan(
        data.age,
        data.budget,
        data.income,
        data.smoker,
        data.marital,
        data.goal
      );

      const packages = buildPackages(
        data.age,
        data.budget,
        data.income,
        data.smoker,
        data.marital,
        data.goal
      );

      renderResultCards(data, packages, recommended);
      openResultsModal();
      showToast(`✅ ${data.name}, your plan is ready!`, "success");
    } catch (error) {
      console.error("Recommendation error:", error);
      showToast("Something went wrong while generating your recommendation.", "error");
    }
  });
}

function validateFormData(data) {
  const errors = {};

  if (!data.name || data.name.length < 2) {
    errors.fName = "Please enter your full name.";
  }

  if (!data.dob) {
    errors.fDob = "Please select your date of birth.";
  } else if (Number.isNaN(data.age) || data.age < 18 || data.age > 100) {
    errors.fDob = "Age must be between 18 and 100.";
  }

  if (!data.gender) {
    errors.fGender = "Please select your gender.";
  }

  if (!data.smoker) {
    errors.fSmoker = "Please select your smoking status.";
  }

  if (!data.marital) {
    errors.fMarital = "Please select your marital status.";
  }

  if (!data.income) {
    errors.fIncome = "Please select your monthly income range.";
  }

  if (!data.budget || Number.isNaN(data.budget)) {
    errors.fBudget = "Please select your monthly budget.";
  }

  if (!data.goal) {
    errors.fGoal = "Please select your protection goal.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

function showValidationErrors(errors) {
  Object.entries(errors).forEach(([fieldId, message]) => {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(`${fieldId}Error`);

    if (field) field.classList.add("invalid");
    if (errorEl) errorEl.textContent = message;
  });
}

function clearErrors() {
  fieldIds.forEach((id) => {
    const field = document.getElementById(id);
    const errorEl = document.getElementById(`${id}Error`);

    if (field) field.classList.remove("invalid");
    if (errorEl) errorEl.textContent = "";
  });
}

function sanitizeText(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function sanitizeNumber(value) {
  const cleaned = String(value || "").replace(/[^\d]/g, "");
  return cleaned ? Number(cleaned) : NaN;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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
    100: "RM50 – RM120",
    180: "RM120 – RM220",
    300: "RM220 – RM380",
    400: "RM380+"
  };
  return map[value] || `RM${value}`;
}

function getRecommendedPlan(age, budget, income, smoker, marital, goal) {
  let recommended = "Standard";

  if (income === "1800-2200" || income === "2200-3800") {
    recommended = budget <= 180 ? "Basic" : "Standard";
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

  if (age >= 45 && recommended === "Basic") {
    recommended = "Standard";
  }

  return recommended;
}

function buildPackages(age, budget, income, smoker, marital, goal) {
  const smokerLoad = smoker === "Yes" ? 30 : 0;
  const ageLoad = age >= 45 ? 45 : age >= 35 ? 20 : 0;
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

  return [
    {
      key: "Basic",
      label: "Basic",
      price: Math.round(Math.max(95, budget - 15 + smokerLoad / 2 + ageLoad / 2)),
      desc: "Essential protection with a lighter monthly commitment.",
      features: [
        "Starter medical protection",
        "Lower monthly commitment",
        "Suitable for budget-conscious individuals"
      ]
    },
    {
      key: "Standard",
      label: "Standard",
      price: Math.round(Math.max(180, budget + smokerLoad + ageLoad + goalLoad / 2 + incomeLoad / 4)),
      desc: "A balanced option for stronger protection while staying practical monthly.",
      features: [
        "Balanced medical and life coverage",
        "Good fit for working adults",
        "Better long-term protection value"
      ]
    },
    {
      key: "Premium",
      label: "Premium",
      price: Math.round(Math.max(300, budget + 90 + smokerLoad + ageLoad + familyLoad + goalLoad + incomeLoad / 2)),
      desc: "Higher protection with broader family-focused and long-term benefits.",
      features: [
        "Higher overall protection",
        "More complete long-term security",
        "Suitable for family and wealth planning"
      ]
    }
  ];
}

function buildWhatsAppLink(data, pkg) {
  const message =
    `Hi, I completed the LifeSecure recommendation form.\n\n` +
    `Name: ${data.name}\n` +
    `Date of Birth: ${data.dob}\n` +
    `Age: ${data.age}\n` +
    `Gender: ${data.gender}\n` +
    `Smoker: ${data.smoker}\n` +
    `Marital Status: ${data.marital}\n` +
    `Monthly Income: ${formatIncomeLabel(data.income)}\n` +
    `Monthly Budget: ${formatBudgetLabel(data.budget)}\n` +
    `Protection Goal: ${data.goal}\n` +
    `Interested Package: ${pkg.label}\n` +
    `Estimated Contribution: RM${pkg.price}/month\n\n` +
    `I would like to know more. Please assist me.`;

  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(message)}`;
}

function renderResultCards(data, packages, recommended) {
  resultCards.innerHTML = "";

  packages.forEach((pkg) => {
    const isRecommended = pkg.key === recommended;
    const card = document.createElement("div");
    card.className = `result-card${isRecommended ? " rec" : ""}`;

    card.innerHTML = `
      ${isRecommended ? `<div class="rec-tag">Recommended</div>` : ""}
      <div class="r-name">${escapeHtml(pkg.label)}</div>
      <div class="r-price">RM ${escapeHtml(pkg.price)}<span>/month</span></div>
      <div class="r-desc">${escapeHtml(pkg.desc)}</div>
      <ul>${pkg.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}</ul>
      <a class="wa-link" href="${buildWhatsAppLink(data, pkg)}" target="_blank" rel="noopener noreferrer">
        💬 Chat on WhatsApp
      </a>
    `;

    resultCards.appendChild(card);
  });
}

function showToast(message, type = "success") {
  if (!window.Toastify) return;

  const successBg = "linear-gradient(135deg,#ff4ccb,#b14cff)";
  const errorBg = "linear-gradient(135deg,#f5365c,#f56036)";

  Toastify({
    text: message,
    duration: 3200,
    gravity: "top",
    position: "center",
    stopOnFocus: true,
    style: {
      background: type === "success" ? successBg : errorBg,
      borderRadius: "999px",
      fontFamily: "Inter, sans-serif",
      fontWeight: "700"
    }
  }).showToast();
}