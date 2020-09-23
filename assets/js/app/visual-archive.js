$(document).ready(function(){
	M = window.M || {};



	var filterView = Backbone.View.extend({
		el: "#navbarSupportedContent",
		events: {
			"change input": "onInputChanged",
			"click #filter-view-toggle a": "onToggleView"
		},
		gridRowTemplate: _.template($("#grid-row").html()),
		gridItemTemplate: _.template($("#grid-card-item").html()),
		//listItemTemplate: _.template(),
		initialize: function(options){
			console.log("initialize filterView");
			var self = this;
			this.checkboxes = document.querySelectorAll('.dropdown-menu input');

			this.checkboxes.forEach(function(checkbox){
				self.updateCheckboxState(checkbox, false);
			});

			this.model = new filterModel({
						initiatives: [],
						collab: [],
						year: options.year,
						all: false,
						sortBy: options.sort,
						view: "grid"
					});

			this.legend = {
				initiatives: ['va', 'vk'],
				collab: ['sf', 'lm', 'see']
			}
			this.collection = options.collection;
			console.log(this.collection);
			this.parent = options.ctx;
			var self = this;
			this.filtered = [];


			if(this.parent.queryParams){
				this.filteredByQuery = this.parent.queryParams.map(function(tag){ 
					return M.Controller.filterCollection(self.collection, tag);  	
				});
				this.filtered = this.filteredByQuery.flat();

				this.routeChanged();
			}
			 _.bindAll(this, 'onInputChanged');
			 this.listenTo(this.model, "change", this.render);
			 this.listenTo(this.model, "change:view", this.toggleView);
		},
		routeChanged: function(){
			var self = this;
			if(this.parent.queryParams.length > 0){
				this.filteredByQuery = this.parent.queryParams.map(function(tag){ 
					return M.Controller.filterCollection(self.collection, tag);  	
				});
				this.filtered = this.filteredByQuery.flat();

				self.checkboxes.forEach(function(checkbox){
					
					if(self.parent.queryParams.indexOf(checkbox.dataset.filter) >= 0 ) {
						console.log(checkbox);
						self.updateCheckboxState(checkbox, true);	
					} else {
						self.updateCheckboxState(checkbox, false);
					}
					
				});

			}

			if(self.model.get("year")){
				var filterByYear;
				if(self.model.get("year") !== "All"){
					if(self.filtered.length > 0){
						var filterByYear = M.Controller.filterCollectionByYear(self.filtered, self.model.get("year"));
					} else {
						var filterByYear = M.Controller.filterCollectionByYear(self.collection, self.model.get("year"));	
					}
					console.log(self.model.get("year"), filterByYear);
					self.filtered = filterByYear;
				} 
				
				
			}
			
			this.render(); 
		},
		updatePath: function() {
			var path;
			if(this.model.toJSON().initiatives.length === 0 && this.model.toJSON().collab.length === 0){
				var checkedFilters = Array.from(this.checkboxes).map(function(box){ 
					if(box.checked === true) {
						return box.dataset.filter
					}
				});

				if(_.compact(checkedFilters).length === 0){
					path = '&/' + this.model.get('year');
					
				} else {
					path = _.compact(checkedFilters).join('&')+ 
								'/' + this.model.get('year');
				}
			} else {
				path = this.model.toJSON().initiatives.join('&') + 
							'&' + this.model.toJSON().collab.join('&') + 
							'/' + this.model.get('year');
			}
			
			
			M.Navigator.navigate('#filter/'+ path, {trigger: true});
			return;

		},
		render: function(){
			console.log("filter model changes");
			
			var self = this;
			var domCache=[];

			if(self.model.get('sortBy')){
				self.filtered = _.sortBy(self.filtered, function(item){
					return -Number(item.get('year'));
				});
			} else {
				self.filtered = _.sortBy(self.filtered, function(item){
					return Number(item.get('year'));
				});
			}

			if(self.model.get('view') === "grid") {
				var maxPerRow = 3;
				var filteredRows = _.chunk(self.filtered, maxPerRow);
				// need modelar template
				
				if (filteredRows.length > 0){

					//first loop over groups
					filteredRows.forEach(function(group){
						var rowEls = []
						//second loop over items
						group.forEach(function(item) {
							var itemEl = self.gridItemTemplate(item.toJSON());

							rowEls.push(itemEl);
						});
						domCache.push(self.gridRowTemplate({content: rowEls}));
					});
					$("#albums-view").html('');
					$("#albums-view").html(domCache);
					this.parent.initFancyBox();
				} else {
					if(!this.model.get('sortBy')){
						this.parent.collection = this.parent.collection.sortByOldest();
					}
					this.parent.render();
				}
			} else {

				if(self.filtered.length > 0 ){

					/*self.filtered.forEach(function(item){
						domCache.push('<h1>'+item.get('name')+'</h2>');
					});

					$("#albums-view").html('');
					$("#albums-view").html(domCache);
					*/

				} else {
					if(!this.model.get('sortBy')){
						this.parent.collection = this.parent.collection.sortByOldest();
					}
					this.parent.render();
				}
			}

			self.updatePath();
		},

		onInputChanged: function(e){
			var self = this;
			this.checkboxes = document.querySelectorAll('.dropdown-menu input');
			var currentTarget = e.currentTarget;
			var dataset = e.currentTarget.dataset;
			var dataKey = Object.keys(dataset)[0].trim();
			var modelClone = this.model.clone();
			var currentModel = modelClone.get(dataKey);
			var toSet = new Object();
			// check if input checked or uncheck
			if(e.currentTarget.checked){
				if(dataKey !== "all"){
					var newArray = new Array();
					newArray = currentModel.slice();
					newArray.push(dataset[dataKey]);
					toSet[dataKey] = newArray;

					var filteredByTag = M.Controller.filterCollection(self.collection, dataset[dataKey]);
					self.filtered = self.filtered.concat(filteredByTag);
					this.model.set(toSet);

				}
				else {
					self.filtered=[];
					// all key
					self.checkboxes.forEach(function(checkbox){
						self.updateCheckboxState(checkbox, true);
						if(checkbox.dataset["filter"]){
							var filteredByTag = M.Controller.filterCollection(self.collection, checkbox.dataset["filter"].trim());
							self.filtered = self.filtered.concat(filteredByTag);
						}
						
					});
					this.model.set({
						all: true,
						initiatives: ['va', 'vk'],
						collab: ['sf', 'lm', 'see']
					});
				}

			} else {
				// input unchecked
				if(dataKey !== "all"){
					var newArray = new Array();
					newArray = currentModel.slice();
					newArray.splice(newArray.indexOf(dataset[dataKey]), 1);
					
					
					toSet[dataKey] = newArray;

					self.filtered = self.filtered.filter(function(entry){
						return entry.get('tag')[0] !== dataset[dataKey];
					});
					console.log(toSet);
					this.model.set(toSet);
				} else {
					// all key
					self.filtered = [];
					self.checkboxes.forEach(function(checkbox){
						self.updateCheckboxState(checkbox, false);

					});
					this.model.set({
						all: false,
						initiatives: [],
						collab: []
					});
				}
				self.updatePath();
			}

			//console.log(this.model.toJSON());
		},
		updateCheckboxState: function(el, state){
			el.checked = state;
		},
		onToggleView: function(e){
			e.preventDefault();
			var clickedView = e.currentTarget.dataset.view;
			this.model.set({view: clickedView});
		},
		toggleView: function(){
			console.log("view toggling");
		}
	});


	var visualArchiveView = Backbone.View.extend({
		gridRowTemplate: _.template($("#grid-row").html()),
		gridItemTemplate: _.template($("#grid-card-item").html()),
		listItemTemplate: _.template($("#va-page-template").html()),
		vaGridTemplate: _.template($("#va-page-template").html()),
		
		  initialize: function(){
		     this.apiUrl = M.Controller.getApiUrl();
		     this.getCollectionPath = M.Controller.getCollectionPath();
		     this.collectionName = "visualArchive";

		     this.cockpitAcc = M.Controller.getCockpitAccount();
		     this.fetchData();
		  },
		  fetchData: function() {
		  	var self = this;

		  	// fetch the initiatives collection
		  	var reqUrl = self.apiUrl+self.getCollectionPath+self.collectionName+'?token='+self.cockpitAcc;
		  	self.collection = M.Controller.getCollection(reqUrl);
		  	self.collection.fetch().then(function(response){
		  		self.filterView = new filterView({
		  			collection: self.collection,
		  			query: self.queryParams || [],
		  			year: "All",
		  			sort: true,
		  			ctx: self
		  		});
	      		self.render();
	      		self.filterView.render();
	    	});
		  },
		  routeChanged: function(params, date, sortBy){
		  	//hook  to filters
		  	var self = this;
		  	self.queryParams = params;
		  	self.dateFilter = date || "All";

		  	if(self.filterView){
		  		self.filterView.model.set({
		  			year: self.dateFilter
		  		});
		  		self.filterView.routeChanged();
		  	}
		  },
		  render: function() {
		  	var self = this;
		  	var el = $("#albums-view");
		  	el.html('');
		  	var maxPerRow = 3;
		  	var chunked = _.chunk(self.collection.models, maxPerRow);
		  	var domCache = [];

		  	//first loop over groups
		  	chunked.forEach(function(group){
		  		var rowEls = []
		  		//second loop over items
		  		group.forEach(function(item) {
		  			var itemEl = self.gridItemTemplate(item.toJSON());

		  			rowEls.push(itemEl);
		  		});
		  		domCache.push(self.gridRowTemplate({content: rowEls.join('')}));
		  	});
		  	
		  	//el.append(self.vaGridTemplate({rows: self.collection.toJSON()}));
		  	
		  	el.append(domCache);
		  	self.initFancyBox();
		  	return;
		  },
		  initFancyBox: function(){
		  	$('[data-fancybox="visual-archive-preview"]:not(:first-child)').css('display', 'none');
		  	$('[data-fancybox="visual-archive-preview"]').fancybox({
		  	   baseClass: "fancybox-custom-layout",
		  	  infobar: false,
		  	  toolbar: false,
		  	  smallBtn: true,
		  	  fitToView   : true,
		  	  btnTpl: {
		  	  	// Arrows
		  	  	   arrowLeft:
		  	  	     '<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}">' +
		  	  	     '<img src="../assets/icon/left-arrow.png" />' +
		  	  	     "</button>",

		  	  	   arrowRight:
		  	  	     '<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}">' +
		  	  	     '<img src="../assets/icon/right-arrow.png" />' +
		  	  	     "</button>",
		  	  	smallBtn:
		  	  	'<button type="button" data-fancybox-close class="fancybox-button fancybox-close-small"  aria-label="Close">'+
		  	  	    '<img src="../assets/icon/6A_LIBRARY/Group 3302.png" class="">'+
		  	        '</button>'
		  	  },
		  	  thumbs : {
		  	    autoStart : true,
		  	    axis      : 'x'
		  	  },
		  	  preventCaptionOverlap: false,
		  	  idleTime: false,
		  	  gutter: 0,
		  	  margin    : 0,
		  	  caption: function(instance) {
		  	        return '<p>Siddhartha was born as an Indian prince, but he wasn’t born enlightened. It’s tempting to deify him; to say a God walked amongst us, but that would go against everything he taught us. The moment Prince Siddhart</p>';
		  	      },
		  	  afterLoad : function(instance, current) {
		  	  	
		  	          var pixelRatio = window.devicePixelRatio || 1;

		  	          if ( pixelRatio > 1.5 ) {
		  	              current.width  = current.width  / pixelRatio;
		  	              current.height = current.height / pixelRatio;
		  	          }
		  	   },
		  	  afterShow: function(instance, slide){
		  	  	console.log(instance, slide);
		  	  	// reduce offset 3 px due to some unknown reason
		  	  	// calculate the caption height
		  	  	var captionHeight = instance.$refs.stage.height() - 3 +20;
		  	  	instance.$refs.caption.css('height', '514px');
		  	  	instance.$refs.caption.css('opacity', 1);
		  	  
		  	  }
		  	});

		  }
	});


	M.AppView = new visualArchiveView;

	M.Navigator = new M.mainRouter;
	Backbone.history.start();

});