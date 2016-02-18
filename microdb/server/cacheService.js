var cache = {};

var timeOuts = {};


function add(key, value, time) {
  //Remove timeouts if already exists
  if (timeOuts[key])
    clearTimeout(timeOuts[key]);

  cache[key] = value;
  timeOuts[key] = setTimeout(function () {
    remove(key);
  }, time);
}

function get(key) {
  return cache[key];
}

function remove(key) {
  if (timeOuts[key])
    clearTimeout(timeOuts[key]);
  timeOuts[key] = undefined;
  cache[key] = undefined;
  console.log("Cache was removed : " + key);
}

module.exports = {
  add: add,
  get: get,
  remove: remove
};