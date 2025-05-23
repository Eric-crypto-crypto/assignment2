import { cars } from "../data/cars.js";
import { renderCars } from "./index.js";

let searchHTML = "";

searchHTML += `
  <div class="search-row">
    <div class="search-container">
      <input class="search-bar" type="text" placeholder="Search">
      <div class="suggestions"></div>
    </div>

    <div class="filters">
        <select>
          <option value="">All</option>
          <optgroup label="Brand">
            <option value="brand:Audi">Audi</option>
            <option value="brand:Chevrolet">Chevrolet</option>
            <option value="brand:Ford">Ford</option>
            <option value="brand:Kia">Kia</option>
            <option value="brand:Polestar">Polestar</option>
            <option value="brand:Toyota">Toyota</option>
          </optgroup>

          <optgroup label="Type">
            <option value="type:Sedan">Sedan</option>
            <option value="type:SUV">SUV</option>
            <option value="type:MPV">MPV</option>
            <option value="type:Hatchback">Hatchback</option>
          </optgroup>
        </select>
    </div>

    <button class="search-button">
      <img class="search-icon" src="images/icons/search-icon.png">
    </button>
  </div>
  `;

document.querySelector(".js-search-section").innerHTML = searchHTML;

const searchInput = document.querySelector(".search-bar");
const suggestions = document.querySelector(".suggestions");
const filterSelect = document.querySelector(".filters select");

const allKeywords = Array.from(
  new Map(
    cars.flatMap((car) =>
      car.keywords.map((k) => [k.toLowerCase().trim(), k.trim()])
    )
  ).values()
);

function showSuggestions(input) {
  suggestions.innerHTML = "";
  if (!input.trim()) {
    suggestions.style.display = "none";
    return;
  }

  const filtered = allKeywords.filter((keyword) =>
    keyword.toLowerCase().includes(input.trim().toLowerCase())
  );

  if (filtered.length === 0) {
    suggestions.style.display = "none";
    return;
  }

  filtered.forEach((keyword) => {
    const div = document.createElement("div");
    div.className = "suggestion-item";
    div.textContent = keyword;
    div.addEventListener("click", () => {
      searchInput.value = keyword;
      suggestions.style.display = "none";
    });
    suggestions.appendChild(div);
  });

  suggestions.style.display = "block";
}

function getSelectedFilter() {
  const value = filterSelect.value;
  if (!value) return {};
  const [key, val] = value.split(":");
  return { [key]: val };
}

function applySearchAndFilter() {
  const inputKeyword = searchInput.value.toLowerCase().trim();
  const filter = getSelectedFilter();

  let filteredCars = cars;

  // Apply search first if input is not empty
  if (inputKeyword) {
    filteredCars = filteredCars.filter((car) =>
      car.keywords.some((keyword) =>
        keyword.toLowerCase().includes(inputKeyword)
      )
    );
  }

  // Apply filter if a specific filter is selected
  if (filter.brand) {
    filteredCars = filteredCars.filter(
      (car) => car.brand.toLowerCase() === filter.brand.toLowerCase()
    );
  }
  if (filter.type) {
    filteredCars = filteredCars.filter(
      (car) => car.type.toLowerCase() === filter.type.toLowerCase()
    );
  }

  renderCars(filteredCars);
}

document
  .querySelector(".search-button")
  .addEventListener("click", applySearchAndFilter);

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    applySearchAndFilter();
  }
});

searchInput.addEventListener("input", () => {
  showSuggestions(searchInput.value.trim());
  if (searchInput.value.trim() === "") {
    renderCars(cars);
  }
});
