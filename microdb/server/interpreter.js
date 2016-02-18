var fs = require('fs');
var sandBox = require('sandbox');

var transactionSource = fs.readFileSync(__dirname + '/scripts/transaction.js').toString();

function execute(success, error, transaction, parameters) {
  var code = transactionSource
    .replace('transaction_data', JSON.stringify(parameters))
    .replace('transaction_method', transaction.toString());

  var sandbox = new sandBox();
  sandbox.run(code, function (out) {
    var processedResult;

    processedResult = out.result.substring(1, out.result.length - 1);

    try {
      processedResultJson = JSON.parse("" + processedResult + "");
    } catch (err) {
      error([{
          transactionCallbackSyntaxError: out.result
        }]);
      return;
    }

    if (out.console.length > 0) {
      error(out.console);
    } else {
      success({
        output: processedResultJson.output,
        input: processedResultJson.input
      });
    }

  });
  
}
module.exports = {
  execute: execute
}