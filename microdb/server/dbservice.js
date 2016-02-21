
var fs = require('fs');
var interpreter = require('./queryExecuter');
var dbCache = require('./cacheService')
var config = require('./config.json');

var dbDir = "./data";
var dbCacheTimeout = dbCacheTimeout;

function exists(path) {
  return fs.existsSync(path)
}

function setDbPath(path) {
  dbDir = path;
}

//All search queries are pointed to this functions
//success, error, db, query
function get(success, error, db, query) {
  
  //TODO implement a way to pass parameters to the query callback
  var args = [];

  validateDb(function (db, dbPath) {
    if (query) {
      interpreter.execute(function (result) {
        success(result.output);
      }, error, query, db, args)
    } else {
      success({
        result: db
      });
    }

  }, error, db);
}

function set(success, error, db, query) {

  //TODO implement a way to pass parameters to the query callback
  var args = [];

  validateDb(function (db, dbPath) {
    if (query) {
      interpreter.execute(function (result) {
        console.log("result.input ##############"+JSON.stringify(result, null, '\t')+"##########################");
        updateDb(dbPath, result.input);
        success({
          message: "Updated"
        });
      }, error, query, db, args)
    } else {
      success({
        message: "There is nothing to save"
      });
    }

  }, error, db, true);
}

function del(success, error, db) {
  validateDb(function (db, dbPath) {
    fs.unlinkSync(dbPath);
    success({
      message: db + " was deleted."
    });
  }, error, db);
}

/**
 * Validate whether the given server and the mapping db exists
 */
function validateDb(success, error, dbName, createDb) {
  if (!isValidDbName(dbName)) {
    error("DB name (" + dbName + ") is not valid");
    return;
  }

  var dbPath = dbDir + "/" + dbName;
  console.log('dbPath : '+dbPath);
  
  var folders = dbName.split('/');
  console.log('folders : '+JSON.stringify(folders));
  var folderPath = dbDir + "/";
  for (var x = 0; x < folders.length - 1; x++) {
      folderPath += folders[x];
      if (!exists(folderPath)) {
          console.log("Added folder : " + folderPath);
          fs.mkdirSync(folderPath);
      }
  }
  

  if (!exists(dbPath)) {
    if (createDb) {
      updateDb(dbPath, {});
      success(getDb(dbPath), dbPath);
    } else {
      error("Database (" + dbName + ") is currently not in use");
    }
  } else {
    success(getDb(dbPath), dbPath);
  }
}

function getDb(dbPath) {
  var db = dbCache.get(dbPath);
  if (!db) {
    db = JSON.parse(fs.readFileSync(dbPath).toString());
  }
  dbCache.add(dbPath, db, dbCacheTimeout);
  return db;
}
function updateDb(dbPath, db) {
  fs.writeFileSync(dbPath, JSON.stringify(db));
  dbCache.add(dbPath, db, dbCacheTimeout);
}

function isValidDbName(dbName) {
  if (dbName && dbName.length && dbName.length > 0) {
    var index = dbName.indexOf('.json');
    return index > 0 && index == dbName.length - 5;
  }
  return false;
}

function isValidServerName(serverName) {
  return serverName && serverName.length && serverName.length > 0;
}

module.exports = function (dbPath) {
  setDbPath(dbPath);
  return {
    get: get,
    set: set,
    delete: del
  };
}
