const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    document.body.classList.toggle("nav-open", isOpen);
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (navMenu?.classList.contains("open")) {
      navMenu.classList.remove("open");
      navToggle?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    }
  });
});

const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

smoothScrollLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");
    if (!hash || hash === "#") return;
    const target = document.querySelector(hash);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", hash);
  });
});

const sections = document.querySelectorAll("section[id]");
const navMap = new Map();
navLinks.forEach((link) => {
  const href = link.getAttribute("href");
  if (href && href.startsWith("#")) {
    navMap.set(href.slice(1), link);
  }
});

const setActiveLink = (id) => {
  navMap.forEach((link, key) => {
    link.classList.toggle("active", key === id);
    if (key === id) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

if (sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    {
      rootMargin: "-30% 0px -55% 0px",
      threshold: 0.1,
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

const revealElements = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion) {
  revealElements.forEach((el) => el.classList.add("is-visible"));
} else if (revealElements.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
}

const contactForm = document.getElementById("contact-form");
const toast = document.getElementById("toast");

const showToast = (message, isError = false) => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.toggle("is-error", isError);
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), isError ? 3000 : 2500);
};

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const honeypot = contactForm.querySelector('input[name="_gotcha"]');
    if (honeypot && honeypot.value.trim().length) {
      return;
    }

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error("Formspree error");
      }

      contactForm.reset();
      showToast("Message sent");
    } catch (error) {
      showToast("Something went wrong. Please try again.", true);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Send Message";
      }
    }
  });
}

const solarCanvas = document.getElementById("solar-canvas");
if (solarCanvas) {
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const planetConfig = [
    {
      name: "mercury",
      size: 4.2,
      period: 88,
      colors: ["#e2e8f0", "#94a3b8", "#64748b"],
      glow: "rgba(148,163,184,0.35)",
    },
    {
      name: "venus",
      size: 6,
      period: 225,
      colors: ["#fde68a", "#f59e0b", "#c2410c"],
      glow: "rgba(245,158,11,0.35)",
    },
    {
      name: "earth",
      size: 7.2,
      period: 365,
      colors: ["#93c5fd", "#3b82f6", "#1d4ed8"],
      glow: "rgba(59,130,246,0.45)",
      texture: "radial-gradient(circle at 65% 35%, rgba(34,197,94,0.7), transparent 45%)",
    },
    {
      name: "mars",
      size: 5.4,
      period: 687,
      colors: ["#fecaca", "#f87171", "#b91c1c"],
      glow: "rgba(248,113,113,0.35)",
    },
    {
      name: "jupiter",
      size: 11,
      period: 4333,
      colors: ["#fde68a", "#fb923c", "#9a3412"],
      glow: "rgba(251,146,60,0.35)",
      texture: "repeating-linear-gradient(90deg, rgba(251,146,60,0.5) 0 6px, rgba(253,186,116,0.5) 6px 12px)",
    },
    {
      name: "saturn",
      size: 9.6,
      period: 10759,
      colors: ["#fde68a", "#facc15", "#a16207"],
      glow: "rgba(250,204,21,0.3)",
    },
    {
      name: "uranus",
      size: 8.4,
      period: 30687,
      colors: ["#cffafe", "#22d3ee", "#0e7490"],
      glow: "rgba(34,211,238,0.3)",
    },
    {
      name: "neptune",
      size: 8.2,
      period: 60190,
      colors: ["#bfdbfe", "#2563eb", "#1e3a8a"],
      glow: "rgba(37,99,235,0.3)",
    },
  ];

  const baseSpeed = 0.6;

  const system = {
    center: { x: 0, y: 0 },
    radii: [],
    planets: [],
    animationId: null,
    lastTime: 0,
  };

  const createRing = (radius) => {
    const ring = document.createElement("div");
    ring.className = "solar-ring";
    ring.style.width = `${radius * 2}px`;
    ring.style.height = `${radius * 2}px`;
    ring.style.left = `${system.center.x - radius}px`;
    ring.style.top = `${system.center.y - radius}px`;
    return ring;
  };

  const createPlanet = (config, radius) => {
    const planet = document.createElement("div");
    planet.className = `solar-planet solar-planet--${config.name}`;
    planet.style.setProperty("--planet-size", `${config.size}px`);
    planet.style.setProperty("--planet-color-1", config.colors[0]);
    planet.style.setProperty("--planet-color-2", config.colors[1]);
    planet.style.setProperty("--planet-color-3", config.colors[2]);
    planet.style.setProperty("--planet-glow", config.glow);
    if (config.texture) {
      planet.style.setProperty("--planet-texture", config.texture);
    }
    solarCanvas.appendChild(planet);
    return {
      ...config,
      radius,
      angle: Math.random() * Math.PI * 2,
      speed: baseSpeed * Math.sqrt(365 / config.period),
      el: planet,
    };
  };

  const buildSystem = () => {
    solarCanvas.innerHTML = "";

    const rect = solarCanvas.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height);
    const ringCount = planetConfig.length;
    const maxRadius = size / 2 - 20;
    let gap = Math.floor((maxRadius - 80) / (ringCount - 1));
    gap = Math.max(22, Math.min(32, gap));
    const minRadius = maxRadius - gap * (ringCount - 1);
    system.gap = gap;

    system.center = { x: rect.width / 2, y: rect.height / 2 };
    system.radii = planetConfig.map((_, index) => minRadius + gap * index);

    system.radii.forEach((radius) => {
      solarCanvas.appendChild(createRing(radius));
    });

    const sun = document.createElement("div");
    sun.className = "solar-sun";
    sun.style.left = `${system.center.x}px`;
    sun.style.top = `${system.center.y}px`;
    solarCanvas.appendChild(sun);

    system.planets = planetConfig.map((config, index) => createPlanet(config, system.radii[index]));

    updatePositions(0, true);
  };

  const updatePositions = (delta, forceStatic = false) => {
    const { x: cx, y: cy } = system.center;
    system.planets.forEach((planet) => {
      if (!forceStatic) {
        planet.angle += planet.speed * delta;
      }
      const x = cx + Math.cos(planet.angle) * planet.radius;
      const y = cy + Math.sin(planet.angle) * planet.radius;
      planet.el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    });
  };

  const animate = (time) => {
    if (motionQuery.matches) return;
    if (!system.lastTime) system.lastTime = time;
    const delta = (time - system.lastTime) / 1000;
    system.lastTime = time;
    updatePositions(delta);
    system.animationId = requestAnimationFrame(animate);
  };

  const startAnimation = () => {
    if (system.animationId) cancelAnimationFrame(system.animationId);
    system.lastTime = 0;
    if (motionQuery.matches) {
      updatePositions(0, true);
      return;
    }
    system.animationId = requestAnimationFrame(animate);
  };

  buildSystem();
  startAnimation();

  let resizeTimer;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      buildSystem();
      startAnimation();
    }, 160);
  });

  motionQuery.addEventListener("change", () => {
    startAnimation();
  });
}
