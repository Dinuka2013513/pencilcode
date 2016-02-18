(function($) {
  window.microdb = {
    /**
     * host of the micro db server
     */
    host: "pencilcode.net.dev/data",
    /**
     * user of the database
     */
    user: "",
    
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
    this.url = "http://" + window.microdb.user + "." + window.microdb.host + "/" + dbName;
  }
  
  MicroDB.prototype.get = function(query) {
    var encodedQuery = encodeURIComponent(query);
    var url = this.url + "?get=" + encodedQuery;
    return {
      then: function(callback) {
        $.ajax({
          type: 'GET',
          url: url,
          dataType: 'JSON',
          success: function(json) {
            callback(json);
          },
          error: function(err, err1, ex) {
            callback(null, err);
          }
        });
      }
    };
  };
  
  MicroDB.prototype.set = function(query) {
    var encodedQuery = encodeURIComponent(query);
    var url = this.url + "?set=" + encodedQuery;
    return {
      then: function(callback) {
        $.ajax({
          type: 'GET',
          url: url,
          dataType: 'JSON',
          success: function(json) {
            callback(json);
          },
          error: function(err, err1, ex) {
            callback(null, err);
          }
        });
      }
    };
  };
  
})($);
