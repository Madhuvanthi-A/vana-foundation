$(document).ready(function(){
	M = window.M || {};

	M.Navigator = new M.mainRouter;
	Backbone.history.start();

	var eventsView = Backbone.View.extend({

		eventsPageTemplate: _.template($("#events-page-template").html()),
		
		  initialize: function(){
		    console.log("initialize initiatives");
		     this.apiUrl = M.Controller.getApiUrl();
		     this.getCollectionPath = M.Controller.getCollectionPath();
		     this.collectionName = "events";
		     this.cockpitAcc = M.Controller.getCockpitAccount();
		     this.fetchData();
		  },
		  fetchData: function() {
		  	var self = this;

		  	// fetch the initiatives collection
		  	var reqUrl = self.apiUrl+self.getCollectionPath+self.collectionName+'?token='+self.cockpitAcc;
		  	self.collection = M.Controller.getCollection(reqUrl);
		  	self.collection.fetch().then(function(response){
	      		self.render();
	    	});
		  },
		  render: function() {
		  	console.log(this.collection, "initiatives");
		  	var self = this;
		  	var el = $("#events-page");
		  	//el.append(self.initiativeVidyaLokeTemplate(self.collection.models[0].toJSON()));
		  	el.append(self.eventsPageTemplate({rows: self.collection.toJSON()}));
		  	return;
		  }
	});


	M.AppView = new eventsView;
});