(function() {
    
    
  
  var $ = require('jquery');
  var mdInterpreter = require('mdInterpreter');
  
  window.microdb = {
    /**
     * host of the micro db server
     */
    host: function() {
        return window.location.host + "/data";
    }
  }
  window.TempMicroDB = MicroDB;
  
  function getAvailableDBs() {
    //TODO
    return [
      'db.json',
      'modules.json',
      'abcd.json'
    ];
  }
  
  function MicroDB(dbName) {
    this.dbName = dbName;
    this.url = "http://" + window.microdb.host() + "/" + dbName;
    var data;
    var self = this;
    
    MicroDB.prototype.get = function(query) {
        return this.executeQuery('get', query, getArgs(arguments));
    };
    
    MicroDB.prototype.set = function(query) {
        return this.executeQuery('set', query, getArgs(arguments), function (result, error) {
            if (!error && result && typeof result.input === "object") {
                data = getCopy(result.input);
            }
        });
        
    };
    
    var inProgress = false;
    var queuedQueries = [];

    MicroDB.prototype.executeQuery = function(queryName, query, args, callback) {
        var encodedQuery = encodeURIComponent(query);
        var encodedArgs = JSON.stringify(args);
        var url = this.url + "?" + queryName + "=" + encodedQuery + "&&args=" + encodedArgs;

        function getDB(resolve, reject) {
            var setData = function(newData) {
                data = getCopy(newData);
            };
            var setProgress = function(status) {
                inProgress = status;
            };
            var getProgress = function() {
                return inProgress
            };
            var getQueuedQueries = function() {
                return queuedQueries;
            };
            
            return new Promise(function(resolve, reject) {
                if (!data) {
                    if (!getProgress()) {
                        console.log("Fetching DB "+self.url);
                        var apiCall = $.ajax({
                            type: 'GET',
                            url: self.url + "?get=function(){return this.db;}",
                            dataType: 'JSON',
                            success: function(json) {
                                setProgress(false);
                                if (!data) {
                                    setData(json);
                                } 
                                resolve(getCopy(data));
                                while (getQueuedQueries().length > 0) {
                                    getQueuedQueries().shift().resolve(getCopy(data));
                                }
                            },
                            error: function(err, err1, ex) {
                                setProgress(false);
                                setData({});
                                console.log("Initialized an empty object "+self.url);
                                resolve(data);
                                while (getQueuedQueries().length > 0) {
                                    getQueuedQueries().shift().resolve(getCopy(data));
                                }
                            }
                        });
                        setProgress(true);
                    } else {
                        getQueuedQueries().push({resolve: resolve, reject: reject});
                    }
                    
                } else {
                    resolve(getCopy(data));
                }
            });
        };
      
        return new Promise(function(resolve, reject) {
            getDB()
            .then(function(db) {
                var result = {};
                
                mdInterpreter.execute(function(result) {
                    callback && callback(result);
                    resolve(result.output);
                }, 
                function(error) {
                    callback && callback(null, err);
                    reject(error);
                }
                , query, db, args);
            })
            .catch(function(error) {
                reject(error);
            });
        });
    };
  }
  
  
  
  function getArgs(arguments) {
      var args = [];
      for (var x = 1; x < arguments.length; x++) {
          args.push(arguments[x]);
      }
      
      return args;
  }

  function getCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  
})();


