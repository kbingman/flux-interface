var Flightjs = require('flightjs');
var hello = require('helloworld');

var start = +new Date();

hello.render('Mars');
console.log(+new Date() - start);

window.Flightjs = Flightjs;
