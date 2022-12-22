const mongoose = require("mongoose");
const { validate: uuidValidate, version: uuidVersion } = require("uuid");

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value === "number" && value.toString().trim().length === 0)
    return false;
  return true;
};

const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0;
};

const isValidObjectId = function (data) {
  let stringId = data.toString().toLowerCase();
  if (!mongoose.Types.ObjectId.isValid(stringId)) {
    return false;
  }
  let result = new mongoose.Types.ObjectId(stringId);
  if (result.toString() != stringId) {
    return false;
  }
  return true;
};

const isValidName = function (name) {
  return /^[a-zA-Z ]*$/.test(name);
};

const isValidPhone = function (phone) {
  return /^[6-9]\d{9}$/.test(phone);
};

const isValidStatus = function (size) {
  return ["ACTIVE", "INACTIVE"].indexOf(size) !== -1;
};

const isValidCardType = function (size) {
  return ["REGULAR", "SPECIAL"].indexOf(size) !== -1;
};

const isValidDate = function (value) {
  return /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(value);
};

const isValidUUID = function (uuid) {
  return uuidValidate(uuid) && uuidVersion(uuid) == 4;
};

module.exports = {
  isValid,
  isValidObjectId,
  isValidRequestBody,
  isValidName,
  isValidPhone,
  isValidStatus,
  isValidDate,
  isValidUUID,
  isValidCardType,
};
