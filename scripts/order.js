import { cars } from "../data/cars.js";
import { reservation } from "../data/reservation.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { formatCurrency } from "./utils/money.js";
import * as validation from "./utils/validation.js";

const localCars = JSON.parse(localStorage.getItem("cars")) || cars;
function getCar(VIN) {
  return localCars.find((car) => car.VIN === VIN);
}

let orderHTML = "";

const currentCar = getCar(reservation[0].carVIN);
let orderedCar;

if (currentCar.availability) {
  const priceCentsPerDay = currentCar.priceCents;

  const savedRentalInfo = JSON.parse(localStorage.getItem("rentalInfo")) || {};

  const today = dayjs().format("YYYY-MM-DD");
  const name = savedRentalInfo.name || "";
  const phoneNumber = savedRentalInfo.phoneNumber || "";
  const email = savedRentalInfo.email || "";
  const driverLicense = savedRentalInfo.driverLicense || "";
  const startDate = savedRentalInfo.startDate || today;
  const rentalDays = savedRentalInfo.rentalDays || 1;
  const totalPrice = priceCentsPerDay * rentalDays;

  orderHTML += `
  <div class="order-title">
    Order Information
  </div>
  <div class="error-message js-error-message">
    Please confirm the following information
  </div>
  <div>
    <label>Name:</label>
    <input type="text" class="name js-name" value="${name}">
  </div>
  <div>
    <label>Phone Number:</label>
    <input type="tel" class="phone-number js-phone-number" value="${phoneNumber}">
  </div>
  <div>
    <label>Email:</label>
    <input type="email" class="email js-email" value="${email}">
  </div>
  <div>
    <label>Driver's License No.:</label>
    <input type="text" class="drivers-license-number js-drivers-license-number" value="${driverLicense}">
  </div>

  <div class="reservation-date">
    <label>Start Date</label>
    <input type="date" class="js-start-date" value="${startDate}" min="${today}">
  </div>

  <div class="rental-period">
    <label>Rental Period (Days):</label>
    <input type="number" class="js-rental-period" min="1" max="999" value="${rentalDays}">
  </div>

  <div class="total-rent">
    <div>Total Rent:</div>
    <div class="total-price js-total-price">
      $${formatCurrency(totalPrice)}
    </div>
  </div>

  <div class="button-group">
    <button class="submit-button button-primary js-submit-button">
      Submit
    </button>
    <button class="cancel-button button-primary js-cancel-button">
      Cancel
    </button>
  </div>
  `;

  document.querySelector(".js-order").innerHTML = orderHTML;
  attachValidationListeners();
  updateSubmitButtonState();

  function saveRentalInfo() {
    const inputName = document.querySelector(".js-name").value;
    const inputPhoneNumber = document.querySelector(".js-phone-number").value;
    const inputEmail = document.querySelector(".js-email").value;
    const inputDL = document.querySelector(".js-drivers-license-number").value;
    const selectedDate = document.querySelector(".js-start-date").value;
    const selectedDays =
      parseInt(document.querySelector(".js-rental-period").value) || 1;

    const rentalInfo = {
      name: inputName,
      phoneNumber: inputPhoneNumber,
      email: inputEmail,
      driverLicense: inputDL,
      startDate: selectedDate,
      rentalDays: selectedDays,
    };

    localStorage.setItem("rentalInfo", JSON.stringify(rentalInfo));
  }

  function updateTotalPrice() {
    const days =
      parseInt(document.querySelector(".js-rental-period").value) || 1;
    const totalPrice = priceCentsPerDay * days;

    document.querySelector(".js-total-price").textContent = `$${formatCurrency(
      totalPrice
    )}`;

    saveRentalInfo();
  }

  document
    .querySelector(".js-rental-period")
    .addEventListener("input", updateTotalPrice);

  document
    .querySelector(".js-start-date")
    .addEventListener("change", saveRentalInfo);

  document.querySelector(".js-cancel-button").addEventListener("click", () => {
    localStorage.removeItem("rentalInfo");
    window.location.href = "index.html";
  });

  function isValid() {
    const name = document.querySelector(".js-name").value;
    const phone = document.querySelector(".js-phone-number").value;
    const email = document.querySelector(".js-email").value;
    const dl = document.querySelector(".js-drivers-license-number").value;

    return (
      validation.validateName(name) &&
      validation.validatePhoneNumber(phone) &&
      validation.validateEmail(email) &&
      validation.validateDriverLicense(dl)
    );
  }

  function updateSubmitButtonState() {
    const submitButton = document.querySelector(".js-submit-button");
    submitButton.disabled = !isValid();
  }

  function attachValidationListeners() {
    const nameInput = document.querySelector(".js-name");
    const phoneInput = document.querySelector(".js-phone-number");
    const emailInput = document.querySelector(".js-email");
    const licenseInput = document.querySelector(".js-drivers-license-number");

    nameInput.addEventListener("input", () => {
      if (!validation.validateName(nameInput.value)) {
        validation.showError(
          ".js-error-message",
          "Name must be at least 2 characters."
        );
      } else {
        validation.clearError(".js-error-message");
        saveRentalInfo();
      }
      updateSubmitButtonState();
    });

    phoneInput.addEventListener("input", () => {
      if (!validation.validatePhoneNumber(phoneInput.value)) {
        validation.showError(
          ".js-error-message",
          "Please enter a valid Australian phone number (e.g. 0412345678)."
        );
      } else {
        validation.clearError(".js-error-message");
        saveRentalInfo();
      }
      updateSubmitButtonState();
    });

    emailInput.addEventListener("input", () => {
      if (!validation.validateEmail(emailInput.value)) {
        validation.showError(".js-error-message", "Invalid email format.");
      } else {
        validation.clearError(".js-error-message");
        saveRentalInfo();
      }
      updateSubmitButtonState();
    });

    licenseInput.addEventListener("input", () => {
      if (!validation.validateDriverLicense(licenseInput.value)) {
        validation.showError(
          ".js-error-message",
          "Please enter a valid Australian driver's license number (e.g. Q1234567)."
        );
      } else {
        validation.clearError(".js-error-message");
        saveRentalInfo();
      }
      updateSubmitButtonState();
    });
  }

  document.querySelector(".js-submit-button").addEventListener("click", () => {
    const carIndex = cars.findIndex((car) => car.VIN === currentCar.VIN);
    if (carIndex !== -1) {
      orderedCar = cars[carIndex];
      orderedCar.availability = false;
      localStorage.setItem("cars", JSON.stringify(cars));
    }

    document.querySelector(".button-group").innerHTML = `
    <button class="confirm-button button-primary js-confirm-button">
      Confirm
    </button>
  `;

    document
      .querySelector(".js-confirm-button")
      .addEventListener("click", () => {
        const rentalInfo = JSON.parse(localStorage.getItem("rentalInfo")) || {};

        const orderData = {
          car: orderedCar,
          rentalInfo: rentalInfo,
        };

        localStorage.setItem("order", JSON.stringify(orderData));

        alert("Order confirmed!");
        localStorage.removeItem("rentalInfo");
        window.location.href = "index.html";
      });
  });
} else {
  orderHTML += `
    <div class="not-available">
      Sorry, the car you choose is unavailable, please choose another car.
    </div>
    <button class="home-button button-primary js-home-button">
      Back to HOME
    </button>
  `;
  document.querySelector(".js-order").innerHTML = orderHTML;
  document.querySelector(".js-home-button").addEventListener("click", () => {
    window.location.href = "index.html";
  });
}
