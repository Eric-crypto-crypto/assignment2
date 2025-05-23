import { cars } from "../data/cars.js";
import { reservation } from "../data/reservation.js";
import { formatCurrency } from "./utils/money.js";

const localCars = JSON.parse(localStorage.getItem("cars")) || cars;
localStorage.setItem("cars", JSON.stringify(cars));

function getCar(carVIN) {
  return localCars.find((car) => car.VIN === carVIN);
}

let reserveHTML = "";

reservation.forEach((car) => {
  const matchingCar = getCar(car.carVIN);

  reserveHTML += `
    <div class="reserved-car-container js-car-container-${matchingCar.VIN}">
      <div class="car-details-grid">
        <img class="car-image" src="${matchingCar.image}">
        <div class="car-details">
          <div class="car-brand">
            ${matchingCar.brand}
          </div>
          <div class="car-name">
            ${matchingCar.name}
          </div>
          <div class="car-type">
            ${matchingCar.type}
          </div>
          <div class="car-price">
            $${formatCurrency(matchingCar.priceCents)} per Day
          </div>
        </div>
      </div>
    </div>
  `;
});

document.querySelector(".js-reservation").innerHTML = reserveHTML;
