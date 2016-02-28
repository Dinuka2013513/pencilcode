(function(mdInterpreter) {
    var JS_Interpreter;
	if (typeof exports === "object" && typeof module !== "undefined") {
        JS_Interpreter = require('./lib/JSInterpreter/Interpreter');
		module.exports = mdInterpreter(JS_Interpreter);
	} else if (typeof define === "function" && define.amd) {
        JS_Interpreter = require('Interpreter');
		define([], function() {
            return mdInterpreter(JS_Interpreter);
        });
	} else {
		var g;
		if (typeof window !== "undefined") {
			g = window;
		} else if (typeof global !== "undefined") {
			g = global;
		} else if (typeof self !=="undefined") {
			g = self;
		} else {
			g = this
		}

        JS_Interpreter = g.Interpreter;
		g.mdInterpreter = mdInterpreter(JS_Interpreter);
	}
})(function(Interpreter) {
    
    var transactionSource = ''
    + '\n' + '(function () {'
    + '\n' + '  var output = null;'
    + '\n' + '  if (typeof transactionMethod === "function") {'
    + '\n' + '    output = transactionMethod.apply(this, args);'
    + '\n' + '  } else {'
    + '\n' + '    throw new Error("Illegal argument error : Transaction method should be a callback function written in javascript");'
    + '\n' + '    }'
    + '\n' + '    return JSON.stringify({'
    + '\n' + '      output: output,'
    + '\n' + '      input: db'
    + '\n' + '    });'
    + '\n' + '})();';

    function execute(success, error, transaction, db, args) {
        var code = "console.log('Initializing data'); var db = " + JSON.stringify(db) + ";\n"
            + "var args = " + JSON.stringify(args) + ";\n"
            + "var ide = {trace: function (obj) {console.log('Trace : '+obj)}}; \n"
            + "var transactionMethod = " + transaction.toString() + ";\n"
            + transactionSource;
            
        console.log("###############################################");
        console.log(code);
        console.log("###############################################");

        try {
            console.log('Initializing the interpreter');
            var interpreter = new Interpreter(code, function (interpreter, scope) {
                //ide.trace into interpreter
                  (function () {
                    var ideObj = interpreter.createObject(scope);
                    interpreter.setProperty(scope, 'ide',ideObj);
                  
                    interpreter.setProperty(ideObj, 'trace',
                    interpreter.createNativeFunction(function (obj) {
                      if (ide && ide.trace && typeof ide.trace === "function") {
                            console.log("js-interpreter ## trace ------- : "+obj);
                          ide.trace(obj);
                      }
                      //TODO implement a socket emit to nortify the user. 
                      //So, that user can debug the code using logs
                    }));
                  })();
                    
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
    
    return {
        execute: execute
    }    
});
