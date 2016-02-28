
(function () {
    var output = null;
    if (typeof transactionMethod === "function") {
        output = transactionMethod.apply(this, args);
    } else {
        throw new Error("Illegal argument error : Transaction method should be a callback function written in javascript");
    }

    return JSON.stringify({
        output: output,
        input: db
    });
})();
