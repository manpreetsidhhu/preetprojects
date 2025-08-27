document.addEventListener("DOMContentLoaded", () => {
  const projects = [
    {
      id: "spendsmart",
      title: "SpendSmart - Expense Tracker",
      description:
        "A modern expense tracking PWA built with Tailwind CSS. Features smart budgeting, expense categories, and intuitive financial management tools.",
      tags: ["tool"],
      github:
        "https://github.com/manpreetsidhhu/spendsmart",
      icon: "https://manpreet.vercel.app/preetprojects/spendsmart/images/SpendSmart.png",
    },
    {
      id: "kahaniai",
      title: "Kahani.ai - AI Storytelling",
      description:
        "An AI-powered storytelling platform where users can generate creative stories and narratives. Features interactive storytelling with Three.js animations.",
      tags: ["tool", "creative"],
      github:
        "https://github.com/manpreetsidhhu/kahani.ai-storyteller",
      icon: "https://manpreet.vercel.app/preetprojects/kahaniai/logo.PNG",
    },
    {
      id: "sumX",
      title: "SumX - Calculator",
      description:
        "A modern iPhone-inspired calculator app built with vanilla JavaScript. Features clean interface, smooth animations, full keyboard support, and responsive design.",
      tags: ["tool"],
      github:
        "https://github.com/manpreetsidhhu/sumxcalculator",
      icon: "https://manpreet.vercel.app/preetprojects/sumX/sumX.png",
    },
    {
      id: "poems",
      title: "Preet Being Poetic",
      description:
        "A personal poetry collection by Manpreet S. Sidhu. A beautiful, minimalist platform for sharing poems and creative writing with elegant typography.",
      tags: ["creative"],
      github: "https://github.com/manpreetsidhhu/poems",
      icon: "https://manpreet.vercel.app/preetprojects/poems/icon.png",
    },
    {
      id: "tictactoe",
      title: "T³ - Modern Tic-Tac-Toe",
      description:
        "A classic Tic-Tac-Toe game with modern animations, custom cursor effects, and sleek design. Features smooth gameplay and responsive interface.",
      tags: ["game"],
      github:
        "https://github.com/manpreetsidhhu/tic-tac-toe",
      icon: "https://manpreet.vercel.app/preetprojects/tictactoe/tic-tac-toe2.png",
    },
  ];

  const projectGallery = document.getElementById("project-gallery");
  const searchBar = document.getElementById("search-bar");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCountEl = document.getElementById("project-count");
  const categoryCountEl = document.getElementById("category-count");
  const themeToggle = document.getElementById("theme-toggle");
  const header = document.querySelector(".header");
  const scrollToTopBtn = document.querySelector(".scroll-to-top");

  const displayProjects = (projectList) => {
    projectGallery.innerHTML = "";
    if (projectList.length === 0) {
      projectGallery.innerHTML = `<p class="no-results">No projects found. Try a different search or filter.</p>`;
      return;
    }
    projectList.forEach((project, index) => {
      const card = document.createElement("div");
      card.className = "project-card";
      card.style.animationDelay = `${index * 100}ms`;

      const tagsHTML = project.tags
        .map((tag) => `<span class="card-tag">${tag}</span>`)
        .join(" ");

      const iconHTML = project.icon
        ? `<img src="${project.icon}" alt="${project.title} icon" class="project-icon" />`
        : `<i class="fas fa-globe project-icon-fallback"></i>`;

      card.innerHTML = `
                <div class="card-content">
                    <div class="card-tags">${tagsHTML}</div>
                    <h3 class="card-title">
                        ${iconHTML}
                        ${project.title}
                    </h3>
                    <p class="card-description">${project.description}</p>
                    <div class="card-buttons">
                        <a href="/preetprojects/${project.id}/" class="card-btn btn-primary" target="_blank">Live Demo <i class="fas fa-eye"></i></a>
                        <a href="${project.github}" class="card-btn btn-secondary" target="_blank">Code <i class="fab fa-github"></i></a>
                    </div>
                </div>
                <div class="card-preview" onclick="window.open('/preetprojects/${project.id}/', '_blank')">
                    <iframe 
                        src="/preetprojects/${project.id}/" 
                        class="card-iframe" 
                        title="${project.title} Preview"
                        loading="lazy"
                        sandbox="allow-scripts allow-same-origin"
                        scrolling="no"
                        style="pointer-events: none; transform: scale(0.3); transform-origin: 0 0; width: 333%; height: 333%;"
                    ></iframe>
                    <div class="hover-button">
                        <span>Live Demo</span>
                        <i class="fas fa-external-link-alt"></i>
                    </div>
                </div>
            `;

      const iframe = card.querySelector(".card-iframe");
      const preview = card.querySelector(".card-preview");

      iframe.addEventListener("load", () => {
        setTimeout(() => {
          iframe.classList.add("loaded");
          preview.classList.add("loaded");
        }, 2000);
      });

      projectGallery.appendChild(card);
    });
  };

  let currentFilter = "all";
  let searchTerm = "";

  const filterAndSearchProjects = () => {
    let filteredProjects = projects;

    if (currentFilter !== "all") {
      filteredProjects = filteredProjects.filter((p) =>
        p.tags.includes(currentFilter)
      );
    }

    if (searchTerm) {
      filteredProjects = filteredProjects.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm)
      );
    }

    displayProjects(filteredProjects);
  };

  searchBar.addEventListener("keyup", (e) => {
    searchTerm = e.target.value.toLowerCase().trim();
    filterAndSearchProjects();
  });

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      filterAndSearchProjects();
    });
  });

  const setInitialTheme = () => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.className = savedTheme + "-mode";
    if (themeToggle) {
      themeToggle.className =
        savedTheme === "light" ? "fas fa-moon" : "fas fa-sun";
    }
  };

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = document.body.classList.contains("dark-mode");
      if (isDark) {
        document.body.className = "light-mode";
        themeToggle.className = "fas fa-moon";
        localStorage.setItem("theme", "light");
      } else {
        document.body.className = "dark-mode";
        themeToggle.className = "fas fa-sun";
        localStorage.setItem("theme", "dark");
      }
    });
  }

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
      scrollToTopBtn.classList.add("visible");
    } else {
      header.classList.remove("scrolled");
      scrollToTopBtn.classList.remove("visible");
    }
  });

  const updateStats = () => {
    projectCountEl.textContent = projects.length;
    const uniqueCategories = new Set(projects.flatMap((p) => p.tags));
    categoryCountEl.textContent = uniqueCategories.size;
  };

  setInitialTheme();
  updateStats();
  displayProjects(projects);
});
