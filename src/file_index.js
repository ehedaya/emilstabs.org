/*jshint esversion: 8 */
require('./emilstabs');
const $ = require('jquery');
const Handlebars = require('handlebars');
let template = require('../templates/tabIndex.html');
let templateFunction = Handlebars.compile(template);

$(document).ready(function(){
  let type = window.location.pathname.replaceAll("/", "");
  let cacheKey = `tabIndex-${type}`;
  let render = function(data) {
    $('#tabIndex').html(templateFunction(data));
  };
  let cache, data;
  try {
    cache = sessionStorage.getItem(cacheKey);
    if(cache) {
      data = JSON.parse(cache);      
    }
  } catch (e) {
    
  }
  if(data) {    
    render(data);
  } else {
    $.getJSON(`https://api.github.com/repositories/7553334/contents/files/${type}`, function(response){      
      let filteredResponse = response.map(function(r) {
        r.localPath = r.path.replace("files/", "/");
        r.name = r.name.replace(".txt", "");
        return r;
      });
      console.debug("Response", response);
      render(response);
      sessionStorage.setItem(cacheKey, JSON.stringify(response));
    });    
  }

});

