$(document).ready(function() {
    stab = {};
    stab.cacheTTL = 5 * 60 * 1000;
	stab.templateCache = {
		cache: {},
		get: function(filename, callback) {
			var self = this;
			var localStorageKey = "template-" + filename;
			if(!filename) {
    			console.error("No filename");
			}
			if(this.cache[filename]) {
				callback(this.cache[filename]);
			} else {
				var local_storage_cache = $.jStorage.get(localStorageKey);
				if( local_storage_cache ) {
					var compiled_template = Handlebars.compile(local_storage_cache);
					self.cache[filename] = compiled_template;
					callback(compiled_template);
				} else {
					$.get(filename, function(template) {
						$.jStorage.set(localStorageKey, template, {TTL: stab.cacheTTL });
						var compiled_template = Handlebars.compile(template);
						self.cache[filename] = compiled_template;
						callback(compiled_template);
					});
				}
			}
		}
	}

    stab.tab = Backbone.Model.extend({
        fetch: function() {
            var $this = this;
            var uri = "/files" + this.get('uri');
            if(uri) {
                $.get(uri, function(response) {
                    $this.set('body', response);
                    var name_decoded = decodeURIComponent(uri);
                    $this.set('name', name_decoded.substr(0, name_decoded.indexOf(".txt")).replace(/\/files\/(tabs|bass)\//g, ""));
                    $this.set('uri', uri);
                    var flashRegex = /<gflash>(.*)<\/gflash>/g;
                    var matches = response.match(flashRegex);
                    if(matches !== undefined && matches.length > 0) {
                      var flash = matches.map(function(m) {
                          var parts = m.split(" ");
                          return {
                              url: parts[2].split("<")[0],
                              width: parts[0].split(">")[1],
                              height: parts[1]
                          };
                      });
                      $this.set('flash', flash);
                      console.debug("Found Flash parts", flash);
                  }
                });
            } else {
                // no uri set
                ga('send', 'event', 'tab', 'error', 'noUri');
                window.location.replace("/");
            }
        }
    });
    stab.tabView = Backbone.View.extend({
        el: $('.file'),
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.template = "/templates/tab.html";
        },
        render: function() {
            var $this = this;
            stab.templateCache.get(this.template, function(template) {
                $this.$el.html(template($this.model.toJSON()));
                document.title = $this.model.get('name') + " - Emil's Tabs";
                $this.comments = new stab.commentsView({model: $this.model, el: this.$('.comments')});
            });
        }
    });

    stab.tabIndex = Backbone.Collection.extend({
        fetch: function(directory_path) {
	        var $this = this;
	        var cacheKey = "tabIndex-" + directory_path;
	        if(!directory_path) {
    	        console.error("No path");
    	        return false;
	        }
            var cached = $.jStorage.get(cacheKey);
            if(cached) {
                $this.set(cached);
                console.debug("Cached");
            } else {
    	        $.getJSON(directory_path, function(response) {
        	        var data = _.map(response, function(m) { return { name : m.substr(0, m.indexOf(".txt")), uri: m }; });
        	        $.jStorage.set(cacheKey, data, {TTL: stab.cacheTTL});
                    $this.set(data);
    	        })
            }
        }
    });

    stab.tabIndexView = Backbone.View.extend({
        el: $('#tabIndex'),
        initialize: function() {
            this.data = new stab.tabIndex();
            this.template = "/templates/tabIndex.html";
            this.listenTo(this.data, 'all', this.render);
            this.data.fetch("/files" + window.location.pathname);
        },
        render: function() {
            var $this = this;
            stab.templateCache.get(this.template, function(template) {
                $this.$el.html(template($this.data.toJSON()));
            })
        }
    });

    stab.staticView = Backbone.View.extend({
        initialize: function(options) {
            if(options && options.model) {
	            this.model = options.model;
			}
            this.render();
        },
        render: function() {
            var $this = this;
            stab.templateCache.get(this.template, function(template) {
				var template_data = $this.model ? $this.model.toJSON() : {};
                $this.$el.html(template(template_data));
                $this.postRender && $this.postRender();
            });
        }
    });

    stabSearch = Backbone.View.extend({
        initialize: function(options) {
            this.el = options.el;
            this.render();
        },
        render: function() {
            var $this = this;
			this.guitar = new Bloodhound({
				datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				prefetch: {
					url: '/files/tabs/index.php',
					filter: function(list) {
    					console.debug("Filtering");
						return  _.map(list, function(m) { return { name : m.substr(0, m.indexOf(".txt")), uri: '/tabs/' + m }; });
					}
				}
			});
			this.bass = new Bloodhound({
				datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				prefetch: {
					url: '/files/bass/index.php',
					filter: function(list) {
    					console.debug("Filtering");
						return  _.map(list, function(m) { return { name : m.substr(0, m.indexOf(".txt")), uri: '/bass/' + m }; });
					}
				}
			});

			this.guitar.initialize();
			this.bass.initialize();

			this.$('form input').typeahead({
				highlight: true,
    			}, {
    				name: "Guitar",
    				displayKey: "name",
    				source: $this.guitar.ttAdapter(),
    				templates: {
    					header: '<li class="dropdown-header">Guitar tabs</li>'
    				}
    			}, {
    				name: "Bass",
    				displayKey: "name",
    				source: $this.bass.ttAdapter(),
    				templates: {
    					header: '<li class="dropdown-header">Bass tabs</li>'
    				}
                });

        },
		events: {
			"typeahead:selected" : "process",
			"keypress" : "process",
			"submit form" : "process"
		},
		process: function(event, datum) {
			if(event.keyCode == 13) {
				event.preventDefault();
			}
			if(datum && datum.uri) {
                ga('send', 'event', 'search', 'process', datum.name);
                ga('send', 'pageview', '/search?q='+datum.name);
				window.location.replace(datum.uri);
			}
		},
    });

    stab.nav = stab.staticView.extend({
        el: $('#nav'),
        template: "/templates/nav.html",
        postRender: function() {
            this.stabSearch = new stabSearch({el: this.$('#nav-search')});
        }
    });

    stab.footer = stab.staticView.extend({
        el: $('footer'),
        template: "/templates/footer.html"
    });

    stab.commentsView = stab.staticView.extend({
        template: "/templates/comments.html"
    });


});
