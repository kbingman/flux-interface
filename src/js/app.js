window.$ = require('jquery');

// var Flightjs = require('flightjs');
var Immutable = require('immutable');
// var hello = require('helloworld');
var helloWorldUI = require('helloworld/ui');
helloWorldUI.attachTo(document);

var start = +new Date();

// hello.render('Hanna');
// hello.typewriter('Welcome to the Epsilon Eridani system. What would you like to do next?');

console.log(+new Date() - start);

// window.Flightjs = Flightjs;
// window.Immutable = Immutable;

// var state = { color: '', value: 0 };
//
// function updateUI() {
//   localStorage.setItem('state', JSON.stringify(state));
//   $('#colored-counter').css('color', state.color);
//   $('#colored-counter').html(state.value);
// }
//
// $(function () {
//   state = JSON.parse(localStorage.getItem('state')) || state;
//   updateUI();
// });
//
// $('#color').on('keyup', function () {
//     state.color = this.value;
//     updateUI();
// });
//
// $('#inc').on('click', function () {
//     state.value++;
//     updateUI();
// });
