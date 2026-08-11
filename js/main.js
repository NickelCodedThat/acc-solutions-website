const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navPanel = document.querySelector(".nav-panel");
const navLinks = document.querySelectorAll(".nav-menu a, .nav-cta");
const sectionLinks = document.querySelectorAll(".nav-menu a[href^='#']");
const revealElements = document.querySelectorAll(".reveal");
const revealGroups = document.querySelectorAll(".reveal-group");
const quoteForm = document.querySelector("#quote-form");
const formStatus = document.querySelector("#form-status");
const heroPreview = document.querySelector("[data-hero-preview]");
const businessEmail = "nickboyce.tech@icloud.com";
let ticking = false;

function setHeaderState() {
  header.classList.toggle("scrolled", window.scrollY > 10);
  document.documentElement.style.setProperty("--hero-shift", `${Math.min(window.scrollY, 420)}px`);
}

function closeMenu() {
  document.body.classList.remove("menu-open");
  menuToggle.classList.remove("is-active");
  menuToggle.setAttribute("aria-expanded", "false");
  navPanel.classList.remove("is-open");
}

function setActiveNavLink() {
  const sections = [...sectionLinks]
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  let currentSection;

  for (let index = sections.length - 1; index >= 0; index -= 1) {
    const rect = sections[index].getBoundingClientRect();

    if (rect.top <= 150) {
      currentSection = sections[index];
      break;
    }
  }

  sectionLinks.forEach((link) => {
    link.classList.toggle("is-active", currentSection?.id === link.getAttribute("href").slice(1));
  });
}

revealGroups.forEach((group) => {
  const children = group.querySelectorAll(".reveal");

  children.forEach((child, index) => {
    child.style.setProperty("--reveal-delay", `${Math.min(index * 90, 360)}ms`);
  });
});

menuToggle.addEventListener("click", () => {
  const isOpen = navPanel.classList.toggle("is-open");

  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.classList.toggle("is-active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

function getFieldValue(fieldName) {
  return quoteForm.elements[fieldName].value.trim();
}

function setFieldState(field, isValid) {
  field.classList.toggle("is-invalid", !isValid);
  field.setAttribute("aria-invalid", String(!isValid));
}

function validateQuoteForm() {
  const requiredFields = ["name", "email", "business", "service", "message"];
  let firstInvalidField;

  requiredFields.forEach((fieldName) => {
    const field = quoteForm.elements[fieldName];
    const isValid = field.checkValidity();

    setFieldState(field, isValid);

    if (!isValid && !firstInvalidField) {
      firstInvalidField = field;
    }
  });

  return firstInvalidField;
}

function buildQuoteEmail() {
  const subject = `ACC Solutions Inquiry - ${getFieldValue("business") || "Business Improvement Project"}`;
  const bodyLines = [
    "New business improvement inquiry from accsolutions.dev",
    "",
    `Name: ${getFieldValue("name")}`,
    `Email: ${getFieldValue("email")}`,
    `Business: ${getFieldValue("business")}`,
    `Primary Need: ${getFieldValue("service")}`,
    `Estimated Budget: ${getFieldValue("budget") || "Not selected"}`,
    `Ideal Timeline: ${getFieldValue("timeline") || "Not selected"}`,
    "",
    "Business Context:",
    getFieldValue("message"),
  ];

  return `mailto:${businessEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
}

if (quoteForm) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const firstInvalidField = validateQuoteForm();

    if (firstInvalidField) {
      formStatus.textContent = "Please complete the required fields before preparing your quote email.";
      formStatus.classList.add("is-error");
      firstInvalidField.focus();
      return;
    }

    formStatus.textContent = "Opening your email app with the inquiry prepared.";
    formStatus.classList.remove("is-error");
    window.location.href = buildQuoteEmail();
  });

  quoteForm.addEventListener("input", (event) => {
    if (!event.target.matches("input, select, textarea")) {
      return;
    }

    setFieldState(event.target, event.target.checkValidity());

    if (formStatus.classList.contains("is-error")) {
      formStatus.textContent = "";
      formStatus.classList.remove("is-error");
    }
  });

  quoteForm.addEventListener("change", (event) => {
    if (!event.target.matches("select")) {
      return;
    }

    setFieldState(event.target, event.target.checkValidity());

    if (formStatus.classList.contains("is-error")) {
      formStatus.textContent = "";
      formStatus.classList.remove("is-error");
    }
  });
}

function initHeroPreview() {
  if (!heroPreview) {
    return;
  }

  const slides = [...heroPreview.querySelectorAll("[data-hero-slide]")];

  if (slides.length <= 1) {
    return;
  }

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeIndex = 0;
  let rotation;

  function setSlide(nextIndex) {
    activeIndex = nextIndex;

    slides.forEach((slide, index) => {
      const isActive = index === activeIndex;

      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));

      if (slide.matches("a")) {
        slide.tabIndex = isActive ? 0 : -1;
      }
    });
  }

  function stopRotation() {
    window.clearInterval(rotation);
  }

  function startRotation() {
    stopRotation();

    if (motionQuery.matches) {
      return;
    }

    rotation = window.setInterval(() => {
      setSlide((activeIndex + 1) % slides.length);
    }, 5000);
  }

  setSlide(0);
  startRotation();

  heroPreview.addEventListener("pointerenter", stopRotation);
  heroPreview.addEventListener("pointerleave", startRotation);
  heroPreview.addEventListener("focusin", stopRotation);
  heroPreview.addEventListener("focusout", startRotation);

  motionQuery.addEventListener("change", () => {
    setSlide(0);
    startRotation();
  });
}

initHeroPreview();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -48px 0px",
  }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});

setHeaderState();
setActiveNavLink();
window.addEventListener("scroll", () => {
  if (ticking) {
    return;
  }

  window.requestAnimationFrame(() => {
    setHeaderState();
    setActiveNavLink();
    ticking = false;
  });

  ticking = true;
}, { passive: true });
