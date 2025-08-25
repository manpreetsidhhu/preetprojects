let allPoems = [];
let currentPoems = [];

const poemsContainer = document.getElementById("poems-container");
const searchToggleBtn = document.getElementById("search-toggle-btn");
const searchInput = document.getElementById("search-input");

const poemPopupOverlay = document.getElementById("poem-popup-overlay");
const singlePoemView = document.getElementById("single-poem-view");
const poemTitleElement = document.getElementById("poem-title");
const poemDateElement = document.getElementById("poem-date");
const poemDescriptionElement = document.getElementById("poem-description");
const backButton = document.getElementById("back-button");
const sharePoemBtn = document.getElementById("share-poem-btn");

const themeToggleBtn = document.getElementById("theme-toggle-btn");
const currentThemeIcon = document.getElementById("current-theme-icon");
const body = document.body;

const shareWebsiteBtn = document.getElementById("share-website-btn");

const themeOrder = ["light", "dark", "liquid-glass"];
let currentThemeIndex = 0;

const themeIcons = {
  light:
    '<svg class="control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>',
  dark: '<svg class="control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>',
  "liquid-glass":
    '<svg class="control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.32 0z"></path></svg>',
};

async function fetchPoems() {
  try {
    const response = await fetch("poems.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    allPoems = await response.json();
    currentPoems = [...allPoems];
    renderPoemTitles(currentPoems);
  } catch (error) {
    console.error("Could not fetch poems:", error);
    poemsContainer.innerHTML =
      '<p class="text-center text-red-500 col-span-full py-10">Failed to load poems. Please try again later.</p>';
  }
}

function renderPoemTitles(poemsToRender) {
  poemsContainer.innerHTML = "";
  if (poemsToRender.length === 0) {
    poemsContainer.innerHTML =
      '<p class="text-center text-gray-500 col-span-full py-10">No poems found matching your criteria.</p>';
    return;
  }

  poemsToRender.forEach((poem) => {
    const poemCard = document.createElement("div");
    poemCard.className = "poem-card";
    poemCard.innerHTML = `
            <h3>${poem.title}</h3>
            <p>${new Date(poem.dateCreated).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</p>
        `;
    poemCard.addEventListener("click", () => displayPoem(poem));
    poemsContainer.appendChild(poemCard);
  });
}

let currentDisplayedPoem = null;

function displayPoem(poem) {
  currentDisplayedPoem = poem;
  poemTitleElement.textContent = poem.title;
  poemDateElement.textContent = new Date(poem.dateCreated).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
  poemDescriptionElement.textContent = poem.description;

  poemPopupOverlay.classList.remove("hidden");
  poemPopupOverlay.classList.add("visible");
  poemPopupOverlay.classList.add("fade-in-overlay");

  poemPopupOverlay.addEventListener("animationend", function handler() {
    poemPopupOverlay.classList.remove("fade-in-overlay");
    poemPopupOverlay.removeEventListener("animationend", handler);
  });
}

function showPoemList() {
  poemPopupOverlay.classList.add("fade-out-overlay");

  poemPopupOverlay.addEventListener("animationend", function handler() {
    poemPopupOverlay.classList.add("hidden");
    poemPopupOverlay.classList.remove("visible");
    poemPopupOverlay.classList.remove("fade-out-overlay");
    poemPopupOverlay.removeEventListener("animationend", handler);
    currentDisplayedPoem = null;
  });
}

function filterPoems() {
  let filteredPoems = [...allPoems];

  const searchTerm = searchInput.value.toLowerCase().trim();
  if (searchTerm) {
    filteredPoems = filteredPoems.filter(
      (poem) =>
        poem.title.toLowerCase().includes(searchTerm) ||
        poem.description.toLowerCase().includes(searchTerm)
    );
  }

  currentPoems = filteredPoems;
  renderPoemTitles(currentPoems);
}

function applyTheme(themeName) {
  body.classList.remove("light-theme", "dark-theme", "liquid-glass-theme");
  body.classList.add(`${themeName}-theme`);
  localStorage.setItem("theme", themeName);

  currentThemeIcon.innerHTML = themeIcons[themeName];
}

function toggleTheme() {
  currentThemeIndex = (currentThemeIndex + 1) % themeOrder.length;
  const nextTheme = themeOrder[currentThemeIndex];
  applyTheme(nextTheme);
}

function shareContent(title, text, url) {
  if (navigator.share) {
    navigator
      .share({
        title: title,
        text: text,
        url: url,
      })
      .then(() => console.log("Successful share"))
      .catch((error) => console.log("Error sharing", error));
  } else {
    const tempInput = document.createElement("textarea");
    tempInput.value = `${title}\n\n${text}\n\n${url}`;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand("copy");
      console.log("Content copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
    document.body.removeChild(tempInput);
  }
}

searchToggleBtn.addEventListener("click", () => {
  searchInput.classList.toggle("hidden");
  searchInput.classList.toggle("visible");
  if (searchInput.classList.contains("visible")) {
    searchInput.focus();
  } else {
    searchInput.value = "";
    filterPoems();
  }
});

searchInput.addEventListener("input", () => filterPoems());

themeToggleBtn.addEventListener("click", toggleTheme);

shareWebsiteBtn.addEventListener("click", () => {
  shareContent(
    "Colors of Preet",
    "Check out this amazing poetry website!",
    window.location.href
  );
});

sharePoemBtn.addEventListener("click", () => {
  if (currentDisplayedPoem) {
    shareContent(
      currentDisplayedPoem.title,
      currentDisplayedPoem.description,
      window.location.href
    );
  }
});

backButton.addEventListener("click", showPoemList);

document.addEventListener("DOMContentLoaded", () => {
  fetchPoems();
  const savedTheme = localStorage.getItem("theme") || "light";
  currentThemeIndex = themeOrder.indexOf(savedTheme);
  if (currentThemeIndex === -1) {
    currentThemeIndex = 0;
  }
  applyTheme(themeOrder[currentThemeIndex]);
});
