const { json } = require("express");
var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//Data endpoint
//Countries endpoint
router.get("/countries", function (req, res) {
  const countries = [];
  const existParams = Object.keys(req.query);
  //check if there are existed invalid params
  if (existParams.length > 0) {
    res.status(400).json({
      error: true,
      message: `Invalid query parameters: ${existParams}. Query parameters are not permitted.`,
    });
  } else {
    req.db
      .from("data")
      .distinct("country")
      //iterate through array then push each country name into
      //another array
      .then((rows) => {
        rows.map((data) => countries.push(data.country));
        countries.sort();
        res.status(200).json(countries);
      });
  }
});

//volcanoes endpoint
router.get("/volcanoes", function (req, res, next) {
  const populatedWithin = ["5km", "10km", "30km", "100km", undefined, ""];
  const validParams = ["country", "populatedWithin"];
  const keyParams = Object.keys(req.query);

  //check status
  function checkInvalidParam() {
    var invalidCheck = false;
    //check if params is valid
    keyParams.forEach((param) => {
      if (!validParams.includes(param)) {
        invalidCheck = true;
      }
    });
    return invalidCheck;
  }

  //if theres no country name input
  if (!req.query.country) {
    return res.status(400).json({
      error: true,
      message: "Country is a required query parameter.",
    });
  }
  //params check
  else if (checkInvalidParam()) {
    return res.status(400).json({
      error: true,
      message:
        "Invalid query parameters. Only country and populatedWithin are permitted.",
    });
  }
  //if theres wrong population within input
  else if (!populatedWithin.includes(req.query.populatedWithin)) {
    return res.status(400).json({
      error: true,
      message: `Invalid value for populatedWithin: ${req.query.populatedWithin}. Only: 5km,10km,30km,100km are permitted.`,
    });
  } else {
    //if the input of populated within is none or undefined
    if (!req.query.populatedWithin) {
      req.db
        .from("data")
        .select("id", "name", "country", "region", "subregion")
        .where({ country: req.query.country })
        .then((rows) => {
          res.json(rows);
        })
        .catch((err) => {
          console.log(err);
          res.json({});
        });
    }
    //if the populated within's input is suitable to use for database
    else {
      req.db
        .from("data")
        .select("id", "name", "country", "region", "subregion")
        .where({ country: req.query.country })
        .andWhere(`population_${req.query.populatedWithin}`, ">", 0)
        .then((rows) => {
          res.json(rows);
        })
        .catch((err) => {
          console.log(err);
          res.json({});
        });
    }
  }
});

//Volcano(with ID) endpoint
router.get("/volcano/:id", function (req, res, next) {
  const authorization = req.headers.authorization;
  var volId = parseFloat(req.params.id);
  const existParams = Object.keys(req.query);
  let token = null;
  try {
    //if token existed
    if (authorization) {
      const secretKey = "secret key";
      token = authorization.split(" ")[1];
      var bearer = authorization.split(" ")[0];
      console.log("Token: ", token);
      console.log("Bearer: ", bearer);
      if(authorization.split(" ").length < 2 || 
         authorization.split(" ").length > 2 ||
         bearer !== "Bearer"){
        throw new Error("Malformed Bearer");
      }
      //verify token and response any error about JWT token
      const decoded = jwt.verify(token, secretKey);
      //if the token is expired
      if (decoded.exp < Date.now()) {
        console.log("expired");
        throw new Error("JWT token has expired");
      }

      //check if there are existed invalid params
      if (existParams.length > 0) {
        console.log("invalid params");
        res.status(400).json({
          error: true,
          message: `Invalid query parameters: ${existParams}. Query parameters are not permitted.`,
        });
      } else {
        //correct input
        if (0 < volId && volId <= 1000 && Number.isInteger(volId)) {
          req.db
            .from("data")
            .select("*")
            .where({ id: volId })
            .then((data) => res.json(data[0]))
            .catch((err) => {
              console.log(err);
              return res.status(400).json({
                error: true,
                message:
                  "Invalid query parameters. Query parameters are not permitted.",
              });
            });
        }
        //wrong input
        else {
          res.status(404).json({
            error: true,
            message: `Volcano with ID: ${req.params.id} not found.`,
          });
          return;
        }
      }
    } else {
      //check if there are existed invalid params
      if (existParams.length > 0) {
        res.status(400).json({
          error: true,
          message: `Invalid query parameters: ${existParams}. Query parameters are not permitted.`,
        });
        return;
      } else {
        //correct input
        if (0 < volId && volId <= 1000 && Number.isInteger(volId)) {
          req.db
            .from("data")
            .select(
              "id",
              "name",
              "country",
              "region",
              "subregion",
              "last_eruption",
              "summit",
              "elevation",
              "latitude",
              "longitude"
            )
            .where({ id: volId })
            .then((data) => res.json(data[0]))
            .catch((err) => {
              console.log(err);
              res.status(400).json({
                error: true,
                message:
                  "Invalid query parameters. Query parameters are not permitted.",
              });
              return;
            });
        }
        //wrong input
        else {
          res.status(404).json({
            error: true,
            message: `Volcano with ID: ${req.params.id} not found.`,
          });
          return;
        }
      }
    }
  } catch (e) {
    if(e.message === "jwt malformed"){
      res.status(401).json({
        error: true,
        message: "Invalid JWT token",
      });
    }
    else if(e.message === "JWT token has expired")
    res.status(401).json({
      error: true,
      message: "JWT token has expired",
    });
    else if(e.message === "Malformed Bearer"){
      res.status(401).json({
        error: true,
        message: "Authorization header is malformed",
      });
    }
  }
});


module.exports = router;
