const express = require("express");

const router = express.Router();

// Middleware Functions.
const { authentication, authorization } = require("../middleware/auth");

// Customer Functions.
const {
  createCustomer,
  login,
  getActiveCustomers,
  deleteCustomer,
} = require("../controllers/customerController");

// Card Functions.
const {
  createCard,
  getAllCards,
} = require("../controllers/cardController");

// ---------------------------- Customer APIs. ---------------------------
router.post("/register", createCustomer);

router.post("/login", login);

router.get("/activeCustomers", authentication, getActiveCustomers);

router.delete(
  "/deleteCustomer/:customerID",
  authentication,
  authorization,
  deleteCustomer
);

// ------------------------- Card APIs. -----------------------------------
router.post("/createCard", authentication,  createCard);

router.get("/getAllCards", authentication, getAllCards);

// ---------------- If API is Invalid OR Wrong URL. ------------------------
router.all("/**", function (req, res) {
  return res
    .status(404)
    .send({ status: false, message: "Requested API is not available." });
});

module.exports = router;
