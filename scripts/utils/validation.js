export function validateName(name) {
  return name.trim().length >= 2;
}

export function validatePhoneNumber(phone) {
  return /^0\d{9}$/.test(phone);
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateDriverLicense(dl) {
  return /^[A-Z]{1}\d{5,7}$/.test(dl);
}

export function showError(selector, message) {
  document.querySelector(selector).textContent = message;
}

export function clearError(selector) {
  document.querySelector(selector).textContent =
    "Please confirm the following information";
}
