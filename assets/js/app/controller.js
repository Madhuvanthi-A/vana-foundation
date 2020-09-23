
var controller = {
	getApiUrl: function() {
		return "//vana-cockpit.test.openrun.net/api/";
	},
	getCollectionPath: function() {
		return "collections/get/";
	},
	getCockpitAccount: function() {
		return "daeacd8639318a64e2279f2697555e";
	},
	getCollection: function(reqUrl){
		console.log(reqUrl);
		var collection = Backbone.Collection.extend({
			url: reqUrl,
			parse: function(data){
				return data['entries']
			},
			comparator: function(model){
				return -Number(model.get('year'));
			},
			sortByOldest: function() {
				var oldest = _.sortBy(this.models, function(model){
					return Number(model.get('year'));
				});
				this.models = oldest;
				return this;
			}
		});
		
		return new collection;
	},
	getSingleton: function(reqUrl){
		var model = Backbone.Model.extend({
			url: reqUrl
		});
		return new model;
	},
	hasRouteChanged: function(model){
		if(model.hasChanged()){
			return model.changedAttributes();
		} else return false;
	},
	filterCollection: function(collection, byFilter){
		return collection.filter(function(entry){
			return entry.get('tag')[0] === byFilter.trim();
		});		
	},
	filterCollectionByYear: function(collection, byFilter){
		return collection.filter(function(entry){
			return entry.get('year') === byFilter.trim();
		});		
	},
	sanitize: function(models){
		return _.map(models, function(item){
			return item.toJSON();
		});
	},
	onSearch: function(){
		
	}
}

M = window.M || {};
M.Controller = controller;