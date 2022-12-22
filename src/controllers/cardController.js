const cardModel = require("../models/cardModel");

const {
  isValid,
  isValidRequestBody,
  isValidName,
  isValidCardType,
  isValidStatus,
  isValidObjectId,
} = require("../validator/validator");

//-------------------------------------------------------------------------
//                1. API - POST /register
//-------------------------------------------------------------------------

const createCard = async function (req, res) {
  try {
    let data = req.body;

    if (!isValidRequestBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: "Request Body Empty." });
    }

    // Destructuring Request-Body.
    const { cardNumber, cardType, customerName, status, vision, customerID } =
      data;

    // <customerName> Validations.
    if (!isValid(customerName)) {
      return res.status(400).send({
        status: false,
        message: "Please enter <customerName>.",
      });
    }
    if (!isValidName(customerName)) {
      return res.status(400).send({
        status: false,
        message: "<customerName> should be Alphabets & Whitespace's Only.",
      });
    }

    // <vision> Validations.
    if (!isValid(vision)) {
      return res.status(400).send({
        status: false,
        message: "Please enter <vision>.",
      });
    }

    // <status> (Default: ACTIVE) Validations.
    if (status) {
      if (!isValid(status)) {
        return res
          .status(400)
          .send({ status: false, message: "Please enter a Valid <status>." });
      }
      if (!isValidStatus(status)) {
        return res.status(400).send({
          status: false,
          message: "<status> can ONLY be <ACTIVE> or <INACTIVE>.",
        });
      }
    }

    // <cardType> Validations.
    if (!isValid(cardType)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter a Valid <cardType>." });
    }
    if (!isValidCardType(cardType)) {
      return res.status(400).send({
        status: false,
        message: "<cardType> can ONLY be <REGULAR> or <SPECIAL>.",
      });
    }

    // <cardNumber> AUTO-Increment.
    let cards = await cardModel.find();

    data.cardNumber =
      "C" +
      (cards.length + 1)
        .toString()
        .padStart(4 - cards.length.toString().length, "0");

    // <customerID> Validations.
    if (!isValid(customerID)) {
      return res.status(400).send({
        status: false,
        message: "Please enter <customerID>.",
      });
    }
    if (!isValidObjectId(customerID)) {
      return res.status(400).send({
        status: false,
        message: `customerID: <${customerID}> NOT a Valid Mongoose Object ID.`,
      });
    }

    let createDocument = await cardModel.create(data);

    return res.status(201).send({
      status: true,
      message: "Card created successfully.",
      data: createDocument,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

//-------------------------------------------------------------------------
//                        2. API - GET /getAllCards
//-------------------------------------------------------------------------

const getAllCards = async (req, res) => {
  try {
    console.log("\ngetAllCards API.");

    //- **Response format**
    //- **On success** - Return HTTP status 200. Also return the cards documents.
    const cards = await cardModel
      .find({
        isDeleted: false,
      })
      .populate("customerID"); // Populate <customerID>.

    //- **On error** - Return a suitable error message with a valid HTTP status code.
    if (!cards.length) {
      return res
        .status(404)
        .send({ status: false, message: "No cards found." });
    }

    // message: "Fetched cards Successfully.",
    return res.status(200).send({
      status: true,
      message: "Success.",
      data: cards,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createCard, getAllCards };
