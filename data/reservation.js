export let reservation = JSON.parse(localStorage.getItem("reservation")) || [];

document.addEventListener("DOMContentLoaded", () => {
  if (reservation.length === 0) {
    document.querySelector(".js-reservation-grid").innerHTML = `
    <label>You don't have any reservation</label>
    <button class="home-button button-primary js-home-button">
      Back to HOME
    </button>
    `;
    document.querySelector(".js-home-button").addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
});

function saveToStorage() {
  localStorage.setItem("reservation", JSON.stringify(reservation));
}

export function reserve(carVIN) {
  const newReservation = { carVIN: carVIN };

  if (reservation.length === 0) {
    reservation.push(newReservation);
  } else {
    reservation[0] = newReservation;
  }
  saveToStorage();
}
