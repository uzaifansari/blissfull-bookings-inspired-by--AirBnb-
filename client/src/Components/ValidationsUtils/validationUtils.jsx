export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/;
  return passwordRegex.test(password);
}

export function validateName(name) {
  const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
  return nameRegex.test(name);
}

export function validatePhoneNumber(phn) {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phn);
}
