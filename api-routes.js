const Router = require("express").Router;
const { readAllFromDB, writeToDB } = require("./dynamodb.js");

var router = Router();

router.get("/", function (req, res) {
  readAllFromDB().then(function (data) {
    res.status(200).json(data);
  });
});

router.post("/", function (req, res) {
  var body = req.body;
  if (body) {
    if (!body.passkey){
      res.status(400).json({ message: "Invalid request" });
      return;
    }
    else if(body.passkey !== process.env.PASSKEY){
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    else if (!body.value) {
      res.status(400).json({ message: "Invalid request" });
      return;
    }
    writeToDB(body.value).then(function (data) {
      res.status(200).json({ message: "POST request received", data: data });
    });
  } else {
    res.status(400).json({ message: "Invalid request" });
  }
});

module.exports = router;
