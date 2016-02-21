(function (transactionMethod) {
  if (typeof transactionMethod === 'function') {
      setAsValid(transactionMethod);
  } else {
    throw new Error("Illegal argument error : Transaction method should be a callback function written in javascript");
  }
})(
  (function(){
    var transactionMethod = transaction_method;
    return transactionMethod;
  })()
);