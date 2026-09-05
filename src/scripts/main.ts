export {};

document.documentElement.classList.add("motion-ready");

const header = document.querySelector<HTMLElement>(".site-header");
const menuToggle = document.querySelector<HTMLButtonElement>(".menu-toggle");
const navPanel = document.querySelector<HTMLElement>(".nav-panel");
const navLinks = document.querySelectorAll<HTMLAnchorElement>(".nav-menu a, .nav-cta");
const sectionLinks = document.querySelectorAll<HTMLAnchorElement>(".nav-menu a[href^='#']");
const revealElements = document.querySelectorAll<HTMLElement>(".reveal");
const revealGroups = document.querySelectorAll<HTMLElement>(".reveal-group");
const quoteForm = document.querySelector<HTMLFormElement>("#quote-form");
const formStatus = document.querySelector<HTMLElement>("#form-status");
const heroPreview = document.querySelector<HTMLElement>("[data-hero-preview]");
const businessEmail = "nickboyce.tech@icloud.com";
let ticking = false;

function setHeaderState() {
  if (!header) {
    return;
  }

  header.classList.toggle("scrolled", window.scrollY > 10);
  document.documentElement.style.setProperty("--hero-shift", `${Math.min(window.scrollY, 420)}px`);
}

function closeMenu() {
  if (!menuToggle || !navPanel) {
    return;
  }

  document.body.classList.remove("menu-open");
  menuToggle.classList.remove("is-active");
  menuToggle.setAttribute("aria-expanded", "false");
  navPanel.classList.remove("is-open");
}

function setActiveNavLink() {
  const sections = [...sectionLinks]
    .map((link) => document.querySelector<HTMLElement>(link.getAttribute("href") ?? ""))
    .filter((section): section is HTMLElement => Boolean(section));

  let currentSection: HTMLElement | undefined;

  for (let index = sections.length - 1; index >= 0; index -= 1) {
    const rect = sections[index].getBoundingClientRect();

    if (rect.top <= 150) {
      currentSection = sections[index];
      break;
    }
  }

  sectionLinks.forEach((link) => {
    link.classList.toggle("is-active", currentSection?.id === link.getAttribute("href")?.slice(1));
  });
}

revealGroups.forEach((group) => {
  const children = group.querySelectorAll<HTMLElement>(".reveal");

  children.forEach((child, index) => {
    child.style.setProperty("--reveal-delay", `${Math.min(index * 90, 360)}ms`);
  });
});

if (menuToggle && navPanel) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navPanel.classList.toggle("is-open");

    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.classList.toggle("is-active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

function getField(fieldName: string) {
  if (!quoteForm) {
    return null;
  }

  const field = quoteForm.elements.namedItem(fieldName);

  return field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement
    ? field
    : null;
}

function getFieldValue(fieldName: string) {
  return getField(fieldName)?.value.trim() ?? "";
}

function setFieldState(field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, isValid: boolean) {
  field.classList.toggle("is-invalid", !isValid);
  field.setAttribute("aria-invalid", String(!isValid));
}

function validateQuoteForm() {
  const requiredFields = ["name", "email", "business", "service", "message"];
  let firstInvalidField: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | undefined;

  requiredFields.forEach((fieldName) => {
    const field = getField(fieldName);

    if (!field) {
      return;
    }

    const isValid = field.checkValidity();
    setFieldState(field, isValid);

    if (!isValid && !firstInvalidField) {
      firstInvalidField = field;
    }
  });

  return firstInvalidField;
}

const INQUIRY_API_URL = import.meta.env.PUBLIC_INQUIRY_API_URL || "/api/inquiry";
const formStartedAt = Date.now();
const submitButton = quoteForm?.querySelector<HTMLButtonElement>("button[type='submit']") ?? null;
const submitButtonLabel = submitButton?.querySelector<HTMLElement>("[data-btn-label]") ?? null;
let isSubmitting = false;

function buildInquiryPayload() {
  return {
    name: getFieldValue("name"),
    email: getFieldValue("email"),
    business: getFieldValue("business"),
    service: getFieldValue("service"),
    budget: getFieldValue("budget") || "Not selected",
    timeline: getFieldValue("timeline") || "Not selected",
    message: getFieldValue("message"),
    website: getFieldValue("website"),
    startedAt: formStartedAt,
  };
}

function setFormStatus(message: string, kind: "success" | "error" | "") {
  if (!formStatus) {
    return;
  }

  formStatus.textContent = message;
  formStatus.classList.toggle("is-error", kind === "error");
  formStatus.classList.toggle("is-success", kind === "success");
}

function setSubmitting(submitting: boolean) {
  isSubmitting = submitting;

  if (submitButton) {
    submitButton.disabled = submitting;
  }

  if (submitButtonLabel) {
    submitButtonLabel.textContent = submitting ? "Sending..." : "Send Inquiry";
  }
}

if (quoteForm && formStatus) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const firstInvalidField = validateQuoteForm();

    if (firstInvalidField) {
      setFormStatus("Please complete the required fields before sending your inquiry.", "error");
      firstInvalidField.focus();
      return;
    }

    setSubmitting(true);
    setFormStatus("Sending your inquiry to ACC...", "");

    fetch(INQUIRY_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildInquiryPayload()),
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));

        if (response.ok && data?.ok) {
          setFormStatus(
            `Thanks — your inquiry was sent. ACC will follow up at the email you provided, usually within one business day.`,
            "success"
          );
          quoteForm.reset();
          window.dispatchEvent(
            new CustomEvent("lead_submit_success", { detail: { source: "contact-form" } })
          );
          return;
        }

        if (response.status === 429) {
          setFormStatus(
            typeof data?.error === "string"
              ? data.error
              : "Too many requests. Please wait a moment and try again.",
            "error"
          );
          return;
        }

        if (data?.fieldErrors && typeof data.fieldErrors === "object") {
          Object.keys(data.fieldErrors).forEach((fieldName) => {
            const field = getField(fieldName);
            if (field) {
              setFieldState(field, false);
            }
          });
        }

        setFormStatus(
          typeof data?.error === "string"
            ? data.error
            : `Something went wrong. Please try again or email us directly at ${businessEmail}.`,
          "error"
        );
      })
      .catch(() => {
        setFormStatus(
          `We could not reach ACC's server. Please check your connection and try again, or email us directly at ${businessEmail}.`,
          "error"
        );
      })
      .finally(() => {
        setSubmitting(false);
      });
  });

  quoteForm.addEventListener("input", (event) => {
    if (!(event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLTextAreaElement)) {
      return;
    }

    setFieldState(event.target, event.target.checkValidity());

    if (formStatus.classList.contains("is-error")) {
      setFormStatus("", "");
    }
  });

  quoteForm.addEventListener("change", (event) => {
    if (!(event.target instanceof HTMLSelectElement)) {
      return;
    }

    setFieldState(event.target, event.target.checkValidity());

    if (formStatus.classList.contains("is-error")) {
      setFormStatus("", "");
    }
  });
}

function initHeroPreview() {
  if (!heroPreview) {
    return;
  }

  const slides = [...heroPreview.querySelectorAll<HTMLElement>("[data-hero-slide]")];

  if (slides.length <= 1) {
    return;
  }

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeIndex = 0;
  let rotation: number | undefined;

  function setSlide(nextIndex: number) {
    activeIndex = nextIndex;

    slides.forEach((slide, index) => {
      const isActive = index === activeIndex;

      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));

      if (slide instanceof HTMLAnchorElement) {
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

if ("IntersectionObserver" in window) {
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
} else {
  revealElements.forEach((element) => {
    element.classList.add("is-visible");
  });
}

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
