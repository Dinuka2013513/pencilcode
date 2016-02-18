(function (transactionMethod,obj) {
  var output = null;
  if (typeof transactionMethod === 'function') {
      output = transactionMethod.apply(null, obj);
  } else {
    throw new Error("Illegal argument error : Transaction method should be a callback function written in javascript");
  }
  return JSON.stringify({
    output: output,
    input: obj
  });
})(
  (function(){
    var transactionMethod = transaction_method;
    return transactionMethod;
  })(),
  (function(){   
    var obj = transaction_data;
    return obj;
  })()
);
