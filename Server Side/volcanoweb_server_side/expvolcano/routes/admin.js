const { json } = require("express");
var express = require("express");
var router = express.Router();

//Administration endpoint
router.get("/me", function (req, res, next) {
  return res.json({
    name: "Duy Pham (Daniel)",
    student_number: "n10640754",
  });
});

module.exports = router;
