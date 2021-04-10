/*jshint esversion: 8 */
require('./emilstabs');
const $ = require('jquery');
const Handlebars = require('handlebars');
let template = require('../templates/tab.html');
let templateFunction = Handlebars.compile(template);


$(document).ready(function() {
  let filename = window.location.pathname;
  let uri = `/files` + filename;
  let model = {};
  if(uri) {
    $.get(uri, function(response){
      model.body = response;
      var name_decoded = decodeURIComponent(uri);
      model.name = name_decoded.substr(0, name_decoded.indexOf(".txt")).replace(/\/files\/(tabs|bass)\//g, "");
      model.uri = uri;
      var flashRegex = /<gflash>(.*)<\/gflash>/g;
      var matches = response.match(flashRegex);
      if(matches && matches.length > 0) {
        var flash = matches.map(function(m) {
            var parts = m.split(" ");
            return {
                url: parts[2].split("<")[0],
                width: parts[0].split(">")[1],
                height: parts[1]
            };
        });
        model.flash = flash;
    }
    $('.file').html(templateFunction(model));
    });
  }
  // if(filename == "/tabs/" || filename == "bass/") {
  //   ga('send', 'event', 'tab', 'index');
  //   window.location.replace("/");
  // } else if (filename) {
  //     App.file = new stab.tab({uri: filename});
  //     App.view = new stab.tabView({model: App.file});
  //     App.file.fetch();
  // } else {
  //   ga('send', 'event', 'tab', 'error', 'noFile');
  //   window.location.replace("/");
  // }
});
