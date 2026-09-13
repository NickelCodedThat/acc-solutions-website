export {};

const ENTRY_DURATION = 5400;
const SKIP_DURATION = 260;
const root = document.documentElement;
const entry = document.querySelector<HTMLElement>("[data-cinematic-entry]");

if (entry && root.classList.contains("acc-entry-pending")) {
  const activeEntry = entry;
  const skipButton = activeEntry.querySelector<HTMLButtonElement>("[data-entry-skip]");
  const pageRegions = [
    document.querySelector<HTMLElement>("header"),
    document.querySelector<HTMLElement>("main"),
    document.querySelector<HTMLElement>("footer"),
  ].filter((region): region is HTMLElement => Boolean(region));
  let completionTimer = 0;
  let isComplete = false;

  pageRegions.forEach((region) => {
    region.inert = true;
  });

  root.classList.add("acc-entry-active");

  function restorePage(shouldMoveFocus: boolean) {
    if (isComplete) {
      return;
    }

    isComplete = true;
    window.clearTimeout(completionTimer);
    root.classList.remove("acc-entry-pending", "acc-entry-active");
    activeEntry.setAttribute("aria-hidden", "true");
    document.removeEventListener("keydown", handleEntryKeydown);

    pageRegions.forEach((region) => {
      region.inert = false;
    });

    if (shouldMoveFocus) {
      document.querySelector<HTMLAnchorElement>(".site-header .logo")?.focus({ preventScroll: true });
    }
  }

  function skipEntry() {
    if (isComplete || activeEntry.classList.contains("is-skipping")) {
      return;
    }

    activeEntry.classList.add("is-skipping");
    window.clearTimeout(completionTimer);
    completionTimer = window.setTimeout(() => restorePage(true), SKIP_DURATION);
  }

  function handleEntryKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      skipEntry();
    }
  }

  skipButton?.addEventListener("click", skipEntry);
  document.addEventListener("keydown", handleEntryKeydown);

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      activeEntry.classList.add("is-playing");
      completionTimer = window.setTimeout(() => restorePage(false), ENTRY_DURATION);
    });
  });
} else if (entry) {
  entry.setAttribute("aria-hidden", "true");
}
