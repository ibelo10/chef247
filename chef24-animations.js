// chef24-animations.js

class Chef24Animations {
  constructor() {
    this.initialize();
  }

  initialize() {
    this.setupLoadingSpinner();
    this.setupFloatingIcons();
    this.setupParallax();
    this.setupScrollReveal();
    this.setupThemeToggle();
    this.setupNavScroll();
  }

  setupLoadingSpinner() {
    const spinner = document.querySelector(".loading-spinner");
    if (spinner) {
      window.addEventListener("load", () => {
        spinner.style.opacity = "0";
        setTimeout(() => {
          spinner.style.display = "none";
        }, 500);
      });
    }
  }

  setupFloatingIcons() {
    // Icons for floating animation
    const icons = [
      "🌶️",
      "",
      "🥘",
      "♪",
      "♫",
      "🎵",
      "🎶",
      "🍽️",
      "👨‍🍳",
      "🥄",
      "🍴",
      "🥂",
      "🍷",

      "🎭",
      "🎪",
      "🎻",
      "🎺",
      "🪗",
    ];

    setInterval(() => this.createFloatingIcon(icons), 2000);
  }

  createFloatingIcon(icons) {
    const icon = document.createElement("div");
    icon.className = "floating-icon";
    icon.textContent = icons[Math.floor(Math.random() * icons.length)];

    // Random size between 20px and 32px
    const size = Math.random() * (32 - 20) + 20;
    icon.style.fontSize = `${size}px`;

    // Random position from left
    icon.style.left = `${Math.random() * window.innerWidth}px`;

    // Random animation duration between 3s and 6s
    icon.style.animationDuration = `${Math.random() * (6 - 3) + 3}s`;

    document.getElementById("floating-icons").appendChild(icon);

    // Remove the icon after animation completes
    icon.addEventListener("animationend", () => icon.remove());
  }

  setupParallax() {
    const parallaxElements = document.querySelectorAll(".parallax-layer");

    window.addEventListener("mousemove", (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      parallaxElements.forEach((element, index) => {
        const speed = (index + 1) * 0.01;
        const x = (centerX - clientX) * speed;
        const y = (centerY - clientY) * speed;
        element.style.transform = `translate(${x}px, ${y}px)`;
      });
    });
  }

  setupScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal");
    const revealOffset = 150;

    const revealOnScroll = () => {
      revealElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;

        if (
          elementTop < window.innerHeight - revealOffset &&
          elementBottom > 0
        ) {
          element.classList.add("active");
        }
      });
    };

    window.addEventListener("scroll", this.debounce(revealOnScroll, 15));
    window.addEventListener("resize", this.debounce(revealOnScroll, 15));
    revealOnScroll(); // Initial check
  }

  setupThemeToggle() {
    const themeToggle = document.createElement("button");
    themeToggle.className = "theme-toggle";
    themeToggle.innerHTML = "🌙";
    themeToggle.setAttribute("aria-label", "Toggle theme");
    document.body.appendChild(themeToggle);

    // Check saved theme
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark-theme");
      themeToggle.innerHTML = "☀️";
    }

    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-theme");
      const isDark = document.body.classList.contains("dark-theme");
      themeToggle.innerHTML = isDark ? "☀️" : "🌙";
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

  setupNavScroll() {
    const nav = document.querySelector(".main-nav");
    let lastScroll = 0;

    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll <= 0) {
        nav.classList.remove("scroll-up");
        return;
      }

      if (
        currentScroll > lastScroll &&
        !nav.classList.contains("scroll-down")
      ) {
        nav.classList.remove("scroll-up");
        nav.classList.add("scroll-down");
      } else if (
        currentScroll < lastScroll &&
        nav.classList.contains("scroll-down")
      ) {
        nav.classList.remove("scroll-down");
        nav.classList.add("scroll-up");
      }

      lastScroll = currentScroll;
    });
  }

  // Utility function for debouncing
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Initialize animations on DOM load
document.addEventListener("DOMContentLoaded", () => {
  new Chef24Animations();
});
