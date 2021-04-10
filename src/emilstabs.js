/*jshint esversion: 6 */
require('bootstrap/dist/css/bootstrap.min.css');
require('../stylesheets/emilstabs.css');
require('./ga');
const $ = require('jquery');

const nav = require('../templates/nav.html');
const footer = require('../templates/footer.html');


$(document).ready(function(){
  $('#nav').html(nav);  
  $('footer').html(footer);
});

