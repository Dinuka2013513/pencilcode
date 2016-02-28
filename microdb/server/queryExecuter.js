var fs = require('fs');
var Interpreter = require('./JS-Interpreter/interpreter.js');

var transactionSource = fs.readFileSync(__dirname + '/scripts/newQuery.js').toString();

function execute(success, error, transaction, db, args) {
  var code = "console.log('Initializing data'); var db = " + JSON.stringify(db) + ";\n"
    + "var args = " + JSON.stringify(args) + ";\n"
    + "var ide = {trace: function (obj) {console.log('Trace : '+obj)}}; \n"
    + "var transactionMethod = " + transaction.toString() + ";\n"
    + transactionSource;
    
    
  console.log("######################\n"+code+"\n#####################");
    
    //code = "3*4";

  try {
    console.log('Initializing the interpreter');
    var interpreter = new Interpreter(code, function (interpreter, scope) {
        
        
      //ide.trace into interpreter
    //   (function () {
    //     var ideObj = interpreter.createObject(scope);
    //     interpreter.setProperty(scope, 'ide',ideObj);
    //   
    //     interpreter.setProperty(ideObj, 'trace',
    //     interpreter.createNativeFunction(function (obj) {
    //       console.log("js-interpreter ## trace ------- : "+obj);
    //       //TODO implement a socket emit to nortify the user. 
    //       //So, that user can debug the code using logs
    //     }));
    //   })();
        
      //Console logs into interpreter
      (function () {
        var consoleObj = interpreter.createObject(scope);
        interpreter.setProperty(scope, 'console',consoleObj);
      
        interpreter.setProperty(consoleObj, 'log',
        interpreter.createNativeFunction(function (text) {
          console.log("js-interpreter ## Console ------- : "+text);
          //TODO implement a socket emit to nortify the user. 
          //So, that user can debug the code using logs
        }));
      })();
      
      //Alert into interpreter
      (function () {
        interpreter.setProperty(scope, 'alert',
        interpreter.createNativeFunction(function (text) {
          console.log("js-interpreter ## Alert ------- : "+text);
          //TODO implement a socket emit to nortify the user. So, 
          //that user can debug the code using alerts
        }));
      })();
    });
    
    try {
      interpreter.run();
      var result = JSON.parse(interpreter.value.toString());
      console.log("Result : "+JSON.stringify(result));
      success(result);
    } catch (err) {
      console.log("Error in the query : "+err.stack);
      error("Error in the query : "+err.message);
    }
    
  } catch (er) {
    console.log("Error while executing the query : "+JSON.stringify(er));
    error("Error while executing the query : "+er);
  }
  
  
}
module.exports = {
  execute: execute
}