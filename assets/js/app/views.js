

// Home view
var homeView = Backbone.View.extend({
  topSlideTemplate: _.template($("#top-slide-template").html()),
  initiativeVidyaLokeTemplate: _.template($("#initiative-vl-template").html()),
  initiativeVanaKrishiTemplate: _.template($("#initiative-vk-template").html()),
  collabRowTemplate: _.template($("#collab-row-template").html()),
  eventsRowTemplate: _.template($("#events-row-template").html()),
  vaRowTemplate: _.template($("#va-row-template").html()),
  footerBannerTemplate: _.template($("#foot-banner-template").html()),

  initialize: function() {
    this.apiUrl = "//vana-cockpit.test.openrun.net/api/";
    this.singletonPath = "singletons/get/";
    this.getCollectionPath = "collections/get/";
    this.singletons = ['home_top_slider', 'visual_archive_row', 'footer_banner'];
    this.collectionsList = ['initiatives', 'collaborations', 'events'];
    this.topSliderEl = $("#home-top-slider-js");
    this.cockpitAcc = "daeacd8639318a64e2279f2697555e";
    this.perPage = 20;
    this.skip = 0;
    //this.loadingModel = new loadingModel;
    //this.listenTo(this.loadingModel, 'change', this.toggleLoading);
    
    this.fetchData();
  },
  fetchData: function() {
    var self = this;

    // First fetch the top slider - which is a singleton in backend
    var reqUrl = self.apiUrl+self.singletonPath+self.singletons[0]+'?token='+self.cockpitAcc;

    self.topSlider = M.Controller.getSingleton(reqUrl);
    self.topSlider.fetch().then(function(response){
      self.render();
    });

  },
  render: function() {
    //this.$el.html('');
    //this.$el.append(this.template());
    var self = this;
    console.log(self.topSlider.get('gallery'));
    var gallery = self.topSlider.get('gallery');
    var carouselItem = [];
    gallery.forEach(function(slide){
      console.log(slide);
      //prepare slides
      self.topSliderEl.append(self.topSlideTemplate(slide))
      //carouselItem.push(self.topSlideTemplate(slide));
    });
    self.topSliderEl.children()[0].classList.add('active');
    console.log(carouselItem);
    self.lazyLoadCollections();

  },
  lazyLoadCollections: function(){
    //Fetch other collections
    var self = this;
    // First fetch the top slider - which is a singleton in backend
    var initiativeReqUrl = self.apiUrl+self.getCollectionPath+self.collectionsList[0]+'?token='+self.cockpitAcc;
    var collabReqUrl = self.apiUrl+self.getCollectionPath+self.collectionsList[1]+'?token='+self.cockpitAcc;
    var eventsReqUrl = self.apiUrl+self.getCollectionPath+self.collectionsList[2]+'?token='+self.cockpitAcc;
    var vaReqUrl = self.apiUrl+self.singletonPath+self.singletons[1]+'?token='+self.cockpitAcc;
    var footBannerUrl = self.apiUrl+self.singletonPath+self.singletons[2]+'?token='+self.cockpitAcc;

    self.initiatives = M.Controller.getCollection(initiativeReqUrl);
    self.initiatives.fetch().then(function(){
      self.renderInitiatives();
    });

    self.collaborations = M.Controller.getCollection(collabReqUrl);
    self.collaborations.fetch().then(function() {
      self.renderCollab();
    });

    self.events = M.Controller.getCollection(eventsReqUrl);
    self.events.fetch().then(function(response) {
      self.renderEvents();
    });
    
    self.visualArchive = M.Controller.getSingleton(vaReqUrl);
    self.visualArchive.fetch().then(function(response){
      
      self.renderVaRow();
    });

    self.footBanner = M.Controller.getSingleton(footBannerUrl);
    self.footBanner.fetch().then(function(){
      self.renderFootBanner();
    })
  },
  renderInitiatives: function(){
    var self = this;
    var el = $("#featured-initiatives");
    el.append(self.initiativeVidyaLokeTemplate(self.initiatives.models[0].toJSON()));
    el.append(self.initiativeVanaKrishiTemplate(self.initiatives.models[1].toJSON()));
    return;
  },
  renderCollab: function(){
    var self = this;
    var el = $("#featured-collab");
    el.append(self.collabRowTemplate(self.collaborations));
    return;
  },
  renderEvents: function(){
    var self = this;
    var el = $("#featured-events");
    console.log('events api response', self.events);
    el.append(self.eventsRowTemplate(self.events));
    return;
  },
  renderVaRow: function(){
    var self = this;
    var el = $("#visual-archive-row");
    el.append(self.vaRowTemplate(self.visualArchive.toJSON()));
    return;
  },
  renderNewsRow: function() {
    // to be added
  },
  renderFootBanner: function() {
    var self = this;
    var el = $("#footer-banner");
    el.append(self.footerBannerTemplate(self.footBanner.toJSON()));
    self.loadingModel.set({show: false});
    return;
  },
  toggleLoading: function(){
    //console.log("fetching data", new Date().getSeconds());
    var loadingOverlay = $('#loading-overlay');
    loadingOverlay.toggleClass('show');
  },
  cleanup: function() {
    this.$el.html('');
    this.$el.remove();
  }
});