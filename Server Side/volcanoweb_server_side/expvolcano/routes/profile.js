const { json } = require("express");
var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
const secretKey = "secret key";

//A function to return all data of an account (except password)
function getAccountDatas(req, res) {
  req.db
    .from("accounts")
    .select("*")
    .where("email", req.params.email)
    .then((existAccount) => {
      if (existAccount.length === 1) {
        console.log(existAccount[0]);
        res.status(200).json({
          email: existAccount[0].email,
          firstName: existAccount[0].firstname,
          lastName: existAccount[0].lastname,
          dob: existAccount[0].dob,
          address: existAccount[0].address,
        });
      } else
        return res.status(404).json({
          error: true,
          message: "User not found",
        });
    });
}

//Function to decode JWT token to get payload data
//ref: https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
function decodeJWT(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

//Profile endpoint
//get profile
router.get("/user/:email/profile", function (req, res, next) {
  const authorization = req.headers.authorization;
  let token = null;
  try {
    //if existed token
    if (authorization) {
      token = authorization.split(" ")[1];

      var bearer = authorization.split(" ")[0];
      console.log("Token: ", token);
      console.log("Bearer: ", bearer);
      if (
        authorization.split(" ").length < 2 ||
        authorization.split(" ").length > 2 ||
        bearer !== "Bearer"
      ) {
        console.log("Malformed Bearer");
        throw new Error("Malformed Bearer");
      }
      //verify token and response any error about JWT token
      const decoded = jwt.verify(token, secretKey);

      //if the token is expired
      if (decoded.exp < Date.now()) {
        console.log("expired");
        throw new Error("JWT token has expired");
      }
      //if Email assign to the token is the email that requests
      if (req.params.email === decodeJWT(token).email) {
        req.db.schema.hasTable("accounts").then(function (exists) {
          //check if the database is existed
          if (exists) {
            getAccountDatas(req, res);
          } else
            return res.status(404).json({
              error: true,
              message: "User not found",
            });
        });
      }
      //forbidden access  
      else {
        req.db
          .from("accounts")
          .select("*")
          .where("email", req.params.email)
          .then((existAccount) => {
            if (existAccount.length === 1) {
              console.log(existAccount[0]);
              res.status(200).json({
                email: existAccount[0].email,
                firstName: existAccount[0].firstname,
                lastName: existAccount[0].lastname,
              });
            } else
              return res.status(404).json({
                error: true,
                message: "User not found",
              });
          });
      }
    } else {
      req.db.schema.hasTable("accounts").then(function (exists) {
        //check if the database is existed
        if (exists) {
          req.db
            .from("accounts")
            .select("email", "firstname", "lastname")
            .where("email", req.params.email)
            .then((existAccount) => {
              if (existAccount.length === 1) {
                console.log(existAccount[0]);
                res.json({
                  email: existAccount[0].email,
                  firstName: existAccount[0].firstname,
                  lastName: existAccount[0].lastname,
                });
              } else
                return res.status(404).json({
                  error: true,
                  message: "User not found",
                });
            });
        } else
          return res.status(404).json({
            error: true,
            message: "User not found",
          });
      });
    }
  } catch (e) {
    if (e.message === "jwt malformed") {
      res.status(401).json({
        error: true,
        message: "Invalid JWT token",
      });
    } else if (e.message === "JWT token has expired")
      res.status(401).json({
        error: true,
        message: "JWT token has expired",
      });
    else if (e.message === "Malformed Bearer") {
      res.status(401).json({
        error: true,
        message: "Authorization header is malformed",
      });
    }
  }
});

//function to check invalid date with invalid format
//ref: https://stackoverflow.com/questions/18758772/how-do-i-validate-a-date-in-this-format-yyyy-mm-dd-using-jquery
function checkValidDate(date) {
  var dateFormat = /^\d{4}-\d{2}-\d{2}$/;

  // Invalid format
  if (!date.match(dateFormat)) return false;
  var d = new Date(date);
  var dateCount = d.getTime();
  // NaN value, Invalid date
  if (!dateCount && dateCount !== 0) return false;

  return d.toISOString().slice(0, 10) === date;
}

//update profile
router.put("/user/:email/profile", function (req, res, next) {
  const authorization = req.headers.authorization;
  let token = null;
  var dob = new Date(req.body.dob);
  var today = new Date();
  try {
    //============JWT token test===============
    if (authorization) {
      token = authorization.split(" ")[1];
      var bearer = authorization.split(" ")[0];
      //check Bearer format
      if (
        authorization.split(" ").length < 2 ||
        authorization.split(" ").length > 2 ||
        bearer !== "Bearer"
      ) {
        throw new Error("Malformed Bearer");
      }
      //verify token and throw any error about invalid JWT token
      const decoded = jwt.verify(token, secretKey);
      //if the token is expired
      if (decoded.exp < Date.now()) {
        console.log("expired");
        throw new Error("JWT token has expired");
      }

      //forbidden access
      if(req.params.email !== decodeJWT(token).email){
        throw new Error("Forbidden Access");
      }

      //conditions nest
      //if lacking of first/lastname, dob, address
      if (
        !req.body.firstName ||
        !req.body.lastName ||
        !req.body.dob ||
        !req.body.address
      ) {
        return res.status(400).json({
          error: true,
          message:
            "Request body incomplete: firstName, lastName, dob and address are required.",
        });
      }
      //if  data format for first/lastname and address not string
      else if (
        typeof req.body.firstName !== "string" ||
        typeof req.body.lastName !== "string" ||
        typeof req.body.address !== "string"
      ) {
        return res.status(400).json({
          error: true,
          message:
            "Request body invalid: firstName, lastName and address must be strings only.",
        });
      }
      //if invalid date format (YY/MM/DD)
      else if (!checkValidDate(req.body.dob)) {
        return res.status(400).json({
          error: true,
          message:
            "Invalid input: dob must be a real date in format YYYY-MM-DD.",
        });
      }
      //if invalid profile date (must be in the past)
      else if (dob.getTime() > today.getTime()) {
        return res.status(400).json({
          error: true,
          message: "Invalid input: dob must be a date in the past.",
        });
      } else {
        return req.db
          .from("accounts")
          .where("email", req.params.email)
          .update({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dob: req.body.dob,
            address: req.body.address,
          })
          .then(() => {
            getAccountDatas(req, res);
          });
      }
    } else {
      throw new Error("MissingAuthHeader");
    }
  } catch (e) {
    if (e.message === "jwt malformed") {
      res.status(401).json({
        error: true,
        message: "Invalid JWT token",
      });
    } else if (e.message === "JWT token has expired")
      res.status(401).json({
        error: true,
        message: "JWT token has expired",
      });
    else if (e.message === "Malformed Bearer") {
      res.status(401).json({
        error: true,
        message: "Authorization header is malformed",
      });
    } else if (e.message === "MissingAuthHeader") {
      res.status(401).json({
        error: true,
        message: "Authorization header ('Bearer token') not found",
      });
    }
    else if (e.message === "Forbidden Access"){
      res.status(403).json({
        error: true,
        message: "Forbidden",
      });
    }
  }
});



module.exports = router;
