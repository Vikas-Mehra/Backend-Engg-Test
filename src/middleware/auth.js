const jwt = require("jsonwebtoken");
// const { isValidObjectId } = require("../util/validator");
const { isValidUUID, isValidRequestBody } = require("../validator/validator");

//-------------------------------------------------------------------------
//                1. Authentication.
//-------------------------------------------------------------------------

const authentication = async function (req, res, next) {
  try {
    const token = req.header("Authorization");
    // const token = req.header("Authorization", "Bearer ");

    if (!token) {
      return res.status(400).send({
        status: false,
        message: `Missing authentication token in request.`,
      });
    }
    let splitToken = token.split(" ");

    jwt.verify(
      splitToken[1],
      "This-is-a-Secret-Key-for-Login(!@#$%^&*(</>)))",
      (error, decodedToken) => {
        if (error) {
          return res.status(401).send({
            status: false,
            message: error.message,
          });
        }

        req.customerID = decodedToken.customerID; // Set <customerID> in Request for use in Authorization.
        
        console.log("Authentication", req.customerID);

        next();
      }
    );
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//-------------------------------------------------------------------------
//                        2. Authorization.
//-------------------------------------------------------------------------

const authorization = async function (req, res, next) {
  try {
    console.log("Authorization.");

    console.log("\nreq.params", req.params);

    if (!isValidRequestBody(req.params)) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Params Empty. Provide <customerID> in Params.",
        });
    }

    // const customerIDParams = req.params.customerID;
    const customerIDParams = req.params.customerID.trim();

    if (!isValidUUID(customerIDParams)) {
      return res.status(400).send({
        status: false,
        message: "customerID in Params Not a valid UUID.",
      });
    }
    // message: "customerID in Params Not a valid Mongoose ObjectID.",

    if (req.customerID !== customerIDParams) {
      return res.status(403).send({
        status: false,
        message: "Unauthorised Access: You are NOT Authorised.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { authentication, authorization };
