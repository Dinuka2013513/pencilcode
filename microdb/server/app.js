var express = require('express');
var app = express();
var config = require('./config.json');
var dbService = require('./dbservice.js')(config.dbPath);

  var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
  }

  app.use(allowCrossDomain);

app.get('/data/:dbName', function (req, res) {
  console.log("Came");
  var dbName = req.params.dbName;
  var userName = getUserName(req.headers.host);
  if (!userName) {
    res.status(400).send("Username is not valid");
  } else if (!isValidDbName(dbName)) {
    res.status(400).send("Database name is not valid");
  } else {
    var get = req.query.get;
    var set = req.query.set;
    if (get) {
      var transaction = req.query.query;
      dbService.get(
        function (result) {
          res.json(result);
        },
        function (err) {
          res.status(400).send(err);
        }, userName + "/" + dbName, get);
    } else if (set) {
      var value = req.query.set;
      console.log("Value is : " + value);
      dbService.set(
        function (result) {
          res.json(result);
        },
        function (err) {
          res.status(400).send(err);
        }, userName + "/" + dbName, set);
    } else {
      res.status(400).send("Database query is not valid");
    }
  }
});

function isValidDbName(dbName) {
  if (dbName) {
    var index = dbName.indexOf('.json');
    return index > 0 && index == dbName.length - 5;
  }
  return false;
}

function getUserName(requestHeaderHost) {
  var lastIndexOfUserName = requestHeaderHost.indexOf("." + config.host);
  if (lastIndexOfUserName <= 0) {
    return null;
  } else {
    return requestHeaderHost.substring(0, lastIndexOfUserName);
  }
}

var server = app.listen(config.port, function () {
  console.log('Pencilcode Micro Database is listening at http://%s:%s', config.host + ":" + config.port);
});