M = window.M || {};


var configModel = Backbone.Model.extend({
	apiUrl: "//vana-cockpit.test.openrun.net/api/",
	apiPaths: {
		getCollection: "collections/get/"
	},
	apiKey: "daeacd8639318a64e2279f2697555e"
});

var routeModel = Backbone.Model.extend({
	type: "",
	page: 1,
	slug: "",
	action: ""
});

var filterModel = Backbone.Model.extend({
	initiatives: [],
	collab: [],
	year: "2018",
	all: false,
	sortBy: "newest",
	view: "grid"
});

var paginationModel = Backbone.Model.extend({
	perPage: 20,
	skip: 0,
	next: "",
	prev: ""
});

var loadingModel = Backbone.Model.extend({
	show: true
});

// Player global state

var playerState = Backbone.Model.extend({
  selected: 630
});

M.models = {};
M.models.navModel = routeModel;