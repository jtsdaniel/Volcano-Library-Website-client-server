var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
require("dotenv").config();

var dataRouter = require("./routes/data");
var adminRouter = require("./routes/admin");
var dataRouter = require("./routes/data");
var profileRouter = require("./routes/profile");
var authenticationRouter = require("./routes/authentication");

var app = express();

const options = require("./knexfile.js");
const knex = require("knex")(options);

//swagger
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("./swagger.json");

app.use((req, res, next) => {
  req.db = knex;
  next();
});
app.use(cors());
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

logger.token("req", (req, res) => JSON.stringify(req.headers));
logger.token("res", (req, res) => {
  const headers = {};
  res.getHeaderNames().map((h) => (headers[h] = res.getHeader(h)));
  return JSON.stringify(headers);
});

//check if knex works probably

 app.get("/knex", function (req, res, next) {
   req.db
     .raw("SELECT VERSION()")
     .then((version) => console.log(version[0][0]))
     .catch((err) => {
       console.log(err);
       throw err;
     });
   res.send("Version Logged successfully");
   });

app.use("/", dataRouter);
app.use("/", profileRouter);
app.use("/", adminRouter);
app.use("/", authenticationRouter);
app.use("/", swaggerUi.serve);
app.get(
  "/",
  swaggerUi.setup(swaggerDoc, {
    swaggerOptions: { defaultModelsExpandDepth: -1 }, // Hide schema section
  })
);
//Capture All 404 errors
app.use(function (req,res,next){
	res.status(404).send('Unable to find the requested resource!');
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
