
console.log("Starting the query");
//try {
    console.log("Came to try");
    (function () {
        console.log("Came to verify the callback");
        var output = null;
        if (typeof transactionMethod === 'function') {
            console.log("Callback is valid");
            output = transactionMethod.apply(this, args);
        } else {
            console.log("Callback is invalid");
            throw new Error("Illegal argument error : Transaction method should be a callback function written in javascript");
        }
        
        
        console.log("Processing done");
        
        return JSON.stringify({
            output: output,
            input: db
        });
    })();
// } catch (err) {
//     console.log("Came to catch");
//     //console.log("Script error ###############################");
//     //console.log(err.stack);
//     //console.log("###############################");
// }