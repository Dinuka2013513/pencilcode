(function() {
    
  
  var $ = require('jquery');
  
  window.microdb = {
    /**
     * host of the micro db server
     */
    host: function() {
        return window.location.host + "/data";
    },
    getAvailableDBs: getAvailableDBs
  }
  window.MicroDB = MicroDB;
  
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
  }
  
  
  
  function getArgs(arguments) {
      var args = [];
      for (var x = 1; x < arguments.length; x++) {
          args.push(arguments[x]);
      }
      
      return args;
  }
  
  MicroDB.prototype.get = function(query) {
    return this.executeQuery('get', query, getArgs(arguments));
  };
  
  MicroDB.prototype.set = function(query) {
    return this.executeQuery('set', query, getArgs(arguments));
  };
  

  MicroDB.prototype.executeQuery = function(queryName, query, args) {
    var encodedQuery = encodeURIComponent(query);
    var encodedArgs = JSON.stringify(args);
    var url = this.url + "?" + queryName + "=" + encodedQuery + "&&args=" + encodedArgs;
    var self = this;
   
    return fetch(url);
    
    function fetch(url) {
        return new Promise(function(resolve, reject) {
            $.ajax({
                type: 'GET',
                url: url,
                dataType: 'JSON',
                success: function(json) {
                    resolve(json);
                },
                error: function(err, err1, ex) {
                    reject(err);
                }
            });
        });
    }
  };
  
  
})();


