const { json } = require("express");
var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//Authentication endpoint
//function to insert new registered account to database
function insertAccount(req, res) {
  req.db
    .from("accounts")
    .select("email")
    .where("email", req.body.email)
    .then((existEmail) => {
      //if email is not existed in the database
      if (existEmail.length > 0) {
        res.status(409).json({
          error: true,
          message: "User already exists",
        });
        return;
      }

      return req.db
        .from("accounts")
        .insert([
          {
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
          },
        ])
        .then(() => {
          res.status(201).json({
            message: "User created",
          });
          return;
        })
    });
}
//function to create an Account table if not exist
function createAccountTable(req, res) {
  req.db.schema
    .createTable("accounts", (table) => {
      table.string("email");
      table.string("password");
      table.string("firstname");
      table.string("lastname");
      table.string("dob");
      table.string("address");
    })
    .then(() => insertAccount(req, res))
    .catch((err) => {
      console.log(err);
    });
}

//user register post
router.post("/user/register", function (req, res, next) {
  //Nest conditions
  //if request lacking of some datas
  if (!req.body.email || !req.body.password) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete, both email and password are required",
    });
    return;
  } else {
    req.db.schema.hasTable("accounts").then( exists => {
      if (!exists) {
        createAccountTable(req, res);
      } else {
        insertAccount(req, res);
      }
    });
  }
  console.log(req.body);
});

//user login post
router.post("/user/login", function (req, res, next) {
  //conditions nest
  req.db.schema.hasTable("accounts").then((exists) => {
    //check if the database is existed
    if (exists) {
      //if body is lacking of data
      if (!req.body.email || !req.body.password) {
        res.status(400).json({
          error: true,
          message:
            "Request body incomplete, both email and password are required",
        });
        return;
      } else {
        req.db
          .from("accounts")
          .select("email", "password")
          .where("email", req.body.email)
          .then((existAccount) => {
            console.log(existAccount[0]);
            //if theres no account in the database
            if (existAccount.length === 0) {
              console.log("user not exist");
              res.status(401).json({
                error: true,
                message: "Incorrect email or password",
              });
              throw new Error("Incorrect email or password");
            }
            console.log("start compare password");
            return bcrypt.compare(req.body.password, existAccount[0].password); //
            
          })
          .then((match) => {
            //if the password doesnt match
            if (!match) {
              console.log("wrong password");
              res.status(401).json({
                error: true,
                message: "Incorrect email or password",
              });
              throw new Error("Incorrect email or password");
            } else {
              console.log("password match!");
              var email = req.body.email;
              const secretKey = "secret key";
              const expires_in = 60 * 60 * 24;
              const exp = Date.now() + expires_in * 1000;
              const token = jwt.sign({ email, exp }, secretKey);
              return res.json({
                token: token,
                token_type: "Bearer",
                expires_in: expires_in,
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
    //if database is not existed (because theres no account)
    else
      res.status(401).json({
        error: true,
        message: "Incorrect email or password",
      });
    return;
  });
});


module.exports = router;
