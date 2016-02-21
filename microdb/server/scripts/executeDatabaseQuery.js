output = transactionMethod.apply(null, args);
JSON.stringify({
    output: output,
    input: db
});
