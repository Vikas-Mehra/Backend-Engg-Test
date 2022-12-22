const customerModel = require("../models/customerModel");
const jwt = require("jsonwebtoken");
const { isEmail } = require("validator");

const uuid = require("uuid");

const {
  isValid,
  isValidObjectId,
  isValidRequestBody,
  isValidName,
  isValidPhone,
  isValidStatus,
  isValidDate,
  isValidUUID,
} = require("../validator/validator");

//-------------------------------------------------------------------------
//                1. API - POST /register
//-------------------------------------------------------------------------

const createCustomer = async function (req, res) {
  try {
    let data = req.body;

    if (!isValidRequestBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: "Request Body Empty." });
    }

    // Destructuring Request-Body.
    const { firstName, lastName, emailID, mobileNumber, DOB, address, status } =
      data;

    // <firstName> Validations.
    if (!isValid(firstName)) {
      return res.status(400).send({
        status: false,
        message: "Please enter <firstName>.",
      });
    }
    if (!isValidName(firstName)) {
      return res.status(400).send({
        status: false,
        message: "<firstName> should be Alphabets & Whitespace's Only.",
      });
    }

    // <lastName> Validations.
    if (!isValid(lastName)) {
      return res.status(400).send({
        status: false,
        message: "Please enter <lastName>.",
      });
    }
    if (!isValidName(lastName)) {
      return res.status(400).send({
        status: false,
        message: "<lastName> should be Alphabets & Whitespace's Only.",
      });
    }

    // <emailID> Validations.
    if (!isValid(emailID)) {
      return res.status(400).send({
        status: false,
        message: "Please enter <emailID>.",
      });
    }
    if (!isEmail(emailID)) {
      return res.status(400).send({
        status: false,
        message: "<emailID> Format Invalid.",
      });
    }
    const emailExist = await customerModel.findOne({
      emailID: emailID,
    });
    if (emailExist) {
      return res.status(400).send({
        status: false,
        message: "<emailID> already registered.",
      });
    }

    // <mobileNumber> Validations.
    if (!isValid(mobileNumber)) {
      return res.status(400).send({
        status: false,
        message: "Please enter <mobileNumber>.",
      });
    }
    if (!isValidPhone(mobileNumber)) {
      return res.status(400).send({
        status: false,
        message:
          "<mobileNumber> should be an Indian Number ONLY (start with <6,7,8 or 9> and 10-Digits).",
      });
    }
    const mobileNumberExist = await customerModel.findOne({
      mobileNumber: mobileNumber,
    });
    if (mobileNumberExist) {
      return res.status(400).send({
        status: false,
        message: "<mobileNumber> number already registered.",
      });
    }

    // <address> Validations.
    if (!isValid(address)) {
      return res.status(400).send({
        status: false,
        message: "Please enter <address>.",
      });
    }

    // <status> Validations.
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

    // <DOB> Validations.
    if (!isValid(DOB)) {
      return res.status(400).send({
        status: false,
        message: "Please enter a Valid <DOB> (Date).",
      });
    }
    if (!isValidDate(DOB)) {
      return res.status(400).send({
        status: false,
        message: "Invalid Format: <DOB> can ONLY be (YYYY-MM-DD).",
      });
    }

    // <customerID> i.e. Generate a "UUID".
    data.customerID = uuid.v4(); //
    console.log("\ndata.customerID", data.customerID);

    let createDocument = await customerModel.create(data);

    return res.status(201).send({
      status: true,
      message: "Customer created successfully.",
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
//                        2. API - POST /login
//-------------------------------------------------------------------------

const login = async function (req, res) {
  try {
    if (!isValidRequestBody(req.body)) {
      return res
        .status(400)
        .send({ status: false, message: "Request Body Empty." });
    }

    const { emailID, customerID } = req.body;

    // <emailID> Validations.
    if (!isValid(emailID)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide <emailID>." });
    }
    if (!isEmail(emailID)) {
      return res
        .status(400)
        .send({ status: false, message: "<emailID> Format Invalid." });
    }

    // <password> Validations.
    if (!isValid(customerID)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide <customerID>." });
    }
    if (!isValidUUID(customerID)) {
      return res.status(400).send({
        status: false,
        message: "<customerID> must be between 8 and 15 characters.",
      });
    }

    // Check if the CUSTOMER Exists.
    let findCustomer = await customerModel.findOne({
      emailID: emailID,
      customerID: customerID,
    });
    if (!findCustomer) {
      return res.status(401).send({
        status: false,
        message: `Customer having email: <${emailID}> & customerID: <${customerID}> Not Found.`,
      });
    }
    if (findCustomer.isDeleted != false) {
      return res.status(404).send({
        status: false,
        message: `Customer NOT Found (already deleted).`,
      });
    }

    console.log("\nLOGIN");

    // Create JWT Token.
    let token = jwt.sign(
      { userId: findCustomer._id, customerID: findCustomer.customerID },
      "This-is-a-Secret-Key-for-Login(!@#$%^&*(</>)))",
      {
        expiresIn: "24h", // 24 Hours.
      }
    );

    // Data to be sent as response.
    const customerData = {
      userId: findCustomer._id,
      token: token,
    };

    // Send Response.
    return res.status(200).send({
      status: true,
      message: "Customer logged-in successfully.",
      data: customerData,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//-------------------------------------------------------------------------
//                        3. API - GET /getActiveCustomers
//-------------------------------------------------------------------------

const getActiveCustomers = async (req, res) => {
  try {
    console.log("\ngetActiveCustomers API.");

    //- **Response format**
    //- **On success** - Return HTTP status 200. Also return the customer documents.
    const documents = await customerModel.find({
      status: "ACTIVE",
      isDeleted: false,
    });

    //- **On error** - Return a suitable error message with a valid HTTP status code.
    if (!documents.length) {
      return res
        .status(404)
        .send({ status: false, message: "No customers found." });
    }

    // message: "Fetched customers Successfully.",
    return res.status(200).send({
      status: true,
      message: "Success.",
      data: documents,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//-------------------------------------------------------------------------
//                  4. API - DELETE /deleteCustomer
//-------------------------------------------------------------------------

const deleteCustomer = async (req, res) => {
  try {
    console.log("\ndeleteCustomer API.");

    const customerIDParams = req.params.customerID.trim();

    if (!isValidUUID(customerIDParams)) {
      return res.status(400).send({
        status: false,
        message: `<customerID> in Params: <${customerIDParams}> NOT a Valid UUID.`,
      });
    }

    // Delete Customer.
    const deleteCustomer = await customerModel.findOneAndUpdate(
      { customerID: customerIDParams, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!deleteCustomer) {
      return res
        .status(404)
        .send({ status: false, message: "Customer NOT found." });
    }

    //- **On success** - Return HTTP status 200.
    return res.status(200).send({
      status: true,
      message: "Deleted Customer by ID.",
      data: deleteCustomer,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createCustomer, login, getActiveCustomers, deleteCustomer };
