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
                    $this.set('name', name_decoded.substr(0, name_decoded.indexOf(".txt")));
                    $this.set('uri', uri);
                })
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

    stab.nav = Backbone.View.extend({
        el: $('#nav'),
        initialize: function() {
            this.template = "/templates/nav.html";
            this.render();
        },
        render: function() {
            var $this = this;
            stab.templateCache.get(this.template, function(template) {
                $this.$el.html(template({}));
            })
        }
    });


});