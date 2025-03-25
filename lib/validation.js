import moment from "moment";
export function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function validatePasswordComplexity(password) {
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return re.test(password);
}

export function validateMinLength(value, min) {
  return value.length >= min;
}

export function validateMaxLength(value, max) {
  return value.length <= max;
}

export function validateNotNull(value) {
  return (value !== null) | (value !== undefined) | (value !== "");
}

export function validateMoreThanZero(value) {
  return value.length > 0;
}

export function validateDateTimeStr(dateTimeStr) {
  return moment(dateTimeStr, "YYYY-MM-DD HH:mm", true).isValid();
}

export function validateDateStr(dateStr) {
  return moment(dateStr, "YYYY-MM-DD", true).isValid();
}
