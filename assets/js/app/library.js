$(document).ready(function(){
	M = window.M || {};
	M.Navigator = new M.mainRouter;
	Backbone.history.start();
	M.AppView = {};


	var collectionNames = ["videos", "recordings", "teachings", "readings"];
	var templates = {
		videos: _.template($("#videos-template").html()),
		recordings: _.template($("#recordings-template").html()),
		teachings: _.template($("#teachings-template").html()),
		readings: _.template($("#readings-template").html())
	}

	
	var templateView = Backbone.View.extend({
		
		  initialize: function(options){
		     this.options = options;
		     this.apiUrl = M.Controller.getApiUrl();
		     this.getCollectionPath = M.Controller.getCollectionPath();
		     this.collectionName = this.options.name;
		     this.cockpitAcc = M.Controller.getCockpitAccount();
		     this.template = this.options.template;
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
		  	console.log(this.collection, this.collectionName);
		  	var self = this;
		  	var el = $(self.options.element);
		  	//el.append(self.initiativeVidyaLokeTemplate(self.collection.models[0].toJSON()));
		  	el.append(self.template({rows: self.collection.toJSON()}));
		  	if(self.options.name === 'recordings') self.initScPlayer();

		  },
		  initScPlayer: function() {
		  	var self = this;
		  	// append the script to fetch custom sc player script
		  	_.delay(function(){
		  		var scScript = document.createElement('script');
		  		scScript.src = "../assets/js/lib/soundcloud-custom-player-master/js/sc-player.js";
		  		scScript.type = "text/javascript";
		  		document.body.append(scScript);
		  	}, 100);
		  }
	});
	

	// Fecth data for each collection in library group
	collectionNames.forEach(function(collection, index){
		console.log(collection, index);
		M.AppView[collection] = new templateView({
								name: collection, 
								element: "#"+collection,
								template: templates[collection]
							});
	});

	
	
	

});