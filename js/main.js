const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const revealElements = document.querySelectorAll(".reveal");

function setHeaderState() {
  header.classList.toggle("scrolled", window.scrollY > 10);
}

function closeMenu() {
  document.body.classList.remove("menu-open");
  menuToggle.classList.remove("is-active");
  menuToggle.setAttribute("aria-expanded", "false");
  navMenu.classList.remove("is-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("is-open");

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
    threshold: 0.16,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});

setHeaderState();
window.addEventListener("scroll", setHeaderState);
