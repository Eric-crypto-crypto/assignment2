import { cars } from "../data/cars.js";
import { reserve } from "../data/reservation.js";
import { formatCurrency } from "./utils/money.js";

export function renderCars(carList) {
  let carsHTML = "";

  carList.forEach((car) => {
    const availability = car.availability ? "Available" : "Unavailable";

    carsHTML += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image" src="${car.image}">
      </div>

      <div class="product-name">
        ${car.name}
      </div>

      <div class="car-brand">
        ${car.brand}
      </div>

      <div class="car-type">
        ${car.type}
      </div>
      
      <div class="car-rent-price">
        $${formatCurrency(car.priceCents)} per Day
      </div>

      <div class="car-availability ${
        availability === "Unavailable" ? "text-grey" : ""
      }">
        ${availability}
      </div>

      <button class="rent-button button-primary js-rent" 
      data-car-VIN="${car.VIN}">
        Rent
      </button>
    </div>
  `;
  });

  document.querySelector(".js-car-grid").innerHTML = carsHTML;
  rent();
}
renderCars(cars);

export function rent() {
  document.querySelectorAll(".js-rent").forEach((button) => {
    button.addEventListener("click", () => {
      const vin = button.dataset.carVin;
      reserve(vin);
      window.location.href = "reservation.html";
    });
  });
}
